import * as consultationRepository from './consultation.repository.js';
import * as patientRepository from '../patient/patient.repository.js';
import { addConsultationJob } from '../queue/queue.service.js';

/**
 * Start a new consultation session for a patient.
 */
export const startConsultation = async (userId) => {
  // 1. Fetch patient profile to get patient ID
  const patient = await patientRepository.findPatientByUserId(userId);
  if (!patient) {
    return {
      success: false,
      status: 404,
      error: 'Patient profile not found. Complete profile registration first.',
    };
  }

  // 2. Create consultation
  const consultation = await consultationRepository.create(patient.id);

  return {
    success: true,
    consultation,
  };
};

/**
 * Fetch consultation details and verify owner access.
 */
export const getConsultation = async (userId, consultationId) => {
  const consultation = await consultationRepository.findById(consultationId);
  if (!consultation) {
    return {
      success: false,
      status: 404,
      error: 'Consultation session not found.',
    };
  }

  // Access Control: Ensure requesting patient owns the consultation
  // (In the future, this condition will allow assigned Doctors as well)
  if (consultation.patient.userId !== userId) {
    return {
      success: false,
      status: 403,
      error: 'You do not have permission to access this consultation.',
    };
  }

  return {
    success: true,
    consultation,
  };
};

/**
 * Add a new, immutable conversation chunk to a session.
 */
export const addChunk = async (userId, consultationId, { speaker, text }) => {
  // 1. Fetch and verify consultation session
  const consultation = await consultationRepository.findById(consultationId);
  if (!consultation) {
    return {
      success: false,
      status: 404,
      error: 'Consultation session not found.',
    };
  }

  // 2. Validate ownership
  if (consultation.patient.userId !== userId) {
    return {
      success: false,
      status: 403,
      error: 'You do not have permission to modify this consultation.',
    };
  }

  // 3. Verify session state is open
  const openStatuses = ['SETUP', 'ACTIVE'];
  if (!openStatuses.includes(consultation.status)) {
    return {
      success: false,
      status: 400,
      error: `Cannot add transcript chunks to a consultation that is ${consultation.status}.`,
    };
  }

  // 4. Transition status from SETUP to ACTIVE on the first interaction
  if (consultation.status === 'SETUP') {
    await consultationRepository.updateStatus(consultationId, {
      status: 'ACTIVE',
      startedAt: new Date(),
    });
  }

  // 5. Get the next sequence index atomically
  const sequence = await consultationRepository.getNextSequence(consultationId);

  // 6. Write the immutable chunk
  const chunk = await consultationRepository.createChunk({
    consultationId,
    speaker,
    text,
    sequence,
  });

  return {
    success: true,
    chunk,
  };
};

/**
 * Finalize and lock the consultation.
 */
export const finalizeConsultation = async (userId, consultationId) => {
  // 1. Fetch and verify session
  const consultation = await consultationRepository.findById(consultationId);
  if (!consultation) {
    return {
      success: false,
      status: 404,
      error: 'Consultation session not found.',
    };
  }

  // 2. Validate ownership
  if (consultation.patient.userId !== userId) {
    return {
      success: false,
      status: 403,
      error: 'You do not have permission to modify this consultation.',
    };
  }

  // 3. Verify it isn't already closed
  if (['PROCESSING', 'COMPLETED', 'CANCELLED'].includes(consultation.status)) {
    return {
      success: false,
      status: 400,
      error: 'Consultation is already closed or finalized.',
    };
  }

  // 4. Update status to PROCESSING and set endedAt timestamp
  const updatedConsultation = await consultationRepository.updateStatus(consultationId, {
    status: 'PROCESSING',
    endedAt: new Date(),
  });

  // 5. Add the job to the background queue for AI processing
  try {
    await addConsultationJob(consultationId);
  } catch (queueErr) {
    console.error(`Failed to queue consultation job ${consultationId}:`, queueErr.message);
    // Even if queue dispatch fails, we don't crash, but we note it.
    // In production, we'd log this as a critical error to a monitoring tool.
  }

  return {
    success: true,
    consultation: updatedConsultation,
  };
};

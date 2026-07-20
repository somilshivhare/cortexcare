import * as doctorRepository from './doctor.repository.js';
import * as consultationRepository from '../consultation/consultation.repository.js';
import { getClinicalContext } from '../clinicalContext/clinicalContext.service.js';
import { saveAttachmentDirect } from '../consultation/services/attachment.service.js';
import * as clinicalContextRepository from '../clinicalContext/clinicalContext.repository.js';
import prisma from '../../config/prisma.js';

/**
 * Helper to fetch and verify doctor profile exists.
 */
const getVerifiedDoctor = async (userId) => {
  const doctor = await doctorRepository.findDoctorByUserId(userId);
  if (!doctor) {
    return {
      success: false,
      status: 404,
      error: 'Doctor profile not found. Complete doctor registration first.',
    };
  }
  return { success: true, doctor };
};

/**
 * Fetch doctor profile.
 */
export const getDoctorProfile = async (userId) => {
  const result = await getVerifiedDoctor(userId);
  if (!result.success) return result;

  return {
    success: true,
    doctor: result.doctor,
  };
};

/**
 * Update doctor profile.
 */
export const updateDoctorProfile = async (userId, updateData) => {
  const verify = await getVerifiedDoctor(userId);
  if (!verify.success) return verify;

  const doctor = await doctorRepository.updateDoctorByUserId(userId, updateData);

  return {
    success: true,
    doctor,
  };
};

/**
 * Fetch dashboard statistics for a doctor.
 */
export const getDoctorDashboard = async (userId) => {
  const verify = await getVerifiedDoctor(userId);
  if (!verify.success) return verify;

  const pendingUnassignedCount = await doctorRepository.countPendingUnassigned(verify.doctor.clinicId);
  const claimedActiveCount = await doctorRepository.countClaimedActive(verify.doctor.id);

  return {
    success: true,
    stats: {
      pendingUnassignedCount,
      claimedActiveCount,
    },
  };
};

/**
 * Fetch consultations by status (pending or claimed).
 */
export const getConsultations = async (userId, status) => {
  const verify = await getVerifiedDoctor(userId);
  if (!verify.success) return verify;

  let consultations = [];
  if (status === 'pending') {
    consultations = await doctorRepository.findPending(verify.doctor.clinicId);
  } else if (status === 'claimed') {
    consultations = await doctorRepository.findClaimed(verify.doctor.id);
  } else {
    return {
      success: false,
      status: 400,
      error: "Invalid status parameter. Must be either 'pending' or 'claimed'.",
    };
  }

  return {
    success: true,
    consultations,
  };
};

/**
 * Claim an unassigned consultation session.
 */
export const claimConsultation = async (userId, consultationId) => {
  const verify = await getVerifiedDoctor(userId);
  if (!verify.success) return verify;

  // 1. Fetch consultation
  const consultation = await consultationRepository.findById(consultationId);
  if (!consultation) {
    return {
      success: false,
      status: 404,
      error: 'Consultation session not found.',
    };
  }

  // 2. Enforce clinic matching rule
  if (consultation.patient.clinicId !== verify.doctor.clinicId) {
    return {
      success: false,
      status: 403,
      error: 'You do not have permission to claim cases outside your clinic.',
    };
  }

  // 3. Enforce unassigned rule
  if (consultation.doctorId) {
    return {
      success: false,
      status: 400,
      error: 'This consultation is already claimed by another doctor.',
    };
  }

  // 4. Enforce valid state for claiming (must be completed or processing transcript)
  if (!['PROCESSING', 'COMPLETED'].includes(consultation.status)) {
    return {
      success: false,
      status: 400,
      error: 'Consultation transcript is still open or setup. Cannot claim yet.',
    };
  }

  // 5. Update assignment
  const updatedConsultation = await doctorRepository.claim(consultationId, verify.doctor.id);

  return {
    success: true,
    consultation: updatedConsultation,
  };
};

/**
 * Save or update doctor notes for an assigned consultation session.
 */
export const saveNotes = async (userId, consultationId, notes) => {
  const verify = await getVerifiedDoctor(userId);
  if (!verify.success) return verify;

  // 1. Fetch consultation
  const consultation = await consultationRepository.findById(consultationId);
  if (!consultation) {
    return {
      success: false,
      status: 404,
      error: 'Consultation session not found.',
    };
  }

  // 2. Validate doctor assignment
  if (consultation.doctorId !== verify.doctor.id) {
    return {
      success: false,
      status: 403,
      error: 'You do not have permission to log notes for this consultation.',
    };
  }

  // 3. Upsert note
  const doctorNote = await doctorRepository.upsertNote(consultationId, verify.doctor.id, notes);

  return {
    success: true,
    doctorNote,
  };
};

/**
 * Mark a consultation session review as complete.
 */
export const reviewConsultation = async (userId, consultationId) => {
  const verify = await getVerifiedDoctor(userId);
  if (!verify.success) return verify;

  // 1. Fetch consultation
  const consultation = await consultationRepository.findById(consultationId);
  if (!consultation) {
    return {
      success: false,
      status: 404,
      error: 'Consultation session not found.',
    };
  }

  // 2. Validate doctor assignment
  if (consultation.doctorId !== verify.doctor.id) {
    return {
      success: false,
      status: 403,
      error: 'You do not have permission to finalize review for this consultation.',
    };
  }

  // 3. Update status to REVIEWED
  const updatedConsultation = await doctorRepository.markReviewed(consultationId);

  return {
    success: true,
    consultation: updatedConsultation,
  };
};

/**
 * Retrieve the Clinical Context for an assigned consultation.
 * REUSES the existing Clinical Context service directly.
 */
export const getConsultationContext = async (userId, consultationId) => {
  // Call the shared Clinical Context module directly with the DOCTOR role
  return await getClinicalContext(userId, 'DOCTOR', consultationId);
};

/**
 * Fetch all patients registered in the doctor's clinic.
 */
export const getClinicPatients = async (userId) => {
  const verify = await getVerifiedDoctor(userId);
  if (!verify.success) return verify;

  if (!verify.doctor.clinicId) {
    return {
      success: true,
      patients: [],
    };
  }

  const patients = await doctorRepository.findPatientsByClinicId(verify.doctor.clinicId);
  return {
    success: true,
    patients,
  };
};

/**
 * Handle doctor uploading an attachment to a consultation.
 */
export const uploadAttachment = async (userId, consultationId, file) => {
  const verify = await getVerifiedDoctor(userId);
  if (!verify.success) return verify;

  const consultation = await consultationRepository.findById(consultationId);
  if (!consultation) {
    return {
      success: false,
      status: 404,
      error: 'Consultation session not found.',
    };
  }

  // Access check: Doctor must be assigned to consultation, or belong to same clinic as patient
  if (consultation.doctorId !== verify.doctor.id && consultation.patient.clinicId !== verify.doctor.clinicId) {
    return {
      success: false,
      status: 403,
      error: 'You do not have permission to upload files for this consultation.',
    };
  }

  const attachment = await saveAttachmentDirect(consultationId, file);

  return {
    success: true,
    attachment,
  };
};

/**
 * Expose longitudinal patient clinical history to doctor.
 */
export const getPatientClinicalHistory = async (userId, patientId) => {
  const verify = await getVerifiedDoctor(userId);
  if (!verify.success) return verify;

  // 1. Fetch patient
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
  });

  if (!patient) {
    return {
      success: false,
      status: 404,
      error: 'Patient not found.',
    };
  }

  // 2. Validate clinic affiliation
  if (patient.clinicId !== verify.doctor.clinicId) {
    return {
      success: false,
      status: 403,
      error: 'Access denied. Patient is not enrolled in your clinic.',
    };
  }

  // 3. Fetch all clinical contexts for this patient
  const clinicalContexts = await clinicalContextRepository.findAllByPatientId(patientId);

  return {
    success: true,
    clinicalContexts,
  };
};

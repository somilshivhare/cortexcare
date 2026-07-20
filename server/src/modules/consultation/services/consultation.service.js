import * as repo from '../consultation.repository.js';
import * as patientRepository from '../../patient/patient.repository.js';
import { addConsultationJob } from '../../queue/queue.service.js';
import { AIOrchestrator } from '../ai/AIOrchestrator.js';
import * as clinicalContextService from './clinicalContext.service.js';

/**
 * ConsultationService — orchestrates the full AI consultation lifecycle.
 * Handles: session start, history fetch, message flow, finalization, and worker jobs.
 */

/**
 * Start a new consultation session for a patient.
 */
export const startConsultation = async (userId) => {
  const patient = await patientRepository.findPatientByUserId(userId);
  if (!patient) {
    return { success: false, status: 404, error: 'Patient profile not found. Complete registration first.' };
  }
  const consultation = await repo.create(patient.id);
  return { success: true, consultation };
};

/**
 * Fetch consultation details including messages and attachments.
 * Enforces ownership: only the owning patient may read the session.
 */
export const getConsultation = async (userId, consultationId) => {
  const consultation = await repo.findById(consultationId);
  if (!consultation) {
    return { success: false, status: 404, error: 'Consultation session not found.' };
  }
  if (consultation.patient.userId !== userId) {
    return { success: false, status: 403, error: 'Access denied.' };
  }
  return { success: true, consultation };
};

/**
 * Save a patient message, call Gemini for a reply, save the reply.
 * Returns both message objects to the caller for optimistic UI reconciliation.
 */
export const sendMessage = async (userId, consultationId, text) => {
  const consultation = await repo.findById(consultationId);
  if (!consultation) return { success: false, status: 404, error: 'Consultation session not found.' };
  if (consultation.patient.userId !== userId) return { success: false, status: 403, error: 'Access denied.' };

  const openStatuses = ['SETUP', 'ACTIVE'];
  if (!openStatuses.includes(consultation.status)) {
    return { success: false, status: 400, error: `Cannot send messages to a ${consultation.status} consultation.` };
  }

  // Transition SETUP → ACTIVE on first message
  if (consultation.status === 'SETUP') {
    await repo.updateStatus(consultationId, { status: 'ACTIVE', startedAt: new Date() });
  }

  // Save patient message
  const patientSeq = await repo.getNextSequence(consultationId);
  const patientMessage = await repo.createMessage({ consultationId, speaker: 'PATIENT', text, sequence: patientSeq });

  // Reload to get fresh history for prompt
  const refreshed = await repo.findById(consultationId);

  // Get current consultation state (from clinical context if it exists)
  const consultationState = null; // State is only generated after synthesis

  // Build and send prompt via AIOrchestrator
  const aiText = await AIOrchestrator.getConversationReply({
    patient: refreshed.patient,
    messages: refreshed.messages,
    attachments: refreshed.attachments,
    consultationState,
    currentMessage: text,
  });

  // Save AI reply
  const aiSeq = await repo.getNextSequence(consultationId);
  const aiMessage = await repo.createMessage({ consultationId, speaker: 'AI', text: aiText, sequence: aiSeq });

  return { success: true, patientMessage, aiMessage };
};

/**
 * Lock the consultation and enqueue the clinical context synthesis job.
 */
export const finalizeConsultation = async (userId, consultationId) => {
  const consultation = await repo.findById(consultationId);
  if (!consultation) return { success: false, status: 404, error: 'Consultation session not found.' };
  if (consultation.patient.userId !== userId) return { success: false, status: 403, error: 'Access denied.' };

  if (['PROCESSING', 'COMPLETED', 'CANCELLED'].includes(consultation.status)) {
    return { success: false, status: 400, error: 'Consultation is already finalized.' };
  }

  const updated = await repo.updateStatus(consultationId, { status: 'PROCESSING', endedAt: new Date() });

  try {
    await addConsultationJob(consultationId);
  } catch (err) {
    console.error(`[ConsultationService] Failed to enqueue job for ${consultationId}:`, err.message);
  }

  return { success: true, consultation: updated };
};

/**
 * Process a background BullMQ clinical context synthesis job.
 */
export const processJob = async (data) => {
  const { consultationId } = data;
  try {
    // Perform clinical context generation
    await clinicalContextService.synthesizeClinicalContext(consultationId);
    
    // Set status to COMPLETED upon success
    await repo.updateStatus(consultationId, { status: 'COMPLETED' });
    console.log(`[ConsultationService] Job for consultation ${consultationId} processed successfully.`);
  } catch (err) {
    console.error(`[ConsultationService] Job for consultation ${consultationId} failed:`, err.message);
    
    // Attempt to set status to FAILED in database
    try {
      await repo.updateStatus(consultationId, { status: 'FAILED' });
    } catch (dbErr) {
      console.error('[ConsultationService] Failed to set status to FAILED:', dbErr.message);
    }
    
    throw err; // Rethrow to propagate failure back to BullMQ
  }
};

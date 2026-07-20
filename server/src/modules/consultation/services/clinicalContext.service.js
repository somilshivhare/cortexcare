import * as repo from '../consultation.repository.js';
import * as clinicalContextRepository from '../../clinicalContext/clinicalContext.repository.js';
import { AIOrchestrator } from '../ai/AIOrchestrator.js';

/**
 * ClinicalContextService — orchestrates background AI synthesis.
 */
export const synthesizeClinicalContext = async (consultationId) => {
  const consultation = await repo.findById(consultationId);
  if (!consultation) throw new Error(`Consultation ${consultationId} not found.`);

  const messages = consultation.messages || [];
  const attachments = consultation.attachments || [];

  // Handle empty consultations gracefully
  if (messages.filter((m) => m.speaker === 'PATIENT').length === 0) {
    console.warn(`[ClinicalContextService] No patient messages for ${consultationId}. Writing placeholder.`);
    await clinicalContextRepository.create({
      consultationId,
      chiefComplaint: 'No dialogue recorded.',
      presentIllness: 'No conversation transcript available.',
      pastMedicalHistory: [],
      currentMedications: [],
      allergies: [],
      lifestyle: { smoking: 'Not reported', alcohol: 'Not reported', exercise: 'Not reported' },
      symptoms: [],
      timeline: [],
      riskFactors: [],
      riskLevel: 'LOW',
      recommendedSpecialist: 'General Practitioner',
      doctorSummary: 'Patient did not complete the intake session.',
      consultationState: { knownSymptoms: [], missingInformation: [], conversationComplete: false },
    });
    return;
  }

  // Fetch past clinical history context using the repository
  const pastHistory = await clinicalContextRepository.findPastHistory(consultation.patientId, consultationId);

  // Invoke the AI Orchestrator
  console.log(`[ClinicalContextService] Synthesizing clinical context for ${consultationId}...`);
  const parsedContext = await AIOrchestrator.synthesizeClinicalContext({
    patient: consultation.patient,
    messages,
    attachments,
    pastHistory,
  });

  // Persist using the repository
  await clinicalContextRepository.create({
    consultationId,
    ...parsedContext,
  });
  
  console.log(`[ClinicalContextService] Saved clinical context for ${consultationId}.`);
};

import * as timelineRepository from './timeline.repository.js';

/**
 * Retrieve the chronological timeline of events for a single consultation session.
 * @param {string} userId - Requester User ID
 * @param {string} role - Requester User Role (PATIENT or DOCTOR)
 * @param {string} consultationId - Target Consultation ID
 */
export const getConsultationTimeline = async (userId, role, consultationId) => {
  // 1. Fetch complete consultation tree
  const consultation = await timelineRepository.findFullConsultationTree(consultationId);
  if (!consultation) {
    return {
      success: false,
      status: 404,
      error: 'Consultation session not found.',
    };
  }

  // 2. Access Control: Patients must own their consultation
  if (role === 'PATIENT' && consultation.patient.userId !== userId) {
    return {
      success: false,
      status: 403,
      error: 'You do not have permission to view this consultation timeline.',
    };
  }

  // 3. Access Control: Doctors and Patients must belong to the same clinic
  if (role === 'DOCTOR') {
    const doctor = await timelineRepository.findDoctorByUserId(userId);
    if (!doctor || !doctor.clinicId || doctor.clinicId !== consultation.patient.clinicId) {
      return {
        success: false,
        status: 403,
        error: 'Access denied. You can only view timelines of patients belonging to your clinic.',
      };
    }
  }

  // 4. Calculate Summary details
  let durationSeconds = 0;
  if (consultation.startedAt && consultation.endedAt) {
    durationSeconds = Math.round((new Date(consultation.endedAt) - new Date(consultation.startedAt)) / 1000);
  }

  const summary = {
    duration: durationSeconds,
    totalMessages: consultation.chunks.length,
    status: consultation.status,
    reviewStatus: consultation.reviewStatus,
  };

  // 5. Gather all chronological events
  const events = [];

  // Event: Session Created
  events.push({
    type: 'SESSION_CREATED',
    timestamp: consultation.createdAt,
    data: {
      patientId: consultation.patientId,
      status: 'SETUP',
    },
  });

  // Event: Session Started
  if (consultation.startedAt) {
    events.push({
      type: 'SESSION_STARTED',
      timestamp: consultation.startedAt,
      data: {
        startedAt: consultation.startedAt,
        status: 'ACTIVE',
      },
    });
  }

  // Events: Transcript Chunks
  consultation.chunks.forEach((chunk) => {
    events.push({
      type: 'TRANSCRIPT_CHUNK',
      timestamp: chunk.createdAt,
      data: {
        sequence: chunk.sequence,
        speaker: chunk.speaker,
        text: chunk.text,
      },
    });
  });

  // Event: Session Finalized (locked for processing)
  if (consultation.endedAt) {
    events.push({
      type: 'SESSION_FINALIZED',
      timestamp: consultation.endedAt,
      data: {
        endedAt: consultation.endedAt,
        status: 'PROCESSING',
      },
    });
  }

  // Event: AI Clinical Context Processing Completed
  if (consultation.clinicalContext) {
    events.push({
      type: 'AI_ANALYSIS_COMPLETED',
      timestamp: consultation.clinicalContext.createdAt,
      data: {
        summary: consultation.clinicalContext.summary,
        symptoms: consultation.clinicalContext.symptoms,
        riskFlags: consultation.clinicalContext.riskFlags,
        recommendations: consultation.clinicalContext.recommendations,
        mood: consultation.clinicalContext.mood,
        confidenceScore: consultation.clinicalContext.confidenceScore,
      },
    });
  }

  // Event: Doctor Note Added/Updated
  if (consultation.doctorNote) {
    events.push({
      type: 'DOCTOR_NOTES_UPDATED',
      timestamp: consultation.doctorNote.updatedAt,
      data: {
        notes: consultation.doctorNote.notes,
        doctorId: consultation.doctorNote.doctorId,
      },
    });
  }

  // Event: Doctor Review Completed
  if (consultation.reviewedAt) {
    events.push({
      type: 'CLINICAL_REVIEW_COMPLETED',
      timestamp: consultation.reviewedAt,
      data: {
        reviewedAt: consultation.reviewedAt,
        status: 'COMPLETED',
        reviewStatus: 'REVIEWED',
      },
    });
  }

  // 6. Sort all gathered events chronologically
  events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return {
    success: true,
    summary,
    events,
  };
};

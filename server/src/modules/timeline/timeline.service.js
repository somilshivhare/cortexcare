import * as timelineRepository from './timeline.repository.js';

/**
 * Retrieve the chronological timeline of events for a single consultation session.
 */
export const getConsultationTimeline = async (userId, role, consultationId) => {
  const consultation = await timelineRepository.findFullConsultationTree(consultationId);
  if (!consultation) {
    return { success: false, status: 404, error: 'Consultation session not found.' };
  }

  if (role === 'PATIENT' && consultation.patient.userId !== userId) {
    return { success: false, status: 403, error: 'You do not have permission to view this timeline.' };
  }

  if (role === 'DOCTOR') {
    const doctor = await timelineRepository.findDoctorByUserId(userId);
    if (!doctor) {
      return {
        success: false,
        status: 403,
        error: 'Doctor profile not found.',
      };
    }

    const isAssigned = consultation.doctorId === doctor.id;
    const shareClinic = doctor.clinicId === consultation.patient.clinicId;

    if (!isAssigned && !shareClinic) {
      return {
        success: false,
        status: 403,
        error: 'Access denied. You can only view timelines of patients in your clinic.',
      };
    }
  }

  let durationSeconds = 0;
  if (consultation.startedAt && consultation.endedAt) {
    durationSeconds = Math.round((new Date(consultation.endedAt) - new Date(consultation.startedAt)) / 1000);
  }

  const summary = {
    duration: durationSeconds,
    totalMessages: consultation.messages.length,
    status: consultation.status,
    reviewStatus: consultation.reviewStatus,
  };

  const events = [];

  // Event: Session Created
  events.push({
    type: 'SESSION_CREATED',
    timestamp: consultation.createdAt,
    data: { patientId: consultation.patientId, status: 'SETUP' },
  });

  // Event: Session Started
  if (consultation.startedAt) {
    events.push({
      type: 'SESSION_STARTED',
      timestamp: consultation.startedAt,
      data: { startedAt: consultation.startedAt, status: 'ACTIVE' },
    });
  }

  // Events: Transcript Messages
  consultation.messages.forEach((msg) => {
    events.push({
      type: 'TRANSCRIPT_CHUNK',
      timestamp: msg.createdAt,
      data: {
        sequence: msg.sequence,
        speaker: msg.speaker,
        text: msg.text,
      },
    });
  });

  // Events: Attachments Uploaded
  consultation.attachments.forEach((att) => {
    events.push({
      type: 'FILE_UPLOADED',
      timestamp: att.uploadedAt,
      data: {
        fileName: att.fileName,
        fileType: att.fileType,
        cloudinaryUrl: att.cloudinaryUrl,
      },
    });
  });

  // Event: Session Finalized
  if (consultation.endedAt) {
    events.push({
      type: 'SESSION_FINALIZED',
      timestamp: consultation.endedAt,
      data: { endedAt: consultation.endedAt, status: 'PROCESSING' },
    });
  }

  // Event: AI Clinical Context Processing Completed
  if (consultation.clinicalContext) {
    events.push({
      type: 'AI_ANALYSIS_COMPLETED',
      timestamp: consultation.clinicalContext.createdAt,
      data: {
        chiefComplaint: consultation.clinicalContext.chiefComplaint,
        presentIllness: consultation.clinicalContext.presentIllness,
        symptoms: consultation.clinicalContext.symptoms,
        currentMedications: consultation.clinicalContext.currentMedications,
        medications: consultation.clinicalContext.currentMedications, // Backward compatibility fallback
        allergies: consultation.clinicalContext.allergies,
        pastMedicalHistory: consultation.clinicalContext.pastMedicalHistory,
        medicalHistory: consultation.clinicalContext.pastMedicalHistory, // Backward compatibility fallback
        lifestyle: consultation.clinicalContext.lifestyle,
        timeline: consultation.clinicalContext.timeline,
        riskFactors: consultation.clinicalContext.riskFactors,
        riskLevel: consultation.clinicalContext.riskLevel,
        recommendedSpecialist: consultation.clinicalContext.recommendedSpecialist,
        doctorSummary: consultation.clinicalContext.doctorSummary,
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

  // Sort chronologically
  events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return {
    success: true,
    summary,
    events,
  };
};

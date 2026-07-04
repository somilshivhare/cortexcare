import * as clinicalContextRepository from './clinicalContext.repository.js';

/**
 * Retrieve a single Clinical Context record by Consultation ID.
 * Enforces role-based access validation.
 * @param {string} userId - Requester User ID
 * @param {string} role - Requester User Role (PATIENT or DOCTOR)
 * @param {string} consultationId - Target Consultation ID
 */
export const getClinicalContext = async (userId, role, consultationId) => {
  const context = await clinicalContextRepository.findUniqueByConsultationId(consultationId);
  if (!context) {
    return {
      success: false,
      status: 404,
      error: 'Clinical context not found for this consultation.',
    };
  }

  // Access Control: If requester is a Patient, they must own the consultation
  if (role === 'PATIENT' && context.consultation.patient.userId !== userId) {
    return {
      success: false,
      status: 403,
      error: 'You do not have permission to view this clinical context.',
    };
  }

  // Exclude structural relationship payload helper details from response object
  const { consultation: _, ...cleanContext } = context;

  return {
    success: true,
    clinicalContext: cleanContext,
  };
};

/**
 * Retrieve all clinical context records for a patient.
 * @param {string} userId - Patient User ID
 */
export const getPatientClinicalContexts = async (userId) => {
  const clinicalContexts = await clinicalContextRepository.findAllByPatientUserId(userId);
  
  return {
    success: true,
    clinicalContexts,
  };
};

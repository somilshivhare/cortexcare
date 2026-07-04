import * as patientRepository from './patient.repository.js';

/**
 * Fetch patient profile details by User ID.
 */
export const getPatientProfile = async (userId) => {
  const patient = await patientRepository.findPatientByUserId(userId);
  if (!patient) {
    return {
      success: false,
      status: 404,
      error: 'Patient profile not found.',
    };
  }

  return {
    success: true,
    patient,
  };
};

/**
 * Update patient profile details by User ID.
 */
export const updatePatientProfile = async (userId, { firstName, lastName }) => {
  const patient = await patientRepository.findPatientByUserId(userId);
  if (!patient) {
    return {
      success: false,
      status: 404,
      error: 'Patient profile not found.',
    };
  }

  const updatedPatient = await patientRepository.updatePatientByUserId(userId, {
    firstName,
    lastName,
  });

  return {
    success: true,
    patient: updatedPatient,
  };
};

/**
 * Handle patient joining a clinic (Stub service).
 */
export const joinClinic = async (userId, clinicId) => {
  if (!clinicId) {
    return {
      success: false,
      status: 400,
      error: 'Clinic ID is required.',
    };
  }

  const registration = await patientRepository.joinClinicStub(userId, clinicId);

  return {
    success: true,
    registration,
  };
};

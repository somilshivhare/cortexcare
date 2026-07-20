import api from '../../../services/api.js';

/**
 * Fetch all clinical contexts for the authenticated patient.
 */
export const getPatientContextsApi = async () => {
  const response = await api.get('/clinical-context/patient');
  return response.data;
};

/**
 * Fetch a specific clinical context by Consultation ID (Doctor role).
 */
export const getConsultationContextApi = async (consultationId) => {
  const response = await api.get(`/doctor/consultations/${consultationId}/context`);
  return response.data;
};

/**
 * Fetch all clinical contexts of a patient (Doctor role).
 */
export const getDoctorPatientContextsApi = async (patientId) => {
  const response = await api.get(`/doctor/patients/${patientId}/clinical-context`);
  return response.data;
};

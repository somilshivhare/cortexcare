import api from '../../../services/api.js';

/**
 * Fetch doctor dashboard stats.
 */
export const getDoctorStatsApi = async () => {
  const response = await api.get('/doctor/dashboard');
  return response.data;
};

/**
 * Fetch consultations.
 * @param {string} status - Filter: pending, claimed
 */
export const getConsultationsApi = async (status) => {
  const params = status ? { status } : {};
  const response = await api.get('/doctor/consultations', { params });
  return response.data;
};

/**
 * Claim a consultation.
 */
export const claimConsultationApi = async (consultationId) => {
  const response = await api.post(`/doctor/consultations/${consultationId}/claim`);
  return response.data;
};

/**
 * Save clinical review notes.
 */
export const saveNotesApi = async (consultationId, notes) => {
  const response = await api.post(`/doctor/consultations/${consultationId}/notes`, { notes });
  return response.data;
};

/**
 * Finalize clinical review.
 */
export const reviewConsultationApi = async (consultationId) => {
  const response = await api.post(`/doctor/consultations/${consultationId}/review`);
  return response.data;
};

/**
 * Fetch all patients in the doctor's clinic.
 */
export const getClinicPatientsApi = async () => {
  const response = await api.get('/doctor/patients');
  return response.data;
};

/**
 * Upload an attachment to a patient consultation as a doctor.
 */
export const uploadDoctorAttachmentApi = async (consultationId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post(`/doctor/consultations/${consultationId}/attachments`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

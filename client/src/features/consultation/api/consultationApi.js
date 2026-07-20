import api from '@/services/api.js';

/**
 * Initialize a new clinical intake consultation session.
 * @returns {Promise<{message: string, consultation: {id: string}}>}
 */
export const createConsultation = async () => {
  const response = await api.post('/consultation');
  return response.data;
};

/**
 * Load the detailed conversation history and attachments of a consultation.
 * @param {string} consultationId - The consultation ID
 * @returns {Promise<{consultation: any}>}
 */
export const getConsultationDetail = async (consultationId) => {
  const response = await api.get(`/consultation/${consultationId}`);
  return response.data;
};

/**
 * Send a patient chat message and wait for the AI follow-up response.
 * @param {string} consultationId - The consultation ID
 * @param {string} text - The patient message text
 * @returns {Promise<{patientMessage: any, aiMessage: any}>}
 */
export const sendPatientMessage = async (consultationId, text) => {
  const response = await api.post(`/consultation/${consultationId}/messages`, { text });
  return response.data;
};

/**
 * Upload an attachment file to the consultation.
 * @param {string} consultationId - The consultation ID
 * @param {File} file - The file binary
 * @returns {Promise<{attachment: any}>}
 */
export const uploadAttachment = async (consultationId, file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post(`/consultation/${consultationId}/attachments`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Conclude the intake session and trigger background synthesis.
 * @param {string} consultationId - The consultation ID
 * @returns {Promise<{consultation: any}>}
 */
export const finalizeConsultation = async (consultationId) => {
  const response = await api.post(`/consultation/${consultationId}/finalize`);
  return response.data;
};

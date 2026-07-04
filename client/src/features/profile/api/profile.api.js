import api from '../../../services/api.js';

/**
 * Fetch patient profile details.
 */
export const getPatientProfileApi = async () => {
  const response = await api.get('/patient/profile');
  return response.data;
};

/**
 * Update patient profile details.
 */
export const updatePatientProfileApi = async (data) => {
  const response = await api.put('/patient/profile', data);
  return response.data;
};

/**
 * Fetch doctor profile details.
 */
export const getDoctorProfileApi = async () => {
  const response = await api.get('/doctor/profile');
  return response.data;
};

/**
 * Update doctor profile details.
 */
export const updateDoctorProfileApi = async (data) => {
  const response = await api.put('/doctor/profile', data);
  return response.data;
};

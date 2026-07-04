import api from '../../../services/api.js';

/**
 * Fetch patient profile details.
 */
export const getProfileApi = async () => {
  const response = await api.get('/patient/profile');
  return response.data;
};

/**
 * Fetch patient clinical contexts.
 */
export const getClinicalContextsApi = async () => {
  const response = await api.get('/clinical-context/patient');
  return response.data;
};

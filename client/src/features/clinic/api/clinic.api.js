import api from '../../../services/api.js';

/**
 * Fetch clinic details.
 */
export const getClinicDetailsApi = async () => {
  const response = await api.get('/clinic');
  return response.data;
};

/**
 * Create a new clinic (Doctor role only).
 */
export const createClinicApi = async (name) => {
  const response = await api.post('/clinic', { name });
  return response.data;
};

/**
 * Join an existing clinic using code.
 */
export const joinClinicApi = async (code) => {
  const response = await api.post('/clinic/join', { code });
  return response.data;
};

/**
 * Fetch clinic members directory (Doctor role only).
 */
export const getClinicMembersApi = async () => {
  const response = await api.get('/clinic/members');
  return response.data;
};

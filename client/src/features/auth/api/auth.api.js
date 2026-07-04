import api from '../../../services/api.js';

/**
 * Perform login request.
 * @param {object} credentials - User credentials
 * @param {string} credentials.email
 * @param {string} credentials.password
 */
export const loginApi = async ({ email, password }) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

/**
 * Perform registration request.
 * @param {object} data - User details
 * @param {string} data.email
 * @param {string} data.password
 * @param {string} data.role
 * @param {string} data.firstName
 * @param {string} data.lastName
 * @param {string} [data.specialty]
 */
export const registerApi = async (data) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

/**
 * Perform logout request.
 */
export const logoutApi = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

/**
 * Trigger silent refresh.
 */
export const refreshApi = async () => {
  const response = await api.post('/auth/refresh');
  return response.data;
};

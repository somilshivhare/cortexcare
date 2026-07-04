import api from '../../../services/api.js';

/**
 * Fetch unified consultation timeline events history.
 */
export const getTimelineApi = async (consultationId) => {
  const response = await api.get(`/timeline/${consultationId}`);
  return response.data;
};

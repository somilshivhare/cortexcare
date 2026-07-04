/**
 * Determine dashboard console path based on user role.
 * @param {string} role - The user role ('DOCTOR' | 'PATIENT')
 * @returns {string} The dashboard route path
 */
export const getDashboardRedirect = (role) => {
  if (role === 'DOCTOR') return '/doctor/dashboard';
  if (role === 'PATIENT') return '/patient/dashboard';
  return '/';
};

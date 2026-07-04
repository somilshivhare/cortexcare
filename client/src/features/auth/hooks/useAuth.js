import { useAuth as useAuthContext } from '../../../contexts/AuthContext.jsx';
import { loginApi, registerApi } from '../api/auth.api.js';

export const useAuth = () => {
  const context = useAuthContext();

  /**
   * Log in user using credentials.
   * @param {object} credentials
   * @param {string} credentials.email
   * @param {string} credentials.password
   */
  const loginUser = async ({ email, password }) => {
    const data = await loginApi({ email, password });
    if (data && data.accessToken) {
      context.login(data.accessToken);
    }
    return data;
  };

  /**
   * Register new patient/doctor and log them in.
   * @param {object} params
   */
  const registerUser = async (params) => {
    const data = await registerApi(params);
    if (data && data.accessToken) {
      context.login(data.accessToken);
    }
    return data;
  };

  return {
    user: context.user,
    isAuthenticated: context.isAuthenticated,
    isLoading: context.isLoading,
    login: loginUser,
    register: registerUser,
    logout: context.logout,
  };
};

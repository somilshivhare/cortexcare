import axios from 'axios';

// In-memory access token storage
let inMemoryAccessToken = null;

export const getAccessToken = () => inMemoryAccessToken;
export const setAccessToken = (token) => {
  inMemoryAccessToken = token;
};

// Instantiate centralized Axios Client
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial: Send cookies along with cross-origin requests
});

// Request Interceptor: Inject in-memory access token into Authorization header
api.interceptors.request.use(
  (config) => {
    console.log('[DEBUG] API Request:', config.method?.toUpperCase(), config.url);
    if (inMemoryAccessToken) {
      config.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle automatic silent refresh on 401 errors
api.interceptors.response.use(
  (response) => {
    console.log('[DEBUG] API Response success:', response.config.url, response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log('[DEBUG] API Response error:', originalRequest?.url, error.response?.status, error.message);

    // Trigger token refresh if request fails with 401 and hasn't been retried yet
    if (
      error.response &&
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh') // Prevent infinite loops if refresh itself fails
    ) {
      originalRequest._retry = true;

      try {
        console.log('Access token expired. Attempting background silent refresh...');
        
        // Request a new Access Token using the HttpOnly Refresh Token cookie
        const refreshResponse = await axios.post('/api/auth/refresh', {}, {
          withCredentials: true,
        });

        const { accessToken } = refreshResponse.data;
        setAccessToken(accessToken);

        // Retry the original request with the fresh token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Silent token refresh failed. User must log in again:', refreshError.message);
        setAccessToken(null);
        
        // Remove local user states and redirect to login
        localStorage.removeItem('user'); // We only store safe profile info in localStorage, never tokens
        window.location.href = '/auth/login';
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

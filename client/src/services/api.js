import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // send HttpOnly cookies
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthCheck = error.config?.url?.includes('/auth/me');
    const isLoginPage = window.location.pathname.includes('/login');

    // Only force-redirect on 401 if:
    // - NOT the /auth/me session-check (that's expected to 401 when logged out)
    // - NOT already on the login page
    if (error.response?.status === 401 && !isAuthCheck && !isLoginPage) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

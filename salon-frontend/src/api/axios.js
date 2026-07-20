import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('salon_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err.config;

    if (err.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      try {
        const oldToken = localStorage.getItem('salon_token');
        const refreshToken = localStorage.getItem('salon_refresh_token');

        if (!refreshToken) {
            throw new Error("No refresh token available");
        }

        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/Auth/refresh`, {
          token: oldToken,
          refreshToken: refreshToken
        });

        const { token: newToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem('salon_token', newToken);
        localStorage.setItem('salon_refresh_token', newRefreshToken);

        originalConfig.headers.Authorization = `Bearer ${newToken}`;
        
        return api(originalConfig);

      } catch (error) {
        localStorage.removeItem('salon_token');
        localStorage.removeItem('salon_refresh_token');
        localStorage.removeItem('salon_user');
        window.location.href = '/login';
        
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(err)
  }
)

export default api

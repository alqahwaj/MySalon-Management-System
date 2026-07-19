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

    // إذا الخطأ 401 (غير مصرح) والطلب ما حاول يتجدد قبل هيك عشان نمنع اللوب اللانهائي
    if (err.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      try {
        const oldToken = localStorage.getItem('salon_token');
        const refreshToken = localStorage.getItem('salon_refresh_token');

        // إذا ما في ريفريش توكن من الأساس، ارمي خطأ عشان يروح عالـ catch
        if (!refreshToken) {
            throw new Error("No refresh token available");
        }

        // نطلب توكن جديد من الباك إند اللي عملناه قبل شوي
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/Auth/refresh`, {
          token: oldToken,
          refreshToken: refreshToken
        });

        const { token: newToken, refreshToken: newRefreshToken } = response.data;

        // نحفظ التوكنات الجديدة بالـ LocalStorage
        localStorage.setItem('salon_token', newToken);
        localStorage.setItem('salon_refresh_token', newRefreshToken);

        // نحدث الهيدر تبع الطلب الأصلي اللي فشل بالتوكن الجديد
        originalConfig.headers.Authorization = `Bearer ${newToken}`;
        
        // نرجع نبعث الطلب الأصلي
        return api(originalConfig);

      } catch (error) {
        // إذا فشل التجديد (مثلاً الريفريش توكن نفسه خلصت الـ 7 أيام تبعته)
        // بننظف الداتا وبنطرد اليوزر يسجل دخول من أول وجديد
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
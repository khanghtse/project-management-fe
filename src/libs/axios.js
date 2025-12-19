import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1';

// 1. Tạo instance với withCredentials: true NGAY TỪ ĐẦU
// Điều này bắt buộc để browser gửi HttpOnly Cookie đi kèm mọi request
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper logout để dùng chung
const forceLogout = () => {
  localStorage.removeItem('accessToken');
  // Chuyển hướng cứng về trang login
  window.location.href = '/login'; 
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Kiểm tra xem lỗi có phải 401 và request này chưa từng được retry không
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Nếu chính API refresh-token bị lỗi 401 thì không retry nữa -> Logout luôn
      if (originalRequest.url.includes('/auth/refresh-token')) {
         forceLogout();
         return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // Gọi API lấy token mới (Cookie sẽ tự động được browser gửi kèm nhờ withCredentials: true)
        const res = await api.post('/auth/refresh-token');
        
        const { accessToken } = res.data;
        
        // Lưu token mới
        localStorage.setItem('accessToken', accessToken);

        // Gắn token mới vào header của request cũ
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // Gọi lại request ban đầu với token mới
        return api(originalRequest);

      } catch (refreshError) {
        // Trường hợp: Refresh Token cũng hết hạn hoặc không hợp lệ
        console.error("Refresh token failed, logging out...");
        forceLogout();
        return Promise.reject(refreshError);
      }
    }

    // Nếu lỗi không phải 401 hoặc đã retry rồi mà vẫn lỗi
    return Promise.reject(error);
  }
);

export default api;
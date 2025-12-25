import api from "../libs/axios";

export const userService = {
  getMe: async () => {
    const res = await api.get('/users/me');
    return res.data;
  },

  updateProfile: async (data) => {
    const res = await api.put('/users/me', data);
    return res.data;
  },

  updateAvatar: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  changePassword: async (data) => {
    const res = await api.put('/users/me/password', data);
    return res.data;
  }
};
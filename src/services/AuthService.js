import api from "../libs/axios"


export const authService = {
    login: async (email, password) => {
        const res = await api.post('/auth/login', { email, password});
        return res.data;
    },

    register: async (name, email, password) => {
        const res = await api.post('/auth/register', { name, email, password });
        return res.data;
    },

    loginWithGoogle: () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    },

    forgotPassword: async (email) => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  },

  resetPassword: async (token, newPassword) => {
    const res = await api.post('/auth/reset-password', { token, newPassword });
    return res.data;
  }
}
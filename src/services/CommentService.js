import api from "../libs/axios";


export const commentService = {
  getComments: async (taskId) => {
    const res = await api.get(`/tasks/${taskId}/comments`);
    return res.data;
  },

  addComment: async (taskId, content) => {
    const res = await api.post(`/tasks/${taskId}/comments`, { content });
    return res.data;
  }
};
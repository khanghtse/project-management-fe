import api from "../libs/axios";


export const attachmentService = {
  getAttachments: async (taskId) => {
    const res = await api.get(`/tasks/${taskId}/attachments`);
    return res.data;
  },

  uploadAttachment: async (taskId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await api.post(`/tasks/${taskId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  deleteAttachment: async (attachmentId) => {
    await api.delete(`/attachments/${attachmentId}`);
  }
};
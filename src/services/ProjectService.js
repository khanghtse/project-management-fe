import api from "../libs/axios";

export const projectService = {
  // Lấy project theo Workspace
  getProjects: async (workspaceId) => {
    const res = await api.get(`/workspaces/${workspaceId}/projects`);
    return res.data;
  },

  // Tạo Project mới
  createProject: async (workspaceId, data) => {
    const res = await api.post(`/workspaces/${workspaceId}/projects`, data);
    return res.data;
  }
};
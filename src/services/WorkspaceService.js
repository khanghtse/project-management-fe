import api from "../libs/axios";

export const workspaceService = {
  // Lấy danh sách Workspace của tôi
  getMyWorkspaces: async () => {
    const res = await api.get('/workspaces');
    return res.data;
  },

  // Tạo Workspace mới
  createWorkspace: async (data) => {
    const res = await api.post('/workspaces', data);
    return res.data;
  }
};
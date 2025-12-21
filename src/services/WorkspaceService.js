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
  },
  
  // Mời thành viên
  inviteMember: async (workspaceId, email) => {
    const res = await api.post(`/workspaces/${workspaceId}/invite`, { email });
    return res.data;
  },

  // Lấy danh sách thành viên (Cần thiết để chọn Assignee)
  // Bạn cần đảm bảo Backend có API này (nếu chưa, hãy dùng ProjectController để lấy qua project hoặc WorkspaceController)
  // Tạm thời giả sử ta có API này
  getMembers: async (workspaceId) => {
    // Nếu chưa có API backend, bạn cần thêm vào WorkspaceController:
    // @GetMapping("/{id}/members") -> return workspaceService.getMembers(id);
    const res = await api.get(`/workspaces/${workspaceId}/members`); 
    return res.data; 
  }
};
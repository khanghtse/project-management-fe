import api from "../libs/axios"

export const taskService = {
    // Lấy dữ liệu Board
    getBoard: async (projectId) => {
        const res = await api.get(`/projects/${projectId}/board`);
        return res.data;
    },

    // Tạo Task mới
    createTask: async (projectId, data) => {
        const res = await api.post(`/projects/${projectId}/tasks`, data);
        return res.data;
    },

    // Di chuyển Task (Kéo thả)
    moveTask: async (taskId, data) => {
        // data: { targetColumnId, prevTaskRank, nextTaskRank }
        const res = await api.put(`/tasks/${taskId}/move`, data);
        return res.data;
    },

    // Cập nhật Task
    updateTask: async (taskId, data) => {
        const res = await api.patch(`/tasks/${taskId}`, data);
        return res.data;
    },

    // Xóa Task
    deleteTask: async (taskId) => {
        await api.delete(`/tasks/${taskId}`);
    }
}
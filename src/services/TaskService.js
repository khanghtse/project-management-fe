import api from "../libs/axios"

export const taskService = {
    // Lấy dữ liệu Board
    getBoard: async (projectId, params) => {
        // params = { keyword, priority, isMyTask }
        const res = await api.get(`/projects/${projectId}/board`, { params });
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
    },

    // Subtasks
    createSubTask: async (parentTaskId, title) => {
        const res = await api.post(`/tasks/${parentTaskId}/subtasks`, { title });
        return res.data;
    },

    toggleSubTask: async (subTaskId) => {
        const res = await api.patch(`/subtasks/${subTaskId}/toggle`);
        return res.data;
    },

    deleteSubTask: async (subTaskId) => {
        await api.delete(`/subtasks/${subTaskId}`);
    },

    getTask: async (taskId) => {
        const res = await api.get(`/tasks/${taskId}`);
        return res.data;
    },
    getActivities: async (taskId) => {
        const res = await api.get(`/tasks/${taskId}/activities`);
        return res.data;
    },
}
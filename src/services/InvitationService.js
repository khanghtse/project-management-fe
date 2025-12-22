import api from "../libs/axios";


export const invitationService = {
  acceptInvitation: async (token) => {
    // Gọi API POST /api/v1/invitations/accept?token=...
    const res = await api.post(`/invitations/accept?token=${token}`);
    return res.data;
  }
};
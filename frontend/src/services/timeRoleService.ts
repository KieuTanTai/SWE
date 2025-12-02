import axiosClient from "@/utils/axiosClient"

export const timeRoleService = {
    getAllTimeRoles: async () => {
        const response = await axiosClient.get(`/time-roles`);
        return response.data;
    }
}
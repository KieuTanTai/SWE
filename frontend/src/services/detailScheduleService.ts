import axiosClient from "@/utils/axiosClient";

export const DetailScheduleService = {
  getAllDetailSchedules: async () => {
    const response = await axiosClient.get('/detail-schedules/');
    return response.data;
  },

  getDetailScheduleById: async (id: number) => {
    const response = await axiosClient.get(`/detail-schedules/${id}`);
    return response.data;
  },

  getByScheduleId: async (scheduleId: number) => {
    const response = await axiosClient.get(`/detail-schedules/schedule/${scheduleId}`);
    return response.data;
  },

  createDetailSchedule: async (data: {
    schedule_id: number;
    detail_schedule_bus_route_id: number;
    detail_schedule_time_role_id: number;
  }) => {
    const response = await axiosClient.post('/detail-schedules/', data);
    return response.data;
  },

  updateDetailSchedule: async (id: number, data: {
    detail_schedule_bus_route_id?: number;
    detail_schedule_time_role_id?: number;
  }) => {
    const response = await axiosClient.put(`/detail-schedules/${id}`, data);
    return response.data;
  },

  deleteDetailSchedule: async (id: number) => {
    const response = await axiosClient.delete(`/detail-schedules/${id}`);
    return response.data;
  },
}
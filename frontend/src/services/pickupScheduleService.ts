import axiosClient from "@/utils/axiosClient";

export const pickupScheduleService = {
  getAllPickupSchedules: async () => {
    const response = await axiosClient.get('/pickup-schedules/');
    return response.data;
  },

  getByPickupScheduleId: async (pickupScheduleId: number) => {
    const response = await axiosClient.get(`/pickup-schedules/${pickupScheduleId}`);
    return response.data;
  },

  createPickupSchedule: async (data: {
    pickup_schedule_student_id: number;
    pickup_schedule_detail_id: number;
  }) => {
    const response = await axiosClient.post('/pickup-schedules/', data);
    return response.data;
  },

  deletePickupSchedule: async (id: number) => {
    const response = await axiosClient.delete(`/pickup-schedules/${id}`);
    return response.data;
  },
}

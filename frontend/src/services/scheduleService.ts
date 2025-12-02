import { CreateScheduleDTO, Schedule, UpdateScheduleDTO } from '@/interfaces'
import axiosClient from '@/utils/axiosClient'

export const scheduleService = {
    // Get single schedule by ID
    getByScheduleId: async (scheduleId: number): Promise<Schedule> => {
        const response = await axiosClient.get(`/schedules/${scheduleId}`)
        return response.data as Schedule
    },

    // Get all schedules
    getAllSchedules: async (): Promise<Schedule[]> => {
        const response = await axiosClient.get('/schedules')
        return response.data as Schedule[]
    },

    // Create new schedule
    createSchedule: async (scheduleData: CreateScheduleDTO): Promise<{}> => {
        const schedule = {
            ...scheduleData,
            schedule_status: true,
        }
        const response = await axiosClient.post('/schedules', schedule)
        return response;
    },

    // Update existing schedule
    updateSchedule: async (scheduleId: number, scheduleData: UpdateScheduleDTO): Promise<{}> => {
        const response = await axiosClient.put(`/schedules/${scheduleId}`);
        return response;
    },

    // Delete schedule
    deleteSchedule: async (scheduleId: number): Promise<{}> => {
        const response = await axiosClient.delete(`/schedules/${scheduleId}`);
        return response;
    }
}
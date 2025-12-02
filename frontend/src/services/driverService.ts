// src/services/driverService.ts
import axiosClient from "@/utils/axiosClient";
import { Driver } from "@/interfaces/driver";
import { Person } from "@/interfaces";

export const driverService = {
  getAllDrivers: async () => {
    const response = await axiosClient.get('/drivers');
    return response.data;
  },

  getDriverById: async (id: number) => {
    const response = await axiosClient.get(`/drivers/${id}`);
    return response.data;
  },

  // Tạo Person -> Tạo Driver
  createDriver: async (data: Person) => {
    try {
      // 1. Create Person
      const personRes = await axiosClient.post('/persons', {
        person_name: data.person_name,
        person_phone: data.person_phone,
        person_gender: data.person_gender === 'Male' ? 1 : 0,
        person_birthday: data.person_birthday,
        person_type: 'driver', //
        person_life_cycle_status: 1
      });
      
      const newPersonId = personRes.data.person_id || personRes.data.insertId;

      // 2. Create Driver
      await axiosClient.post('/drivers', {
        driver_person_id: newPersonId,
        driver_experience: data.driver_experience,
        driver_experience_type: data.driver_experience_type,
        driver_late_arrival_count: 0
      });

      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  updateDriver: async (id: number, data: any) => {
    // Update Driver Info
    await axiosClient.put(`/drivers/${id}/experience`, {
        experience: data.driver_experience,
        experience_type: data.driver_experience_type
    });
    
    // Update Person Info (Nếu cần)
    // await axiosClient.put(`/persons/${id}`, { ... });
    
    return { success: true };
  },

  deleteDriver: async (id: number) => {
    // Gọi API xóa của backend (Thường backend sẽ xóa bảng Driver hoặc Person)
    await axiosClient.delete(`/drivers/${id}`);
    return { success: true };
  }
};
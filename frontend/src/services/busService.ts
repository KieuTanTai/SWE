// src/services/busService.ts
import axiosClient from "@/utils/axiosClient";
import { Bus } from "@/interfaces/bus";

export const busService = {
  getAllBuses: async () => {
    const response = await axiosClient.get('/buses');
    return response.data;
  },

  getBusById: async (id: number) => {
    const response = await axiosClient.get(`/buses/${id}`);
    return response.data;
  },

  createBus: async (data: Bus ) => {
    const payload = {
        bus_license_plate: data.bus_license_plate,
        bus_brand: data.bus_brand,
        bus_model: data.bus_model,
        bus_capacity: data.bus_capacity,
        bus_year_manufactured: data.bus_year_manufactured,
        bus_has_wifi: data.bus_has_wifi ? 1 : 0,     // SQL dùng tinyint 1/0
        bus_has_camera: data.bus_has_camera ? 1 : 0, // SQL dùng tinyint 1/0
        bus_color: data.bus_color,
        bus_status: 1
    };
    await axiosClient.post('/buses', payload);
    return { success: true };
  },

  updateBus: async (id: number, data: Bus) => {
    await axiosClient.put(`/buses/${id}`, {
        ...data,
        bus_has_wifi: data.bus_has_wifi ? 1 : 0,
        bus_has_camera: data.bus_has_camera ? 1 : 0,
    });
    return { success: true };
  },

  deleteBus: async (id: number) => {
    await axiosClient.delete(`/buses/${id}`);
    return { success: true };
  }
};
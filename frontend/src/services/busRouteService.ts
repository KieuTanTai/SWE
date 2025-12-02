import { BusRoute } from "@/interfaces";
import axiosClient from "@/utils/axiosClient"

export const busRouteService = {
    getAllBusRoutes: async (): Promise<BusRoute[]> => {
        const response = await axiosClient.get(`/bus-routes`);
        return response.data;
    },

    getBusRouteById: async (id: number): Promise<BusRoute> => {
        const response = await axiosClient.get(`/bus-routes/${id}`);
        return response.data;
    }
}
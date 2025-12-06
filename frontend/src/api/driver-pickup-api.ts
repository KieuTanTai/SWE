// src/api/driverPickupApi.ts
import axiosClient from "@/utils/axiosClient";

export interface UpdatePickupStatusBody {
    detailScheduleId: number;
    studentId: number;

    status: string;
    note?: string;
}

const driverPickupApi = {
    // GET /api/driver/trips/:detailScheduleId/pickups
    getPickupList(detailScheduleId: number) {
        return axiosClient.get(`/driver/trips/${detailScheduleId}/pickups`);
    },

    // POST /api/driver/pickups/:pickupScheduleId/status
    updateStatus(
        pickupScheduleId: number,
        body: UpdatePickupStatusBody
    ) {
        return axiosClient.post(`/driver/pickups/${pickupScheduleId}/status`, body);
    },
    createTripReport(detailScheduleId: number, body: any) {
        return axiosClient.post(
            `/driver/trips/${detailScheduleId}/report`,
            body
        );
    },
};

export default driverPickupApi;

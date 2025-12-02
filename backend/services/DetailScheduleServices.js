import { default as DetailScheduleDAO } from "../infrastructure/data/detailScheduleDAO.js";
import DetailSchedule from "../models/DetailSchedule.js";
import { withConnection, withTransaction } from "../infrastructure/connection/transactionHelper.js";
import ScheduleServices from "./ScheduleServices.js";
import BusRouteDAO from "../infrastructure/data/busRouteDAO.js";
import TimeRoleDAO from "../infrastructure/data/timeRoleDAO.js";
import PickupScheduleDAO from "../infrastructure/data/pickupScheduleDAO.js";
import PickupScheduleServices from "./PickupScheduleServices.js";
import BusRouteServices from "./BusRouteServices.js";
import BusDAO from "../infrastructure/data/busDAO.js";

/**
 * DetailScheduleServices
 * Service layer for managing detail schedules
 * Manages its own database connections and transactions
 */
class DetailScheduleServices {
    /**
     * Get all detail schedules
     * @return {Promise<{success: boolean, data?: DetailSchedule[], error?: string}>}
     */
    async getAllDetailSchedules() {
        try {
            const results = await withConnection(async (connection) => {
                const repo = new DetailScheduleDAO(connection);
                return await repo.getAllDetailSchedules();
            });
            
            return {
                success: true,
                data: results
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get detail schedule by ID
     * @param {number} detailScheduleId
     * @return {Promise<{success: boolean, data?: DetailSchedule, error?: string}>}
     */
    async getByDetailScheduleId(detailScheduleId) {
        try {
            if (!detailScheduleId || !Number.isInteger(detailScheduleId)) {
                return {
                    success: false,
                    error: 'Invalid detailScheduleId'
                };
            }

            const result = await withConnection(async (connection) => {
                const repo = new DetailScheduleDAO(connection);
                return await repo.getByDetailScheduleId(detailScheduleId);
            });
            
            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get detail schedules by schedule ID
     * @param {number} scheduleId
     * @return {Promise<{success: boolean, data?: DetailSchedule[], error?: string}>}
     */
    async getByScheduleId(scheduleId) {
        try {
            if (!scheduleId || !Number.isInteger(scheduleId)) {
                return {
                    success: false,
                    error: 'Invalid scheduleId'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new DetailScheduleDAO(connection);
                const busRouteRepo = new BusRouteDAO(connection);
                const timeRoleRepo = new TimeRoleDAO(connection);
                const busRepo  = new BusDAO(connection);

                const detailSchedules = await repo.getByScheduleId(scheduleId);
                const detailSchedule = detailSchedules[0];

                const busRoute = await busRouteRepo.getByBusRouteId(detailSchedule.detail_schedule_bus_route_id);
                busRoute.bus = await busRepo.getByBusId(busRoute.bus_id);

                detailSchedules[0].busRoute = busRoute;
                detailSchedules[0].timeRole = 
                    await timeRoleRepo.getByTimeRoleId(detailSchedule.detail_schedule_time_role_id);
                
                const pickups = await PickupScheduleServices.getByDetailScheduleId(detailSchedule.detail_schedule_id);
                detailSchedules[0].pickupSchedules = pickups;
                return detailSchedules;
            });
            
            return {
                success: true,
                data: results
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create a new detail schedule
     * @param {Object} detailScheduleData
     * @return {Promise<{success: boolean, data?: DetailSchedule, error?: string}>}
     */
    async createDetailSchedule(detailScheduleData) {
        try {
            const result = await withTransaction(async (connection) => {
                const repo = new DetailScheduleDAO(connection);
                return await repo.createDetailSchedule(detailScheduleData);
            });
            
            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Update a detail schedule
     * @param {number} detailScheduleId
     * @param {Object} detailScheduleData
     * @return {Promise<{success: boolean, data?: DetailSchedule, error?: string}>}
     */
    async updateDetailSchedule(detailScheduleId, detailScheduleData) {
        try {
            if (!detailScheduleId || !Number.isInteger(detailScheduleId)) {
                return {
                    success: false,
                    error: 'Invalid detailScheduleId'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new DetailScheduleDAO(connection);
                return await repo.updateDetailSchedule(detailScheduleId, detailScheduleData);
            });
            
            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Delete a detail schedule
     * @param {number} detailScheduleId
     * @return {Promise<{success: boolean, error?: string}>}
     */
    async deleteDetailSchedule(detailScheduleId) {
        try {
            if (!detailScheduleId || !Number.isInteger(detailScheduleId)) {
                return {
                    success: false,
                    error: 'Invalid detailScheduleId'
                };
            }

            await withTransaction(async (connection) => {
                const repo = new DetailScheduleDAO(connection);
                return await repo.deleteDetailSchedule(detailScheduleId);
            });
            
            return {
                success: true
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default new DetailScheduleServices();

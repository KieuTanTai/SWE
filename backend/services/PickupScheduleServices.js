import { default as PickupScheduleDAO } from "../infrastructure/data/pickupScheduleDAO.js";
import PickupSchedule from "../models/PickupSchedule.js";
import { withConnection, withTransaction } from "../infrastructure/connection/transactionHelper.js";

/**
 * PickupScheduleServices
 * Service layer for managing pickup schedules
 * Manages its own database connections and transactions
 */
class PickupScheduleServices {
    /**
     * Get all pickup schedules
     * @return {Promise<{success: boolean, data?: PickupSchedule[], error?: string}>}
     */
    async getAllPickupSchedules() {
        try {
            const results = await withConnection(async (connection) => {
                const repo = new PickupScheduleDAO(connection);
                return await repo.getAllPickupSchedules();
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
     * Get pickup schedule by ID
     * @param {number} pickupScheduleId
     * @return {Promise<{success: boolean, data?: PickupSchedule, error?: string}>}
     */
    async getByPickupScheduleId(pickupScheduleId) {
        try {
            if (!pickupScheduleId || !Number.isInteger(pickupScheduleId)) {
                return {
                    success: false,
                    error: 'Invalid pickupScheduleId'
                };
            }

            const result = await withConnection(async (connection) => {
                const repo = new PickupScheduleDAO(connection);
                return await repo.getByPickupScheduleId(pickupScheduleId);
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
     * Create a new pickup schedule
     * @param {Object} scheduleData
     * @return {Promise<{success: boolean, data?: PickupSchedule, error?: string}>}
     */
    async createPickupSchedule(scheduleData) {
        try {
            const result = await withTransaction(async (connection) => {
                const repo = new PickupScheduleDAO(connection);
                return await repo.createPickupSchedule(scheduleData);
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
     * Update a pickup schedule
     * @param {number} pickupScheduleId
     * @param {Object} scheduleData
     * @return {Promise<{success: boolean, data?: PickupSchedule, error?: string}>}
     */
    async updatePickupSchedule(pickupScheduleId, scheduleData) {
        try {
            if (!pickupScheduleId || !Number.isInteger(pickupScheduleId)) {
                return {
                    success: false,
                    error: 'Invalid pickupScheduleId'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new PickupScheduleDAO(connection);
                return await repo.updatePickupSchedule(pickupScheduleId, scheduleData);
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
     * Delete a pickup schedule
     * @param {number} pickupScheduleId
     * @return {Promise<{success: boolean, error?: string}>}
     */
    async deletePickupSchedule(pickupScheduleId) {
        try {
            if (!pickupScheduleId || !Number.isInteger(pickupScheduleId)) {
                return {
                    success: false,
                    error: 'Invalid pickupScheduleId'
                };
            }

            await withTransaction(async (connection) => {
                const repo = new PickupScheduleDAO(connection);
                return await repo.deletePickupSchedule(pickupScheduleId);
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

export default new PickupScheduleServices();

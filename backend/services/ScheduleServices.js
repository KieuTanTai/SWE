import { default as ScheduleDAO } from "../infrastructure/data/scheduleDAO.js";
import Schedule from "../models/Schedule.js";
import { withConnection, withTransaction } from "../infrastructure/connection/transactionHelper.js";

/**
 * ScheduleServices
 * Service layer for managing schedules
 * Manages its own database connections and transactions
 */
class ScheduleServices {
    /**
     * Get all schedules
     * @return {Promise<{success: boolean, data?: Schedule[], error?: string}>}
     */
    async getAllSchedules() {
        try {
            const results = await withConnection(async (connection) => {
                const repo = new ScheduleDAO(connection);
                return await repo.getAllSchedules();
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
     * Get schedule by ID
     * @param {number} scheduleId
     * @return {Promise<{success: boolean, data?: Schedule, error?: string}>}
     */
    async getByScheduleId(scheduleId) {
        try {
            if (!scheduleId || !Number.isInteger(scheduleId)) {
                return {
                    success: false,
                    error: 'Invalid scheduleId'
                };
            }

            const result = await withConnection(async (connection) => {
                const repo = new ScheduleDAO(connection);
                return await repo.getByScheduleId(scheduleId);
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
     * Create a new schedule
     * @param {Object} scheduleData
     * @return {Promise<{success: boolean, data?: Schedule, error?: string}>}
     */
    async createSchedule(scheduleData) {
        try {
            const result = await withTransaction(async (connection) => {
                const repo = new ScheduleDAO(connection);
                return await repo.createSchedule(scheduleData);
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
     * Update a schedule
     * @param {number} scheduleId
     * @param {Object} scheduleData
     * @return {Promise<{success: boolean, data?: Schedule, error?: string}>}
     */
    async updateSchedule(scheduleId, scheduleData) {
        try {
            if (!scheduleId || !Number.isInteger(scheduleId)) {
                return {
                    success: false,
                    error: 'Invalid scheduleId'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new ScheduleDAO(connection);
                return await repo.updateSchedule(scheduleId, scheduleData);
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
     * Delete a schedule
     * @param {number} scheduleId
     * @return {Promise<{success: boolean, error?: string}>}
     */
    async deleteSchedule(scheduleId) {
        try {
            if (!scheduleId || !Number.isInteger(scheduleId)) {
                return {
                    success: false,
                    error: 'Invalid scheduleId'
                };
            }

            await withTransaction(async (connection) => {
                const repo = new ScheduleDAO(connection);
                return await repo.deleteSchedule(scheduleId);
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

export default new ScheduleServices();

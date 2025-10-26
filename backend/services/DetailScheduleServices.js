import { default as DetailScheduleDAO } from "../infrastructure/data/detailScheduleDAO.js";
import DetailSchedule from "../models/DetailSchedule.js";
import { withConnection, withTransaction } from "../infrastructure/connection/transactionHelper.js";

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

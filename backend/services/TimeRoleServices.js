import { default as TimeRoleDAO } from "../infrastructure/data/timeRoleDAO.js";
import TimeRole from "../models/TimeRole.js";
import { withConnection, withTransaction } from "../infrastructure/connection/transactionHelper.js";

/**
 * TimeRoleServices
 * Service layer for managing time roles
 * Manages its own database connections and transactions
 */
class TimeRoleServices {
    /**
     * Get all time roles
     * @return {Promise<{success: boolean, data?: TimeRole[], error?: string}>}
     */
    async getAllTimeRoles() {
        try {
            const results = await withConnection(async (connection) => {
                const repo = new TimeRoleDAO(connection);
                return await repo.getAllTimeRoles();
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
     * Get time role by ID
     * @param {number} timeRoleId
     * @return {Promise<{success: boolean, data?: TimeRole, error?: string}>}
     */
    async getByTimeRoleId(timeRoleId) {
        try {
            if (!timeRoleId || !Number.isInteger(timeRoleId)) {
                return {
                    success: false,
                    error: 'Invalid timeRoleId'
                };
            }

            const result = await withConnection(async (connection) => {
                const repo = new TimeRoleDAO(connection);
                return await repo.getByTimeRoleId(timeRoleId);
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
     * Create a new time role
     * @param {Object} timeRoleData
     * @return {Promise<{success: boolean, data?: TimeRole, error?: string}>}
     */
    async createTimeRole(timeRoleData) {
        try {
            const result = await withTransaction(async (connection) => {
                const repo = new TimeRoleDAO(connection);
                return await repo.createTimeRole(timeRoleData);
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
     * Update a time role
     * @param {number} timeRoleId
     * @param {Object} timeRoleData
     * @return {Promise<{success: boolean, data?: TimeRole, error?: string}>}
     */
    async updateTimeRole(timeRoleId, timeRoleData) {
        try {
            if (!timeRoleId || !Number.isInteger(timeRoleId)) {
                return {
                    success: false,
                    error: 'Invalid timeRoleId'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new TimeRoleDAO(connection);
                return await repo.updateTimeRole(timeRoleId, timeRoleData);
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
     * Delete a time role
     * @param {number} timeRoleId
     * @return {Promise<{success: boolean, error?: string}>}
     */
    async deleteTimeRole(timeRoleId) {
        try {
            if (!timeRoleId || !Number.isInteger(timeRoleId)) {
                return {
                    success: false,
                    error: 'Invalid timeRoleId'
                };
            }

            await withTransaction(async (connection) => {
                const repo = new TimeRoleDAO(connection);
                return await repo.deleteTimeRole(timeRoleId);
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

export default new TimeRoleServices();

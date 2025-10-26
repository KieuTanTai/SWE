import { default as LocationWardDAO } from "../infrastructure/data/locationWardDAO.js";
import LocationWard from "../models/LocationWard.js";
import { withConnection, withTransaction } from "../infrastructure/connection/transactionHelper.js";

/**
 * LocationWardServices
 * Service layer for managing wards
 * Manages its own database connections and transactions
 */
class LocationWardServices {
    /**
     * Get all wards
     * @return {Promise<{success: boolean, data?: LocationWard[], error?: string}>}
     */
    async getAllWards() {
        try {
            const results = await withConnection(async (connection) => {
                const repo = new LocationWardDAO(connection);
                return await repo.getAllWards();
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
     * Get ward by ID
     * @param {number} wardId
     * @return {Promise<{success: boolean, data?: LocationWard, error?: string}>}
     */
    async getByWardId(wardId) {
        try {
            if (!wardId || !Number.isInteger(wardId)) {
                return {
                    success: false,
                    error: 'Invalid wardId'
                };
            }

            const result = await withConnection(async (connection) => {
                const repo = new LocationWardDAO(connection);
                return await repo.getByWardId(wardId);
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
     * Create a new ward
     * @param {Object} wardData
     * @return {Promise<{success: boolean, data?: LocationWard, error?: string}>}
     */
    async createWard(wardData) {
        try {
            const result = await withTransaction(async (connection) => {
                const repo = new LocationWardDAO(connection);
                return await repo.createWard(wardData);
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
     * Update a ward
     * @param {number} wardId
     * @param {Object} wardData
     * @return {Promise<{success: boolean, data?: LocationWard, error?: string}>}
     */
    async updateWard(wardId, wardData) {
        try {
            if (!wardId || !Number.isInteger(wardId)) {
                return {
                    success: false,
                    error: 'Invalid wardId'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new LocationWardDAO(connection);
                return await repo.updateWard(wardId, wardData);
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
     * Delete a ward
     * @param {number} wardId
     * @return {Promise<{success: boolean, error?: string}>}
     */
    async deleteWard(wardId) {
        try {
            if (!wardId || !Number.isInteger(wardId)) {
                return {
                    success: false,
                    error: 'Invalid wardId'
                };
            }

            await withTransaction(async (connection) => {
                const repo = new LocationWardDAO(connection);
                return await repo.deleteWard(wardId);
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

export default new LocationWardServices();

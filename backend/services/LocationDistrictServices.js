import { default as LocationDistrictDAO } from "../infrastructure/data/locationDistrictDAO.js";
import LocationDistrict from "../models/LocationDistrict.js";
import { withConnection, withTransaction } from "../infrastructure/connection/transactionHelper.js";

/**
 * LocationDistrictServices
 * Service layer for managing districts
 * Manages its own database connections and transactions
 */
class LocationDistrictServices {
    /**
     * Get all districts
     * @return {Promise<{success: boolean, data?: LocationDistrict[], error?: string}>}
     */
    async getAllDistricts() {
        try {
            const results = await withConnection(async (connection) => {
                const repo = new LocationDistrictDAO(connection);
                return await repo.getAllDistricts();
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
     * Get district by ID
     * @param {number} districtId
     * @return {Promise<{success: boolean, data?: LocationDistrict, error?: string}>}
     */
    async getByDistrictId(districtId) {
        try {
            if (!districtId || !Number.isInteger(districtId)) {
                return {
                    success: false,
                    error: 'Invalid districtId'
                };
            }

            const result = await withConnection(async (connection) => {
                const repo = new LocationDistrictDAO(connection);
                return await repo.getByDistrictId(districtId);
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
     * Create a new district
     * @param {Object} districtData
     * @return {Promise<{success: boolean, data?: LocationDistrict, error?: string}>}
     */
    async createDistrict(districtData) {
        try {
            const result = await withTransaction(async (connection) => {
                const repo = new LocationDistrictDAO(connection);
                return await repo.createDistrict(districtData);
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
     * Update a district
     * @param {number} districtId
     * @param {Object} districtData
     * @return {Promise<{success: boolean, data?: LocationDistrict, error?: string}>}
     */
    async updateDistrict(districtId, districtData) {
        try {
            if (!districtId || !Number.isInteger(districtId)) {
                return {
                    success: false,
                    error: 'Invalid districtId'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new LocationDistrictDAO(connection);
                return await repo.updateDistrict(districtId, districtData);
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
     * Delete a district
     * @param {number} districtId
     * @return {Promise<{success: boolean, error?: string}>}
     */
    async deleteDistrict(districtId) {
        try {
            if (!districtId || !Number.isInteger(districtId)) {
                return {
                    success: false,
                    error: 'Invalid districtId'
                };
            }

            await withTransaction(async (connection) => {
                const repo = new LocationDistrictDAO(connection);
                return await repo.deleteDistrict(districtId);
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

export default new LocationDistrictServices();

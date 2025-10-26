import { default as LocationCityDAO } from "../infrastructure/data/locationCityDAO.js";
import LocationCity from "../models/LocationCity.js";
import { withConnection, withTransaction } from "../infrastructure/connection/transactionHelper.js";

/**
 * LocationCityServices
 * Service layer for managing cities
 * Manages its own database connections and transactions
 */
class LocationCityServices {
    /**
     * Get all cities
     * @return {Promise<{success: boolean, data?: LocationCity[], error?: string}>}
     */
    async getAllCities() {
        try {
            const results = await withConnection(async (connection) => {
                const repo = new LocationCityDAO(connection);
                return await repo.getAllCities();
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
     * Get city by ID
     * @param {number} cityId
     * @return {Promise<{success: boolean, data?: LocationCity, error?: string}>}
     */
    async getByCityId(cityId) {
        try {
            if (!cityId || !Number.isInteger(cityId)) {
                return {
                    success: false,
                    error: 'Invalid cityId'
                };
            }

            const result = await withConnection(async (connection) => {
                const repo = new LocationCityDAO(connection);
                return await repo.getByCityId(cityId);
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
     * Create a new city
     * @param {Object} cityData
     * @return {Promise<{success: boolean, data?: LocationCity, error?: string}>}
     */
    async createCity(cityData) {
        try {
            const result = await withTransaction(async (connection) => {
                const repo = new LocationCityDAO(connection);
                return await repo.createCity(cityData);
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
     * Update a city
     * @param {number} cityId
     * @param {Object} cityData
     * @return {Promise<{success: boolean, data?: LocationCity, error?: string}>}
     */
    async updateCity(cityId, cityData) {
        try {
            if (!cityId || !Number.isInteger(cityId)) {
                return {
                    success: false,
                    error: 'Invalid cityId'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new LocationCityDAO(connection);
                return await repo.updateCity(cityId, cityData);
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
     * Delete a city
     * @param {number} cityId
     * @return {Promise<{success: boolean, error?: string}>}
     */
    async deleteCity(cityId) {
        try {
            if (!cityId || !Number.isInteger(cityId)) {
                return {
                    success: false,
                    error: 'Invalid cityId'
                };
            }

            await withTransaction(async (connection) => {
                const repo = new LocationCityDAO(connection);
                return await repo.deleteCity(cityId);
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

export default new LocationCityServices();

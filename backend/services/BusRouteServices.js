import { default as BusRouteDAO } from "../infrastructure/data/busRouteDAO.js";
import BusRoute from "../models/BusRoute.js";
import { withConnection, withTransaction } from "../infrastructure/connection/transactionHelper.js";

/**
 * BusRouteServices
 * Service layer for managing bus routes
 * Manages its own database connections and transactions
 */
class BusRouteServices {
    /**
     * Get all bus routes
     * @return {Promise<{success: boolean, data?: BusRoute[], error?: string}>}
     */
    async getAllBusRoutes() {
        try {
            const results = await withConnection(async (connection) => {
                const repo = new BusRouteDAO(connection);
                return await repo.getAllBusRoutes();
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
     * Get bus route by ID
     * @param {number} busRouteId
     * @return {Promise<{success: boolean, data?: BusRoute, error?: string}>}
     */
    async getByBusRouteId(busRouteId) {
        try {
            if (!busRouteId || !Number.isInteger(busRouteId)) {
                return {
                    success: false,
                    error: 'Invalid busRouteId'
                };
            }

            const result = await withConnection(async (connection) => {
                const repo = new BusRouteDAO(connection);
                return await repo.getByBusRouteId(busRouteId);
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
     * Get bus routes by multiple IDs
     * @param {number[]} busRouteIds
     * @return {Promise<{success: boolean, data?: BusRoute[], error?: string}>}
     */
    async getByBusRouteIds(busRouteIds) {
        try {
            if (!Array.isArray(busRouteIds) || busRouteIds.length === 0) {
                return {
                    success: false,
                    error: 'Invalid busRouteIds array'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new BusRouteDAO(connection);
                return await repo.getByBusRouteIds(busRouteIds);
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
     * Get bus routes by bus ID
     * @param {number} busId
     * @return {Promise<{success: boolean, data?: BusRoute[], error?: string}>}
     */
    async getByBusId(busId) {
        try {
            if (!busId || !Number.isInteger(busId)) {
                return {
                    success: false,
                    error: 'Invalid busId'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new BusRouteDAO(connection);
                return await repo.getByBusId(busId);
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
     * Get bus routes by multiple bus IDs
     * @param {number[]} busIds
     * @return {Promise<{success: boolean, data?: BusRoute[], error?: string}>}
     */
    async getByBusIds(busIds) {
        try {
            if (!Array.isArray(busIds) || busIds.length === 0) {
                return {
                    success: false,
                    error: 'Invalid busIds array'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new BusRouteDAO(connection);
                return await repo.getByBusIds(busIds);
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
     * Get bus routes by route ID
     * @param {number} routeId
     * @return {Promise<{success: boolean, data?: BusRoute[], error?: string}>}
     */
    async getByRouteId(routeId) {
        try {
            if (!routeId || !Number.isInteger(routeId)) {
                return {
                    success: false,
                    error: 'Invalid routeId'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new BusRouteDAO(connection);
                return await repo.getByRouteId(routeId);
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
     * Get bus routes by multiple route IDs
     * @param {number[]} routeIds
     * @return {Promise<{success: boolean, data?: BusRoute[], error?: string}>}
     */
    async getByRouteIds(routeIds) {
        try {
            if (!Array.isArray(routeIds) || routeIds.length === 0) {
                return {
                    success: false,
                    error: 'Invalid routeIds array'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new BusRouteDAO(connection);
                return await repo.getByRouteIds(routeIds);
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
     * Get bus routes by status
     * @param {boolean} busRouteStatus
     * @return {Promise<{success: boolean, data?: BusRoute[], error?: string}>}
     */
    async getByBusRouteStatus(busRouteStatus) {
        try {
            if (!busRouteStatus || typeof busRouteStatus !== 'string') {
                return {
                    success: false,
                    error: 'Invalid busRouteStatus'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new BusRouteDAO(connection);
                return await repo.getByBusRouteStatus(busRouteStatus);
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
     * Create a new bus route
     * @param {BusRoute} busRoute
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async createBusRoute(busRoute) {
        try {
            if (!busRoute || !(busRoute instanceof BusRoute)) {
                return {
                    success: false,
                    error: 'Invalid busRoute object'
                };
            }

            const busRouteId = await withTransaction(async (connection) => {
                const repo = new BusRouteDAO(connection);
                return await repo.createBusRoute(busRoute);
            });
            
            return {
                success: true,
                data: busRouteId
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Update bus route status
     * @param {number} busRouteId
     * @param {boolean} status
     * @return {Promise<{success: boolean, data?: boolean, error?: string}>}
     */
    async updateBusRouteStatus(busRouteId, status) {
        try {
            if (!busRouteId || !Number.isInteger(busRouteId)) {
                return {
                    success: false,
                    error: 'Invalid busRouteId'
                };
            }

            if (typeof status !== 'boolean') {
                return {
                    success: false,
                    error: 'Invalid status'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new BusRouteDAO(connection);
                return await repo.updateBusRouteStatus(busRouteId, status);
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
     * Update multiple bus routes' status
     * @param {BusRoute[]} busRoutes - Array of bus routes with updated status
     * @return {Promise<{success: boolean, data?: boolean, error?: string}>}
     */
    async updateBusRoutesStatus(busRoutes) {
        try {
            if (!Array.isArray(busRoutes) || busRoutes.length === 0) {
                return {
                    success: false,
                    error: 'Invalid busRoutes array'
                };
            }

            if (!busRoutes.every(br => br instanceof BusRoute)) {
                return {
                    success: false,
                    error: 'All items must be BusRoute instances'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new BusRouteDAO(connection);
                return await repo.updateBusRoutesStatus(busRoutes);
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
     * Delete a bus route
     * @param {number} busRouteId
     * @return {Promise<{success: boolean, data?: boolean, error?: string}>}
     */
    async deleteBusRoute(busRouteId) {
        try {
            if (!busRouteId || !Number.isInteger(busRouteId)) {
                return {
                    success: false,
                    error: 'Invalid busRouteId'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new BusRouteDAO(connection);
                return await repo.deleteBusRoute(busRouteId);
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
}

export default BusRouteServices;
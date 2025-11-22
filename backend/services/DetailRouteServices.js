import { default as DetailRouteDAO } from "../infrastructure/data/detailRouteDAO.js";
import DetailRoute from "../models/DetailRoute.js";
import { withConnection, withTransaction } from "../infrastructure/connection/transactionHelper.js";
import BusRouteDAO from "../infrastructure/data/busRouteDAO.js";
import RouteDAO from "../infrastructure/data/routeDAO.js";

/**
 * DetailRouteServices
 * Service layer for managing detail routes
 */
class DetailRouteServices {
    /**
     * Get all detail routes
     * @return {Promise<{success: boolean, data?: DetailRoute[], error?: string}>}
     */
    async getAllDetailRoutes() {
        try {
            const results = await withConnection(async (connection) => {
                const repo = new DetailRouteDAO(connection);
                return await repo.getAllDetailRoutes();
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
     * Get bus route details for multiple busRouteIds
     * @param {number[]} busRouteIds
     * @return {Promise<{success: boolean, data?: any[], error?: string}>}
     */
    async getBusRouteDetails(busRouteIds) {
        try {
            if (!Array.isArray(busRouteIds) || busRouteIds.length === 0) {
                return { success: false, error: 'busRouteIds must be a non-empty array' };
            }
            const results = await withConnection(async (connection) => {
                const busRouteRepo = new BusRouteDAO(connection);
                const routeRepo = new RouteDAO(connection);
                const detailRouteRepo = new DetailRouteDAO(connection);

                // Get all busRoutes in bulk
                const busRoutes = await busRouteRepo.getByBusRouteIds(busRouteIds);
                const routeIds = busRoutes.map(br => br.route_id).filter(Boolean);
                // Get all routes in bulk
                const routes = await routeRepo.getByRouteIds(routeIds);
                // Map routeId to route
                const routeMap = new Map(routes.map(r => [r.route_id, r]));

                // Get all detailRoutes in bulk
                const detailRoutes = await detailRouteRepo.getByRouteIds(routeIds);
                // Map routeId to array of detailRoutes
                const detailRouteMap = {};
                for (const dr of detailRoutes) {
                    if (!detailRouteMap[dr.route_id]) detailRouteMap[dr.route_id] = [];
                    detailRouteMap[dr.route_id].push(dr);
                }

                // Gán navigation cho từng busRoute
                for (const busRoute of busRoutes) {
                    const route = routeMap.get(busRoute.route_id);
                    if (route) {
                        route.detailRoutes = detailRouteMap[route.route_id] || [];
                        busRoute.route = route;
                    }
                }
                return busRoutes;
            });
            return { success: true, data: results };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Get detail route by ID
     * @param {number} detailRouteId
     * @return {Promise<{success: boolean, data?: DetailRoute, error?: string}>}
     */
    async getByDetailRouteId(detailRouteId) {
        try {
            if (!detailRouteId || !Number.isInteger(detailRouteId)) {
                return {
                    success: false,
                    error: 'Invalid detailRouteId'
                };
            }

            const result = await withConnection(async (connection) => {
                const repo = new DetailRouteDAO(connection);
                return await repo.getByDetailRouteId(detailRouteId);
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
     * Get detail routes by route ID
     * @param {number} routeId
     * @return {Promise<{success: boolean, data?: DetailRoute[], error?: string}>}
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
                const repo = new DetailRouteDAO(connection);
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
     * Get detail routes by start point ID
     * @param {number} startPointId
     * @return {Promise<{success: boolean, data?: DetailRoute[], error?: string}>}
     */
    async getByRouteStartPointId(startPointId) {
        try {
            if (!startPointId || !Number.isInteger(startPointId)) {
                return {
                    success: false,
                    error: 'Invalid startPointId'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new DetailRouteDAO(connection);
                return await repo.getByRouteStartPointId(startPointId);
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
     * Get detail routes by end point ID
     * @param {number} endPointId
     * @return {Promise<{success: boolean, data?: DetailRoute[], error?: string}>}
     */
    async getByRouteEndPointId(endPointId) {
        try {
            if (!endPointId || !Number.isInteger(endPointId)) {
                return {
                    success: false,
                    error: 'Invalid endPointId'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new DetailRouteDAO(connection);
                return await repo.getByRouteEndPointId(endPointId);
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
     * Get detail routes by distance
     * @param {number} distance
     * @return {Promise<{success: boolean, data?: DetailRoute[], error?: string}>}
     */
    async getByDetailRouteDistance(distance) {
        try {
            if (typeof distance !== 'number') {
                return {
                    success: false,
                    error: 'Invalid distance'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new DetailRouteDAO(connection);
                return await repo.getByDetailRouteDistance(distance);
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
     * Create a new detail route
     * @param {DetailRoute} detailRoute
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async createDetailRoute(detailRoute) {
        try {
            if (!(detailRoute instanceof DetailRoute)) {
                return {
                    success: false,
                    error: 'Invalid detailRoute object'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new DetailRouteDAO(connection);
                return await repo.createDetailRoute(detailRoute);
            });
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to create detail route'
                };
            }

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
     * Create multiple detail routes
     * @param {DetailRoute[]} detailRoutes
     * @return {Promise<{success: boolean, data?: number|number[], error?: string}>}
     */
    async createDetailRoutes(detailRoutes) {
        try {
            if (!Array.isArray(detailRoutes) || detailRoutes.length === 0) {
                return {
                    success: false,
                    error: 'detailRoutes must be a non-empty array'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new DetailRouteDAO(connection);
                return await repo.createDetailRoutes(detailRoutes);
            });
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to create detail routes'
                };
            }

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
     * Update detail route distance
     * @param {number} detailId
     * @param {number} newDistance
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateDistance(detailId, newDistance) {
        try {
            if (!detailId || !Number.isInteger(detailId)) {
                return {
                    success: false,
                    error: 'Invalid detailId'
                };
            }

            if (typeof newDistance !== 'number') {
                return {
                    success: false,
                    error: 'Invalid newDistance'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new DetailRouteDAO(connection);
                return await repo.updateDistance(detailId, newDistance);
            });
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update distance'
                };
            }

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
     * Update distances of multiple detail routes
     * @param {Array<{detail_route_id: number, detail_route_distance: number}>} newDetailRoutes - Plain objects with snake_case properties
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateDistances(newDetailRoutes) {
        try {
            if (!Array.isArray(newDetailRoutes) || newDetailRoutes.length === 0) {
                return {
                    success: false,
                    error: 'newDetailRoutes must be a non-empty array'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new DetailRouteDAO(connection);
                return await repo.updateDistances(newDetailRoutes);
            });
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update distances'
                };
            }

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
     * Update detail route start point ID
     * @param {number} detailRouteId
     * @param {number} newStartPointId
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateStartPointId(detailRouteId, newStartPointId) {
        try {
            if (!detailRouteId || !Number.isInteger(detailRouteId)) {
                return {
                    success: false,
                    error: 'Invalid detailRouteId'
                };
            }

            if (!newStartPointId || !Number.isInteger(newStartPointId)) {
                return {
                    success: false,
                    error: 'Invalid newStartPointId'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new DetailRouteDAO(connection);
                return await repo.updateStartPointId(detailRouteId, newStartPointId);
            });
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update start point ID'
                };
            }

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
     * Update start point IDs of multiple detail routes
     * @param {Array<{detail_route_id: number, detail_route_start_point_id: number}>} detailRoutes - Plain objects with snake_case properties
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateStartPointIds(detailRoutes) {
        try {
            if (!Array.isArray(detailRoutes) || detailRoutes.length === 0) {
                return {
                    success: false,
                    error: 'detailRoutes must be a non-empty array'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new DetailRouteDAO(connection);
                return await repo.updateStartPointIds(detailRoutes);
            });
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update start point IDs'
                };
            }

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
     * Update detail route end point ID
     * @param {number} detailRouteId
     * @param {number} newEndPointId
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateEndPointId(detailRouteId, newEndPointId) {
        try {
            if (!detailRouteId || !Number.isInteger(detailRouteId)) {
                return {
                    success: false,
                    error: 'Invalid detailRouteId'
                };
            }

            if (!newEndPointId || !Number.isInteger(newEndPointId)) {
                return {
                    success: false,
                    error: 'Invalid newEndPointId'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new DetailRouteDAO(connection);
                return await repo.updateEndPointId(detailRouteId, newEndPointId);
            });
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update end point ID'
                };
            }

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
     * Update end point IDs of multiple detail routes
     * @param {Array<{detail_route_id: number, detail_route_end_point_id: number}>} detailRoutes - Plain objects with snake_case properties
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateEndPointIds(detailRoutes) {
        try {
            if (!Array.isArray(detailRoutes) || detailRoutes.length === 0) {
                return {
                    success: false,
                    error: 'detailRoutes must be a non-empty array'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new DetailRouteDAO(connection);
                return await repo.updateEndPointIds(detailRoutes);
            });
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update end point IDs'
                };
            }

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
     * Delete detail route by ID
     * @param {number} detailRouteId
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async deleteDetailRoute(detailRouteId) {
        try {
            if (!detailRouteId || !Number.isInteger(detailRouteId)) {
                return {
                    success: false,
                    error: 'Invalid detailRouteId'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new DetailRouteDAO(connection);
                return await repo.deleteDetailRoute(detailRouteId);
            });
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to delete detail route'
                };
            }

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
     * Delete multiple detail routes by IDs
     * @param {number[]} detailRouteIds
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async deleteDetailRoutes(detailRouteIds) {
        try {
            if (!Array.isArray(detailRouteIds) || detailRouteIds.length === 0) {
                return {
                    success: false,
                    error: 'detailRouteIds must be a non-empty array'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new DetailRouteDAO(connection);
                return await repo.deleteDetailRoutes(detailRouteIds);
            });
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to delete detail routes'
                };
            }

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

export default DetailRouteServices;

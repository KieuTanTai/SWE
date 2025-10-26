import { default as RouteDAO } from "../infrastructure/data/routeDAO.js";
import { Route } from "../index.js";
import { withConnection, withTransaction } from "../infrastructure/connection/transactionHelper.js";

/**
 * RouteServices
 * Service layer for managing routes
 * Manages its own database connections and transactions
 */
class RouteServices {
    /**
     * Get all routes
     * @return {Promise<{success: boolean, data?: Route[], error?: string}>}
     */
    async getAllRoutes() {
        try {
            const results = await withConnection(async (connection) => {
                const repo = new RouteDAO(connection);
                return await repo.getAllRoutes();
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
     * Get route by ID
     * @param {number} routeId
     * @return {Promise<{success: boolean, data?: Route, error?: string}>}
     */
    async getByRouteId(routeId) {
        try {
            if (!routeId || !Number.isInteger(routeId)) {
                return {
                    success: false,
                    error: 'Invalid routeId'
                };
            }

            const result = await withConnection(async (connection) => {
                const repo = new RouteDAO(connection);
                return await repo.getByRouteId(routeId);
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
     * Get routes by multiple IDs
     * @param {number[]} routeIds
     * @return {Promise<{success: boolean, data?: Route[], error?: string}>}
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
                const repo = new RouteDAO(connection);
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
     * Get route by name
     * @param {string} routeName
     * @return {Promise<{success: boolean, data?: Route, error?: string}>}
     */
    async getByRouteName(routeName) {
        try {
            if (!routeName || typeof routeName !== 'string') {
                return {
                    success: false,
                    error: 'Invalid routeName'
                };
            }

            const result = await withConnection(async (connection) => {
                const repo = new RouteDAO(connection);
                return await repo.getByRouteName(routeName);
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
     * Get routes with name like pattern
     * @param {string} routeNamePattern
     * @return {Promise<{success: boolean, data?: Route[], error?: string}>}
     */
    async getLikeRouteName(routeNamePattern) {
        try {
            if (!routeNamePattern || typeof routeNamePattern !== 'string') {
                return {
                    success: false,
                    error: 'Invalid routeNamePattern'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new RouteDAO(connection);
                return await repo.getLikeRouteName(routeNamePattern);
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
     * Get routes by status
     * @param {boolean} routeStatus
     * @return {Promise<{success: boolean, data?: Route[], error?: string}>}
     */
    async getByRouteStatus(routeStatus) {
        try {
            if (typeof routeStatus !== 'boolean') {
                return {
                    success: false,
                    error: 'Invalid routeStatus'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new RouteDAO(connection);
                return await repo.getByRouteStatus(routeStatus);
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
     * Create a new route
     * @param {Route} route
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async createRoute(route) {
        try {
            if (!(route instanceof Route)) {
                return {
                    success: false,
                    error: 'Invalid route object'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new RouteDAO(connection);
                return await repo.createRoute(route);
            });
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to create route'
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
     * Create multiple routes
     * @param {Route[]} routes
     * @return {Promise<{success: boolean, data?: number|number[], error?: string}>}
     */
    async createRoutes(routes) {
        try {
            if (!Array.isArray(routes) || routes.length === 0) {
                return {
                    success: false,
                    error: 'routes must be a non-empty array'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new RouteDAO(connection);
                return await repo.createRoutes(routes);
            });
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to create routes'
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
     * Update route name
     * @param {number} routeId
     * @param {string} newRouteName
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateRouteName(routeId, newRouteName) {
        try {
            if (!routeId || !Number.isInteger(routeId)) {
                return {
                    success: false,
                    error: 'Invalid routeId'
                };
            }

            if (!newRouteName || typeof newRouteName !== 'string') {
                return {
                    success: false,
                    error: 'Invalid newRouteName'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new RouteDAO(connection);
                return await repo.updateRouteName(routeId, newRouteName);
            });
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update route name'
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
     * Update route status
     * @param {number} routeId
     * @param {boolean} routeStatus
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateRouteStatus(routeId, routeStatus) {
        try {
            if (!routeId || !Number.isInteger(routeId)) {
                return {
                    success: false,
                    error: 'Invalid routeId'
                };
            }

            if (typeof routeStatus !== 'boolean') {
                return {
                    success: false,
                    error: 'Invalid routeStatus'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new RouteDAO(connection);
                return await repo.updateRouteStatus(routeId, routeStatus);
            });
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update route status'
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
     * Update route names of multiple routes
     * @param {Array<{route_id: number, route_name: string}>} routes - Plain objects with snake_case properties
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateRouteNames(routes) {
        try {
            if (!Array.isArray(routes) || routes.length === 0) {
                return {
                    success: false,
                    error: 'routes must be a non-empty array'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new RouteDAO(connection);
                return await repo.updateRouteNames(routes);
            });
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update route names'
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
     * Update route statuses of multiple routes
     * @param {Array<{route_id: number, route_status: boolean}>} routes - Plain objects with snake_case properties
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateRouteStatuses(routes) {
        try {
            if (!Array.isArray(routes) || routes.length === 0) {
                return {
                    success: false,
                    error: 'routes must be a non-empty array'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new RouteDAO(connection);
                return await repo.updateRouteStatuses(routes);
            });
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update route statuses'
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

export default RouteServices;

import { default as RouteDAO } from "../infrastructure/data/routeDAO.js";
import { Route } from "../models/index.js";

/**
 * RouteService
 * Service layer for managing routes
 */
class RouteService {
    /**
     * @param {RouteDAO} routeRepository
     */
    constructor(routeRepository) {
        this.routeRepository = routeRepository;
    }

    /**
     * Get all routes
     * @return {Promise<{success: boolean, data?: Route[], error?: string}>}
     */
    async getAllRoutes() {
        try {
            const results = await this.routeRepository.getAllRoutes();
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

            const result = await this.routeRepository.getByRouteId(routeId);
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

            const results = await this.routeRepository.getByRouteIds(routeIds);
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

            const result = await this.routeRepository.getByRouteName(routeName);
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

            const results = await this.routeRepository.getLikeRouteName(routeNamePattern);
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

            const results = await this.routeRepository.getByRouteStatus(routeStatus);
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

            const result = await this.routeRepository.createRoute(route);
            
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

            const result = await this.routeRepository.createRoutes(routes);
            
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

            const result = await this.routeRepository.updateRouteName(routeId, newRouteName);
            
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

            const result = await this.routeRepository.updateRouteStatus(routeId, routeStatus);
            
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

            const result = await this.routeRepository.updateRouteNames(routes);
            
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

            const result = await this.routeRepository.updateRouteStatuses(routes);
            
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

export default RouteService;

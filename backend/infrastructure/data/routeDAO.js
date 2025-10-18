import { Route } from "../../models";
import { default as BaseDAO } from "./baseDAO";
import dbSchema from "./dbSchema";
import mySql from "mysql2/promise"

class RouteDAO extends BaseDAO {
    
    /**
     * Creates an instance of RouteDAO.
     * @param {mySql.PoolConnection} connection
     * @memberof RouteDAO
     */
    constructor(connection) {
        super(connection, "Route", dbSchema.ROUTE_COLUMNS.ROUTE_ID);
    }

    async getAllRoutes() {
        try {
            const results = await this._protectedGetAll();
            if (!results || results.length === 0) {
                console.warn(`Warning: No routes found`);
                return [];
            }
            return results.map(row => Route.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     *
     *
     * @param {string|number} routeId
     * @return {Promise<Route|null>} 
     * @memberof RouteDAO
     */
    async getByRouteId(routeId) {
        if (routeId === "" || routeId === null || routeId === undefined || !Number.isInteger(routeId)) {
            console.warn(`Warning: routeId is invalid : ${routeId}`);
            return new Route({});
        }

        try {
            if (Number.parseInt(routeId.toString()) <= 0) {
                console.warn(`Warning: routeId must be greater than zero : ${routeId}`);
                return new Route({});
            }

            const result = await this._protectedGetById(routeId);
            if (!result) {
                console.warn(`Warning: No data found for routeId ${routeId}`);
                return new Route({});
            }
            return Route.fromDatabase(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return new Route({});
        }
    }

    /**
     *
     *
     * @param {string[]|number[]} routeIds
     * @return {Promise<Route[]>} 
     * @memberof RouteDAO
     */
    async getByRouteIds(routeIds) {
        if (!Array.isArray(routeIds) || routeIds.length === 0) {
            console.warn(`Warning: routeIds must be a non-empty array`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], routeIds,
                `WHERE ${this.primaryKeyName} IN (${routeIds.map(() => '?').join(', ')})`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No routes found for provided routeIds`);
                return [];
            }
            return results.map(row => Route.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     *
     *
     * @param {boolean} routeStatus
     * @return {Promise<Route[]>} 
     * @memberof RouteDAO
     */
    async getByRouteStatus(routeStatus) {
        if (routeStatus === null || routeStatus === undefined || typeof routeStatus !== 'boolean') {
            console.warn(`Warning: routeStatus is invalid : ${routeStatus}`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [routeStatus],
                `WHERE route_status = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No routes found for routeStatus ${routeStatus}`);
                return [];
            }
            return results.map(row => Route.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     *
     *
     * @param {Route} route
     * @return {Promise<string|number>} 
     * @memberof RouteDAO
     */
    async createRoute(route) {
        if (!(route instanceof Route)) {
            console.warn(`Warning: Invalid route object`);
            return -1;
        }

        try {
            const result = await this._protectedCreate(route);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     *
     *
     * @param {Route[]} routes
     * @return {Promise<number|number[]>} 
     * @memberof RouteDAO
     */
    async createRoutes(routes) {
        if (!Array.isArray(routes) || routes.length === 0) {
            console.warn(`Warning: routes must be a non-empty array`);
            return -1;
        }

        try {
            const insertIds = [];
            const valueInserts = routes.map(route => ({
                route_name: route.route_name,
                route_status: route.route_status
            }));
            const results = await this._protectedMultiCreate(["route_name", "route_status"], valueInserts);
            return results;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     *
     *
     * @param {Route} route
     * @return {Promise<number>} 
     * @memberof RouteDAO
     */
    async #updateRoute(route) {
        if (!route) {
            console.warn(`Warning: Invalid route: ${route}`);
            return -1;
        }
        try {
            const result = await this._protectedUpdateById(route.route_id, route);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     *
     *
     * @param {Route[]} routes
     * @return {Promise<number>} 
     * @memberof RouteDAO
     */
    async #updateRoutes(routes) {
        if (!Array.isArray(routes) || routes.length === 0) {
            console.warn(`Warning: routes must be a non-empty array`);
            return 1;
        }

        try {
            const arrayValues = routes.map(route => ({
                route_id: route.route_id,
                route_name: route.route_name,
                route_status: route.route_status
            }));
            const result = await this._protectedMultiUpdateById(arrayValues);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update the name of a specific route
     * @param {string|number} routeId
     * @param {string} newName
     * @return {Promise<number>} Number of affected rows or -1 if failed
     */
    async updateRouteName(routeId, newName) {
        if (!routeId || typeof newName !== 'string' || newName.trim() === '') {
            console.warn(`Warning: Invalid routeId or newName`);
            return -1;
        }
        try {
            const result = await this.getByRouteId(routeId);
            if (!result) {
                console.warn(`Warning: No route found for routeId ${routeId}`);
                return -1;
            }
            if (result.route_name === newName) {
                console.info(`Info: Route name is already '${newName}' for routeId ${routeId}`);
                return 0;
            }
            result.route_name = newName;
            return await this.#updateRoute(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update the status of a specific route
     * @param {number} routeId
     * @param {boolean} newStatus
     * @return {Promise<number>} Number of affected rows or -1 if failed
     */
    async updateRouteStatus(routeId, newStatus) {
        if (!routeId || typeof newStatus !== 'boolean') {
            console.warn(`Warning: Invalid routeId or newStatus`);
            return -1;
        }
        
        try {
            const result = await this.getByRouteId(routeId);
            if (!result) {
                console.warn(`Warning: No route found for routeId ${routeId}`);
                return -1;
            }

            if (result.route_status === newStatus) {
                console.info(`Info: Route status is already '${newStatus}' for routeId ${routeId}`);
                return 0;
            }
            result.route_status = newStatus;
            return await this.#updateRoute(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update the names of multiple routes
     * @param {Array<{route_id: number, route_name: string}>} routes
     * @return {Promise<number>} Number of affected rows or -1 if failed
     */
    async updateRouteNames(routes) {
        if (!Array.isArray(routes) || routes.length === 0) {
            console.warn(`Warning: routes must be a non-empty array`);
            return -1;
        }
        try {
            const formattedRoutes = routes.map(route => new Route({
                route_id: route.route_id,
                route_name: route.route_name
            }));
            return await this.#updateRoutes(formattedRoutes);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update the statuses of multiple routes
     * @param {Array<{route_id: number, route_status: boolean}>} routes
     * @return {Promise<number>} Number of affected rows or -1 if failed
     */
    async updateRouteStatuses(routes) {
        if (!Array.isArray(routes) || routes.length === 0) {
            console.warn(`Warning: routes must be a non-empty array`);
            return -1;
        }
        try {
            const formattedRoutes = routes.map(route => new Route({
                route_id: route.route_id,
                route_status: route.route_status
            }));
            return await this.#updateRoutes(formattedRoutes);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }
}
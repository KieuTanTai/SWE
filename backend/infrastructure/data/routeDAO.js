import Route from "../../models/Route.js";
import { default as BaseDAO } from "./baseDAO.js";
import dbSchema from "./dbSchema.js";
import mySql from "mysql2/promise"

export default class RouteDAO extends BaseDAO {
    
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
     * @param {number} routeId
     * @return {Promise<Route>} 
     * @memberof RouteDAO
     */
    async getByRouteId(routeId) {
        if (routeId === null || routeId === undefined || !Number.isInteger(routeId)) {
            console.warn(`Warning: routeId is invalid : ${routeId}`);
            return new Route();
        }

        try {
            if (routeId <= 0) {
                console.warn(`Warning: routeId must be greater than zero : ${routeId}`);
                return new Route();
            }

            const result = await this._protectedGetById(routeId);
            if (!result) {
                console.warn(`Warning: No data found for routeId ${routeId}`);
                return new Route();
            }
            return Route.fromDatabase(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return new Route();
        }
    }

    /**
     *
     *
     * @param {number[]} routeIds
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
     * @param {string} routeName
     * @return {Promise<Route>} 
     * @memberof RouteDAO
     */
    async getByRouteName(routeName) {
        if (!routeName || typeof routeName !== 'string' || routeName.trim() === '') {
            console.warn(`Warning: routeName is invalid : ${routeName}`);
            return new Route();
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [routeName],
                `WHERE ${dbSchema.ROUTE_COLUMNS.ROUTE_NAME} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No routes found for routeName ${routeName}`);
                return new Route();
            }
            return results.map(row => Route.fromDatabase(row))[0];
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return new Route();
        }
    }

    /**
     *
     *
     * @param {string} partialName
     * @return {Promise<Route[]>} 
     * @memberof RouteDAO
     */
    async getLikeRouteName(partialName) {
        if (!partialName || typeof partialName !== 'string' || partialName.trim() === '') {
            console.warn(`Warning: partialName is invalid : ${partialName}`);
            return [];
        }

        try {
            const likePattern = `%${partialName}%`;
            const results = await this._protectedGetBySelection(["*"], [likePattern],
                `WHERE ${dbSchema.ROUTE_COLUMNS.ROUTE_NAME} LIKE ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No routes found matching partialName ${partialName}`);
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
                `WHERE ${dbSchema.ROUTE_COLUMNS.ROUTE_STATUS} = ?`);
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
     * Get route by driver person id (from current schedule and detail schedule)
     * @param {number} driverPersonId
     * @return {Promise<Route>} 
     * @memberof RouteDAO
     */
    async getByDriverPersonId(driverPersonId) {
        if (!driverPersonId || !Number.isInteger(driverPersonId)) {
            console.warn(`Warning: driverPersonId is invalid : ${driverPersonId}`);
            return new Route();
        }

        try {
            const currentDate = new Date();
            const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
            
            // Query to get route from driver person id via schedule and detail_schedule
            const query = `
                SELECT r.*
                FROM route r
                INNER JOIN detail_schedule ds ON r.route_id = ds.detail_schedule_route_id
                INNER JOIN schedule s ON ds.detail_schedule_schedule_id = s.schedule_id
                WHERE s.schedule_driver_id = ?
                  AND s.schedule_status = 1
                  AND CURDATE() BETWEEN s.schedule_start_date AND s.schedule_end_date
                  AND ds.detail_schedule_time_role_id = ?
                LIMIT 1
            `;
            
            const [results] = await this.connection.execute(query, [driverPersonId, dayOfWeek]);
            
            if (!Array.isArray(results) || results.length === 0) {
                console.warn(`Warning: No route found for driverPersonId ${driverPersonId}`);
                return new Route();
            }
            
            return Route.fromDatabase(results[0]);
        } catch (error) {
            console.error(`Error getByDriverPersonId: ${error.message}`);
            return new Route();
        }
    }

    /**
     * Get route by current schedule (schedule that covers today)
     * @return {Promise<Route>} 
     * @memberof RouteDAO
     */
    async getByCurrentSchedule() {
        try {
            const currentDate = new Date();
            const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
            
            // Query to get route from current active schedule
            const query = `
                SELECT r.*
                FROM route r
                INNER JOIN detail_schedule ds ON r.route_id = ds.detail_schedule_route_id
                INNER JOIN schedule s ON ds.detail_schedule_schedule_id = s.schedule_id
                WHERE s.schedule_status = 1
                  AND CURDATE() BETWEEN s.schedule_start_date AND s.schedule_end_date
                  AND ds.detail_schedule_time_role_id = ?
                LIMIT 1
            `;
            
            const [results] = await this.connection.execute(query, [dayOfWeek]);
            
            if (!Array.isArray(results) || results.length === 0) {
                console.warn(`Warning: No route found for current schedule`);
                return new Route();
            }
            
            return Route.fromDatabase(results[0]);
        } catch (error) {
            console.error(`Error getByCurrentSchedule: ${error.message}`);
            return new Route();
        }
    }

    /**
     *
     *
     * @param {Route} route
     * @return {Promise<number>} 
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
            const valueInserts = routes.map(route => ({
                [dbSchema.ROUTE_COLUMNS.ROUTE_NAME]: route.route_name,
                [dbSchema.ROUTE_COLUMNS.ROUTE_STATUS]: route.route_status
            }));
            const results = await this._protectedMultiCreate([dbSchema.ROUTE_COLUMNS.ROUTE_NAME, dbSchema.ROUTE_COLUMNS.ROUTE_STATUS], valueInserts);
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
            const result = await this._protectedUpdateById(route[dbSchema.ROUTE_COLUMNS.ROUTE_ID], route);
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
            const result = await this._protectedMultiUpdateById(routes);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update the name of a specific route
     * @param {number} routeId
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
     * @param {Array<{route_id: number, route_name: string}>} routes - Plain objects with snake_case properties
     * @return {Promise<number>} Number of affected rows or -1 if failed
     */
    async updateRouteNames(routes) {
        if (!Array.isArray(routes) || routes.length === 0) {
            console.warn(`Warning: routes must be a non-empty array`);
            return -1;
        }
        try {
            const formattedRoutes = routes.map(route => new Route({
                [dbSchema.ROUTE_COLUMNS.ROUTE_ID]: route.route_id,
                [dbSchema.ROUTE_COLUMNS.ROUTE_NAME]: route.route_name
            }));
            return await this.#updateRoutes(formattedRoutes);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update the statuses of multiple routes
     * @param {Array<{route_id: number, route_status: boolean}>} routes - Plain objects with snake_case properties
     * @return {Promise<number>} Number of affected rows or -1 if failed
     */
    async updateRouteStatuses(routes) {
        if (!Array.isArray(routes) || routes.length === 0) {
            console.warn(`Warning: routes must be a non-empty array`);
            return -1;
        }
        try {
            const formattedRoutes = routes.map(route => new Route({
                [dbSchema.ROUTE_COLUMNS.ROUTE_ID]: route.route_id,
                [dbSchema.ROUTE_COLUMNS.ROUTE_STATUS]: route.route_status
            }));
            return await this.#updateRoutes(formattedRoutes);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }
}
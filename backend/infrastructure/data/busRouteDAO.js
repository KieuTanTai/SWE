import { BusRoute } from "../../index.js";
import { default as BaseDAO } from "./baseDAO.js";
import dbSchema from "./dbSchema.js";
import mysql from "mysql2/promise";

/**
 * BusRouteDAO
 * Data Access Object for BusRoute table operations
 */
export default class BusRouteDAO extends BaseDAO {
    /**
     * Create an instance of BusRouteDAO
     * @param {mysql.PoolConnection} connection
     * @memberof BusRouteDAO
     */
    constructor(connection) {
        super(connection, "BusRoute", dbSchema.BUS_ROUTE_COLUMNS.BUS_ROUTE_ID);
    }

    /**
     * Get all bus routes
     * @return {Promise<BusRoute[]>}
     * @memberof BusRouteDAO
     */
    /**
     * Get all bus routes
     * @return {Promise<BusRoute[]>}
     * @memberof BusRouteDAO
     */
    async getAllBusRoutes() {
        try {
            const results = await this._protectedGetAll();
            if (!results || results.length === 0) {
                console.warn(`Warning: No bus routes found`);
                return [];
            }
            return results.map(row => BusRoute.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get one bus route by id
     * @param {number} busRouteId
     * @return {Promise<BusRoute>}
     * @memberof BusRouteDAO
     */
    async getByBusRouteId(busRouteId) {
        if (busRouteId === null || busRouteId === undefined || !Number.isInteger(busRouteId)) {
            console.warn(`Warning: Invalid busRouteId : ${busRouteId}`);
            return new BusRoute();
        }
        
        try {
            if (busRouteId <= 0) {
                console.warn(`Warning: busRouteId must be greater than zero : ${busRouteId}`);
                return new BusRoute();
            }

            const result = await this._protectedGetById(busRouteId);
            if (!result) {
                console.warn(`Warning: No data found for busRouteId ${busRouteId}`);
                return new BusRoute();
            }
            return BusRoute.fromDatabase(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return new BusRoute();
        }
    }

    /**
     * Get multiple bus routes by ids
     * @param {number[]} busRouteIds
     * @return {Promise<BusRoute[]>}
     * @memberof BusRouteDAO
     */
    async getByBusRouteIds(busRouteIds) {
        if (!Array.isArray(busRouteIds) || busRouteIds.length === 0) {
            console.warn(`Warning: Invalid busRouteIds array`);
            return [];
        }
        
        try {
            const results = await this._protectedGetBySelection(
                ['*'],
                busRouteIds,
                `WHERE ${dbSchema.BUS_ROUTE_COLUMNS.BUS_ROUTE_ID} IN (${busRouteIds.map(() => '?').join(',')})`
            );
            if (!results || results.length === 0) {
                console.warn(`Warning: No data found for busRouteIds : ${busRouteIds}`);
                return [];
            }
            return results.map(row => BusRoute.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get bus routes by bus ID
     * @param {number} busId
     * @return {Promise<BusRoute[]>}
     * @memberof BusRouteDAO
     */
    async getByBusId(busId) {
        if (!busId || !Number.isInteger(busId) || busId <= 0) {
            console.warn(`Warning: Invalid busId : ${busId}`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(
                ['*'],
                [busId],
                `WHERE ${dbSchema.BUS_ROUTE_COLUMNS.BUS_ID} = ?`
            );

            if (!results || results.length === 0) {
                console.warn(`Warning: No data found for busId ${busId}`);
                return [];
            }
            return results.map(row => BusRoute.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get bus routes by multiple bus IDs
     * @param {number[]} busIds
     * @return {Promise<BusRoute[]>}
     * @memberof BusRouteDAO
     */
    async getByBusIds(busIds) {
        if (!busIds || !Array.isArray(busIds) || busIds.length === 0) {
            console.warn(`Warning: Invalid busIds : ${busIds}`);
            return [];
        }

        try {
            const result = await this._protectedGetBySelection(
                ['*'],
                [busIds.join(',')],
                `WHERE ${dbSchema.BUS_ROUTE_COLUMNS.BUS_ID} IN ${busIds.map(() => '?').join(',')}`
            );

            if(!result || result.length === 0) {
                console.warn(`Warning: No data found for busIds ${busIds}`);
                return [];
            }
            return result.map(item => BusRoute.fromDatabase(item));
        } catch (error) {
            console.error(`Error:${error.message}`);
            return [];
        }
    }

    async getByRouteId(routeId) {
        if(!routeId || !Number.isInteger(routeId) || routeId <= 0){
            console.warn(`Warning: Invalid routeId ${routeId}`)
            return new BusRoute();
        }

        try {
            const result = await this._protectedGetBySelection(
                ['*'],
                [routeId],
                `WHERE ${dbSchema.BUS_ROUTE_COLUMNS.ROUTE_ID} = ?`
            );

            if(!result || result.length === 0) {
                console.warn(`Warning: No data found for routeId ${routeId}`);
                return new BusRoute();
            }
            return BusRoute.fromDatabase(result);
        } catch (error) {
            console.error(`Error:${error.message}`);
            return new BusRoute();
        }
    }

    async getByRouteIds(routeIds) {
        if(!routeIds || !Array.isArray(routeIds) || routeIds.length === 0){
            console.warn(`Warning: Invalid routeIds ${routeIds}`)
            return [];
        }

        try {
            const result = await this._protectedGetBySelection(
                ['*'],
                [routeIds.join(',')],
                `WHERE ${dbSchema.BUS_ROUTE_COLUMNS.ROUTE_ID} IN ${routeIds.map(() => '?').join(',')}`
            );

            if(!result || result.length === 0) {
                console.warn(`Warning: No data found for busIds ${routeIds}`);
                return [];
            }
            return result.map(item => BusRoute.fromDatabase(item));
        } catch (error) {
            console.error(`Error:${error.message}`);
            return [];
        }
    }

    /**
     * Get bus routes by status
     * @param {Boolean} busRouteStatus 
     * @returns {Promise<BusRoute[]>}
     * @memberof BusRouteDAO
     */
    async getByBusRouteStatus(busRouteStatus) {
        if (busRouteStatus === null || busRouteStatus === undefined || typeof busRouteStatus !== 'boolean') {
            console.warn(`Warning: Invalid busRouteStatus: ${busRouteStatus}`);
            return [];
        }

        try {
            const result = await this._protectedGetBySelection(
                ["*"], [busRouteStatus],
                `WHERE ${dbSchema.BUS_ROUTE_COLUMNS.BUS_ROUTE_STATUS} = ?`
            );

            if (!result || result.length === 0) {
                console.warn(`Warning: No bus routes found by busRouteStatus ${busRouteStatus}`);
                return [];
            }
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * create a new bus route
     * @param {BusRoute} busRoute
     * @memberof BusRouteDAO
     */
    async createBusRoute(busRoute) {
        if (!(busRoute instanceof BusRoute)) {
            console.warn(`Warning: Invalid busRoute`);
            return -1;
        }

        try {
            const result = await this._protectedCreate(busRoute);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update a bus route information
     * @param {BusRoute} busRoute 
     * @returns {Promise<Number>}
     * @memberof BusRouteDAO
     */
    async #updateBusRoute(busRoute) {
        if (!busRoute || !(busRoute instanceof BusRoute)) {
            console.warn(`Warning: Invalid busRoute ${busRoute}`);
            return -1;
        }

        try {
            const result = await this._protectedUpdateById(busRoute.bus_route_id, busRoute);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update multiple buses routes information
     * @param {BusRoute[]} busesRoutes 
     * @returns {Promise<Number>}
     * @memberof BusRouteDAO
     */
    async #updateBusesRoutes(busesRoutes) {
        if (!busesRoutes || !Array.isArray(busesRoutes) || busesRoutes.length === 0) {
            console.warn(`Warning: Invalid busesRoutes ${busesRoutes}`);
            return -1;
        }

        try {
            const result = await this._protectedMultiUpdateById(busesRoutes);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update multiple buses routes information
     * @param {number} busRouteId 
     * @param {boolean} status
     * @returns {Promise<Number>}
     * @memberof BusRouteDAO
     */
    async updateBusRouteStatus(busRouteId, status) {
        if (!busRouteId || !Number.isInteger(busRouteId)) {
            console.warn(`Warning: Invalid busRouteId: ${busRouteId}`);
            return -1;
        }

        if (status === null || status === undefined || typeof status !== 'boolean') {
            console.warn(`Warning: Invalid status: ${status}`);
            return -1;
        }

        try {
            const result = await this._protectedUpdateById(
                busRouteId,
                { [dbSchema.BUS_ROUTE_COLUMNS.BUS_ROUTE_STATUS]: status }
            );
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update multiple buses routes information
     * @param {BusRoute[]} busRoutes} 
     * @returns {Promise<Number>}
     * @memberof BusRouteDAO
     */
    async updateBusRoutesStatus(busRoutes) {
        if (!busRoutes || !Array.isArray(busRoutes) || busRoutes.length === 0) {
            console.warn(`Warning: Invalid busRoutes: ${busRoutes}`);
            return -1;
        }

        try {
            const updateData = busRoutes.map(busRoute => ({
                [dbSchema.BUS_ROUTE_COLUMNS.BUS_ROUTE_ID]: busRoute.bus_route_id,
                [dbSchema.BUS_ROUTE_COLUMNS.BUS_ROUTE_STATUS]: busRoute.bus_route_status
            }));
            const result = await this._protectedMultiUpdateById(updateData);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }
    
    /**
     * delete a bus route
     * @param {number} busRouteId 
     * @returns {Promise<number>}
     */
    async deleteBusRoute(busRouteId) {
        if (!busRouteId || !Number.isInteger(busRouteId)) {
            console.warn(`Warning: Invalid busRouteId: ${busRouteId}`);
            return -1;
        }

        try {
            const result = await this._protectedDeleteById(busRouteId);
            return result;
        } catch (error) {
            console.warn(`Error: ${error.message}`);
            return -1;
        }
    }
}
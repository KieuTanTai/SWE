import BusRoute from "../../models/BusRoute.js";
import BaseDAO from "./baseDAO";
import dbSchema from "./dbSchema";
import mysql from "mysql2/promise";

class BusRouteDAO extends BaseDAO {
    /**
     * Create an instance of BusRouteDAO
     * @param {Connection} connection
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
    async getAllBusRoutes() {
        try {
            const result = await this._protectedGetAll();
            if (!result || result.length === 0) {
                console.warn(`Warning: No bus routes found`);
                return [];
            }
            return result.map(item => BusRoute.fromDatabase(item));
        } catch (error) {
            console.error(`Error: ${error.message}`)
            return [];
        }
    }

    /**
     * get one bus route by id
     * @param {Number} busRouteId
     * @return {Promise<BusRoute>}
     */
    async getByBusRouteId(busRouteId) {
        if (busRouteId === null || busRouteId === undefined || !Number.isInteger(busRouteId)) {
            console.warn(`Warning: Invalid busRouteId`);
            return -1;
        }
        try {
            if (Number.parseInt(busRouteId.toString()) <= 0) {
                console.warn(`Warning: busRouteId must be greater than zero: ${busRouteId}`);
                return -1;
            }

            const result = await this._protectedGetById(busRouteId);
            if (!result) {
                console.warn(`Warning: No data found for busRouteId:${busRouteId}`);
                return -1;
            }
            return BusRoute.fromDatabase(result);
        } catch (error) {
            console.error(`Error:${error.message}`);
            return -1;
        }
    }

    /**
     * get multiple buses routes by ids
     * @param {Number} busRouteIds
     * @return {Promise<BusRoute[]>}
     */
    async getByBusRouteIds(busRouteIds) {
        if (busRouteIds === null || busRouteIds === undefined || !Number.isInteger(busRoubusRouteIdsteId)) {
            console.warn(`Warning: Invalid busRouteIds`);
            return [];
        }
        try {
            if (Number.parseInt(busRouteIds.toString()) <= 0) {
                console.warn(`Warning: busRouteIds must be greater than zero: ${busRouteIds}`);
                return [];
            }

            const result = await this._protectedGetBySelection(
                ['*'],
                [busRouteIds.join(',')],
                `WHERE ${dbSchema.BUS_ROUTE_COLUMNS.BUS_ROUTE_ID} IN ${busRouteIds.map(() => '?').join(',')}`
            );;
            if (!result) {
                console.warn(`Warning: No data found for busRouteId:${busRouteIds}`);
                return [];
            }
            return result.map(item => BusRoute.fromDatabase(item));
        } catch (error) {
            console.error(`Error:${error.message}`);
            return [];
        }
    }

    async getByBusId(busId) {
        if(!busId || !Number.isInteger(busId) || busId <= 0){
            console.warn(`Warning: Invalid busID ${busId}`)
            return new BusRoute();
        }

        try {
            const result = await this._protectedGetBySelection(
                ['*'],
                [busId],
                `WHERE ${dbSchema.BUS_ROUTE_COLUMNS.BUS_ID} = ?`
            );

            if(!result || result.length === 0) {
                console.warn(`Warning: No data found for busId ${busId}`);
                return new BusRoute();
            }
            return BusRoute.fromDatabase(result);
        } catch (error) {
            console.error(`Error:${error.message}`);
            return new BusRoute();
        }
    }

    async getByBusIds(busIds) {
        if(!busIds || !Array.isArray(busIds) || busIds.length === 0){
            console.warn(`Warning: Invalid busIds ${busIds}`)
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
     * @returns {Promise<Bus[]>}
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
     * @param {BusRoute} busesRoutes 
     * @returns {Promise<Number>}
     * @memberof BusRouteDAO
     */
    async #updateBusesRoutes(busesRoutes) {
        if (!busesRoutes || !(busesRoutes instanceof BusRoute)) {
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
      * Update bus for one bus route 
      * @param {number | string} busRouteId
      * @param {number | string} busId
      * @return {Promise<number>}
      * @memberof BusRouteDAO
      */
    async updateBus(busRouteId, busId) {
        if(!busId || !Number.isInteger(busId) || busId <= 0) {
            console.warn(`Warning: Invalid busId ${busId}`);
            return -1;
        }
        if(!busRouteId || !Number.isInteger(busRouteId) || busRouteId <= 0) {
            console.warn(`Warning: Invalid busRouteId ${busRouteId}`);
            return -1;
        }

        try {
            const result = await this.getByBusRouteId(busRouteId);
            if(!result || result.bus_route_id === 0){
                return -1;
            }
            result.bus_id = busId;
            return await this.#updateBusRoute(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
      * Update route for one bus route 
      * @param {number | string} busRouteId
      * @param {number | string} routeId
      * @return {Promise<number>}
      * @memberof BusRouteDAO
      */
    async updateRoute(busRouteId, routeId) {
        if(!routeId || !Number.isInteger(routeId)|| routeId <= 0) {
            console.warn(`Warning: Invalid routeId ${routeId}`);
            return -1;
        }
        if(!busRouteId || !Number.isInteger(busRouteId) || busRouteId <= 0) {
            console.warn(`Warning: Invalid busRouteId ${busRouteId}`);
            return -1;
        }

        try {
            const result = await this.getByBusRouteId(busRouteId);
            if(!result || result.bus_route_id === 0){
                return -1;
            }
            result.route_id = routeId;
            return await this.#updateBusRoute(result);
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

export default BusRouteDAO;
import DetailRoute from "../../models/DetailRoute.js";
import { default as BaseDAO } from "./baseDAO.js";
import { default as dbSchema } from "./dbSchema.js";
import mySql from "mysql2/promise"
export default class DetailRouteDAO extends BaseDAO {
    /**
     * @param {mySql.PoolConnection} connection
     */
    constructor(connection) {
        super(connection, "DetailRoute", dbSchema.DETAIL_ROUTE_COLUMNS.DETAIL_ROUTE_ID);
    }

    /**
     *
     *
     * @param {number} detailRouteId
     * @return {Promise<DetailRoute>}
     * @memberof DetailRouteDAO
     */
    async getByDetailRouteId(detailRouteId) {
        if (Number.isNaN(detailRouteId) || detailRouteId <= 0) {
            console.warn(`Warning: detailRouteId is invalid : ${detailRouteId}`);
            return new DetailRoute({});
        }

        try {
            const result = await this._protectedGetById(detailRouteId);
            if (!result) {
                console.warn(`Warning: No data found for detailRouteId ${detailRouteId}`);
                return new DetailRoute({});
            }
            return DetailRoute.fromDatabase(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return new DetailRoute({});
        }
    }

    async getAllDetailRoutes() {
        try {
            const results = await this._protectedGetAll();
            if (!results || results.length === 0) {
                console.warn(`Warning: No detail routes found`);
                return [];
            }
            return results.map(row => DetailRoute.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     *
     *
     * @param {number} routeId
     * @return {Promise<Array<DetailRoute>>} 
     * @memberof DetailRouteDAO
     */
    async getByRouteId(routeId) {
        if (Number.isNaN(routeId) || routeId <= 0) {
            console.warn(`Warning: routeId is invalid : ${routeId}`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [routeId],
                `WHERE ${dbSchema.DETAIL_ROUTE_COLUMNS.ROUTE_ID} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No detail routes found for routeId ${routeId}`);
                return [];
            }
            return results.map(row => DetailRoute.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     *
     *
     * @param {number} startPointId
     * @return {Promise<Array<DetailRoute>>}
     * @memberof DetailRouteDAO
     */
    async getByRouteStartPointId(startPointId) {
        if (Number.isNaN(startPointId) || startPointId <= 0) {
            console.warn(`Warning: startPointId is invalid : ${startPointId}`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [startPointId],
                `WHERE ${dbSchema.DETAIL_ROUTE_COLUMNS.ROUTE_START_POINT_ID} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No detail routes found for startPointId ${startPointId}`);
                return [];
            }
            return results.map(row => DetailRoute.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     *
     *
     * @param {number} endPointId
     * @return {Promise<Array<DetailRoute>>}
     * @memberof DetailRouteDAO
     */
    async getByRouteEndPointId(endPointId) {
        if (Number.isNaN(endPointId) || endPointId <= 0) {
            console.warn(`Warning: endPointId is invalid : ${endPointId}`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [endPointId],
                `WHERE ${dbSchema.DETAIL_ROUTE_COLUMNS.ROUTE_END_POINT_ID} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No detail routes found for endPointId ${endPointId}`);
                return [];
            }
            return results.map(row => DetailRoute.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     *
     *
     * @param {number} distance
     * @return {Promise<Array<DetailRoute>>}
     * @memberof DetailRouteDAO
     */
    async getByDetailRouteDistance(distance) {
        if (Number.isNaN(distance) || distance <= 0) {
            console.warn(`Warning: distance is invalid : ${distance}`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [distance],
                `WHERE ${dbSchema.DETAIL_ROUTE_COLUMNS.ROUTE_DISTANCE} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No detail routes found for distance ${distance}`);
                return [];
            }
            return results.map(row => DetailRoute.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     *
     *
     * @param {DetailRoute} detailRoute
     * @return {Promise<number>} 
     * @memberof DetailRouteDAO
     */
    async createDetailRoute(detailRoute) {
        if (!(detailRoute instanceof DetailRoute)) {
            console.warn(`Warning: Invalid detailRoute object`);
            return -1;
        }

        try {
            const result = await this._protectedCreate(detailRoute);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     *
     *
     * @param {Array<DetailRoute>} detailRoutes
     * @return {Promise<number | number[]>}
     * @memberof DetailRouteDAO
     */
    async createDetailRoutes(detailRoutes) {
        if (!Array.isArray(detailRoutes) || detailRoutes.length === 0) {
            console.warn(`Warning: detailRoutes must be a non-empty array`);
            return -1;
        }

        try {
            const insertIds = [];
            const values = detailRoutes.map(detail => ({
                [dbSchema.DETAIL_ROUTE_COLUMNS.ROUTE_ID]: detail.route_id,
                [dbSchema.DETAIL_ROUTE_COLUMNS.DETAIL_ROUTE_START_POINT_ID]: detail.detail_route_start_point_id,
                [dbSchema.DETAIL_ROUTE_COLUMNS.DETAIL_ROUTE_END_POINT_ID]: detail.detail_route_end_point_id,
                [dbSchema.DETAIL_ROUTE_COLUMNS.DETAIL_ROUTE_DISTANCE]: detail.detail_route_distance
            }));
            
            const columns = [dbSchema.DETAIL_ROUTE_COLUMNS.ROUTE_ID,
                dbSchema.DETAIL_ROUTE_COLUMNS.DETAIL_ROUTE_START_POINT_ID,
                dbSchema.DETAIL_ROUTE_COLUMNS.DETAIL_ROUTE_END_POINT_ID,
                dbSchema.DETAIL_ROUTE_COLUMNS.DETAIL_ROUTE_DISTANCE];
            
            const results = await this._protectedMultiCreate(columns, values);
            return results;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     *
     *
     * @param {number} detailRouteId
     * @return {Promise<number>} 
     * @memberof DetailRouteDAO
     */
    async deleteDetailRoute(detailRouteId) {
        if (Number.isNaN(detailRouteId) || detailRouteId <= 0) {
            console.warn(`Warning: detailRouteId is invalid : ${detailRouteId}`);
            return -1;
        }

        try {
            const result = await this._protectedDeleteById(detailRouteId);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     *
     *
     * @param {number[]} detailRouteIds
     * @return {Promise<number>}
     * @memberof DetailRouteDAO
     */
    async deleteDetailRoutes(detailRouteIds) {
        if (!Array.isArray(detailRouteIds) || detailRouteIds.length === 0) {
            console.warn(`Warning: detailRouteIds must be a non-empty array`);
            return -1;
        }

        try {
            const results = await this._protectedDeleteByIds(detailRouteIds);
            return results;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     *
     *
     * @param {DetailRoute} detailRoute
     * @return {Promise<number>} 
     * @memberof DetailRouteDAO
     */
    async #updateDetailRoute(detailRoute) {
        if (!detailRoute) {
            console.warn(`Warning: Invalid detail route: ${detailRoute}`);
            return -1;
        }
        try {
            const result = await this._protectedUpdateById(detailRoute.detail_route_id, detailRoute);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }
    
    /**
     *
     *
     * @param {DetailRoute[]} detailRoutes
     * @return {Promise<number>} 
     * @memberof DetailRouteDAO
     */
    async #updateDetailRoutes(detailRoutes) {
        if (!Array.isArray(detailRoutes) || detailRoutes.length === 0) {
            console.warn(`Warning: detail routes must be a non-empty array`);
            return 1;
        }

        try {
            const results = await this._protectedMultiUpdateById(detailRoutes);
            return results;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     *
     *
     * @param {number} detailId
     * @param {number} newDistance
     * @memberof DetailRouteDAO
     */
    async updateDistance(detailId, newDistance) {
        if (Number.isNaN(detailId) || detailId <= 0) {
            console.warn(`Warning: detailId is invalid : ${detailId}`);
            return -1;
        }

        if (newDistance <= 0 || !Number.isInteger(newDistance)) {
            console.warn(`Warning: newDistance is invalid : ${newDistance}`);
            return -1;
        }

        try {
            const detail = await this.getByDetailRouteId(detailId);
            if (!detail || detail.detail_route_id <= 0) {
                console.warn(`Warning: No detail route found for detailId ${detailId}`);
                return -1;
            }

            if (detail.detail_route_distance === newDistance) {
                console.info(`Info: Detail route distance is already ${newDistance} for detailId ${detailId}`);
                return 0;
            }
            detail.detail_route_distance = newDistance;
            const result = await this.#updateDetailRoute(detail);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update distances cho nhiều detail routes
     * @param {Array<{detail_route_id: number, detail_route_distance: number}>} newDetailRoutes - Plain objects with snake_case properties
     * @return {Promise<number>} 
     * @memberof DetailRouteDAO
     */
    async updateDistances(newDetailRoutes) {
        if (!Array.isArray(newDetailRoutes) || newDetailRoutes.length === 0) {
            console.warn(`Warning: newDetailRoutes must be a non-empty array`);
            return -1;
        }

        try {
            const formattedRoutes = newDetailRoutes.map(detail => new DetailRoute({
                [dbSchema.DETAIL_ROUTE_COLUMNS.DETAIL_ROUTE_ID]: detail.detail_route_id,
                [dbSchema.DETAIL_ROUTE_COLUMNS.DETAIL_ROUTE_DISTANCE]: detail.detail_route_distance
            }));
            return await this.#updateDetailRoutes(formattedRoutes);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * 
     * @param {number} detailRouteId
     * @param {number} newStartPointId
     * @return {Promise<number>} 
     */
    async updateStartPointId(detailRouteId, newStartPointId) {

        try {
            const detail = await this.getByDetailRouteId(detailRouteId);
            if (!detail || detail.detail_route_id <= 0) {
                console.warn(`Warning: No detail route found for detailRouteId ${detailRouteId}`);
                return -1;
            }
            if (detail.detail_route_start_point_id === newStartPointId) {
                console.info(`Info: Start point id is already ${newStartPointId} for detailRouteId ${detailRouteId}`);
                return 0;
            }
            detail.detail_route_start_point_id = newStartPointId;
            return await this.#updateDetailRoute(detail);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update start point ids cho nhiều detail routes
     * @param {Array<{detail_route_id: number, detail_route_start_point_id: number}>} detailRoutes - Plain objects with snake_case properties
     * @return {Promise<number>} 
     */
    async updateStartPointIds(detailRoutes) {
        if (!Array.isArray(detailRoutes) || detailRoutes.length === 0) {
            console.warn(`Warning: detailRoutes must be a non-empty array`);
            return -1;
        }
        try {
            const formattedRoutes = detailRoutes.map(detail => new DetailRoute({
                [dbSchema.DETAIL_ROUTE_COLUMNS.DETAIL_ROUTE_ID]: detail.detail_route_id,
                [dbSchema.DETAIL_ROUTE_COLUMNS.DETAIL_ROUTE_START_POINT_ID]: detail.detail_route_start_point_id
            }));
            return await this.#updateDetailRoutes(formattedRoutes);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update end point id cho một detail route
     * @param {number} detailRouteId
     * @param {number} newEndPointId
     * @return {Promise<number>} 
     */
    async updateEndPointId(detailRouteId, newEndPointId) {
        if (!Number.isInteger(detailRouteId) || !Number.isInteger(newEndPointId)) {
            console.warn(`Warning: Invalid detailRouteId or newEndPointId`);
            return -1;
        }
        
        try {
            const detail = await this.getByDetailRouteId(detailRouteId);
            if (!detail || detail.detail_route_id <= 0) {
                console.warn(`Warning: No detail route found for detailRouteId ${detailRouteId}`);
                return -1;
            }
            if (detail.detail_route_end_point_id === newEndPointId) {
                console.info(`Info: End point id is already ${newEndPointId} for detailRouteId ${detailRouteId}`);
                return 0;
            }
            detail.detail_route_end_point_id = newEndPointId;
            return await this.#updateDetailRoute(detail);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update end point ids cho nhiều detail routes
     * @param {Array<{detail_route_id: number, detail_route_end_point_id: number}>} detailRoutes - Plain objects with snake_case properties
     * @return {Promise<number>} 
     */
    async updateEndPointIds(detailRoutes) {
        if (!Array.isArray(detailRoutes) || detailRoutes.length === 0) {
            console.warn(`Warning: detailRoutes must be a non-empty array`);
            return -1;
        }
        try {
            const formattedRoutes = detailRoutes.map(detail => new DetailRoute({
                [dbSchema.DETAIL_ROUTE_COLUMNS.DETAIL_ROUTE_ID]: detail.detail_route_id,
                [dbSchema.DETAIL_ROUTE_COLUMNS.DETAIL_ROUTE_END_POINT_ID]: detail.detail_route_end_point_id
            }));
            return await this.#updateDetailRoutes(formattedRoutes);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }
}
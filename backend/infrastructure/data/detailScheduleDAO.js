import DetailSchedule from "../../models/DetailSchedule.js";
import { default as BaseDAO } from "./baseDAO.js";
import dbSchema from "./dbSchema.js";
import mySql from "mysql2/promise"

export default class DetailScheduleDAO extends BaseDAO {
    
    /**
     * Creates an instance of DetailScheduleDAO.
     * @param {mySql.PoolConnection} connection
     * @memberof DetailScheduleDAO
     */
    constructor(connection) {
        super(connection, "Detail_Schedule", dbSchema.DETAIL_SCHEDULE_COLUMNS.DETAIL_SCHEDULE_ID);
    }

    /**
     * Get all detail schedules
     * @return {Promise<DetailSchedule[]>} 
     * @memberof DetailScheduleDAO
     */
    async getAllDetailSchedules() {
        try {
            const results = await this._protectedGetAll();
            if (!results || results.length === 0) {
                console.warn(`Warning: No detail schedules found`);
                return [];
            }
            return results.map(row => DetailSchedule.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get detail schedule by ID
     * @param {number} detailScheduleId
     * @return {Promise<DetailSchedule>} 
     * @memberof DetailScheduleDAO
     */
    async getByDetailScheduleId(detailScheduleId) {
        if (detailScheduleId === null || detailScheduleId === undefined || !Number.isInteger(detailScheduleId)) {
            console.warn(`Warning: detailScheduleId is invalid : ${detailScheduleId}`);
            return new DetailSchedule();
        }

        try {
            if (detailScheduleId <= 0) {
                console.warn(`Warning: detailScheduleId must be greater than zero : ${detailScheduleId}`);
                return new DetailSchedule();
            }

            const result = await this._protectedGetById(detailScheduleId);
            if (!result) {
                console.warn(`Warning: No data found for detailScheduleId ${detailScheduleId}`);
                return new DetailSchedule();
            }
            return DetailSchedule.fromDatabase(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return new DetailSchedule();
        }
    }

    /**
     * Get detail schedules by multiple IDs
     * @param {number[]} detailScheduleIds
     * @return {Promise<DetailSchedule[]>} 
     * @memberof DetailScheduleDAO
     */
    async getByDetailScheduleIds(detailScheduleIds) {
        if (!Array.isArray(detailScheduleIds) || detailScheduleIds.length === 0) {
            console.warn(`Warning: detailScheduleIds must be a non-empty array`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], detailScheduleIds,
                `WHERE ${this.primaryKeyName} IN (${detailScheduleIds.map(() => '?').join(', ')})`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No detail schedules found for provided detailScheduleIds`);
                return [];
            }
            return results.map(row => DetailSchedule.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get detail schedules by schedule ID
     * @param {number} scheduleId
     * @return {Promise<DetailSchedule[]>} 
     * @memberof DetailScheduleDAO
     */
    async getByScheduleId(scheduleId) {
        if (scheduleId === null || scheduleId === undefined || !Number.isInteger(scheduleId)) {
            console.warn(`Warning: scheduleId is invalid : ${scheduleId}`);
            return [];
        }

        try {
            if (scheduleId <= 0) {
                console.warn(`Warning: scheduleId must be greater than zero : ${scheduleId}`);
                return [];
            }

            const results = await this._protectedGetBySelection(["*"], [scheduleId],
                `WHERE ${dbSchema.DETAIL_SCHEDULE_COLUMNS.SCHEDULE_ID} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No detail schedules found for scheduleId ${scheduleId}`);
                return [];
            }
            return results.map(row => DetailSchedule.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get detail schedules by bus route ID
     * @param {number} busRouteId
     * @return {Promise<DetailSchedule[]>} 
     * @memberof DetailScheduleDAO
     */
    async getByBusRouteId(busRouteId) {
        if (busRouteId === null || busRouteId === undefined || !Number.isInteger(busRouteId)) {
            console.warn(`Warning: busRouteId is invalid : ${busRouteId}`);
            return [];
        }

        try {
            if (busRouteId <= 0) {
                console.warn(`Warning: busRouteId must be greater than zero : ${busRouteId}`);
                return [];
            }

            const results = await this._protectedGetBySelection(["*"], [busRouteId],
                `WHERE ${dbSchema.DETAIL_SCHEDULE_COLUMNS.DETAIL_SCHEDULE_BUS_ROUTE_ID} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No detail schedules found for busRouteId ${busRouteId}`);
                return [];
            }
            return results.map(row => DetailSchedule.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get detail schedules by time role ID
     * @param {number} timeRoleId
     * @return {Promise<DetailSchedule[]>} 
     * @memberof DetailScheduleDAO
     */
    async getByTimeRoleId(timeRoleId) {
        if (timeRoleId === null || timeRoleId === undefined || !Number.isInteger(timeRoleId)) {
            console.warn(`Warning: timeRoleId is invalid : ${timeRoleId}`);
            return [];
        }

        try {
            if (timeRoleId <= 0) {
                console.warn(`Warning: timeRoleId must be greater than zero : ${timeRoleId}`);
                return [];
            }

            const results = await this._protectedGetBySelection(["*"], [timeRoleId],
                `WHERE ${dbSchema.DETAIL_SCHEDULE_COLUMNS.DETAIL_SCHEDULE_TIME_ROLE_ID} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No detail schedules found for timeRoleId ${timeRoleId}`);
                return [];
            }
            return results.map(row => DetailSchedule.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Create new detail schedule
     * @param {DetailSchedule} detailSchedule
     * @return {Promise<number>} insertId or -1 if failed
     * @memberof DetailScheduleDAO
     */
    async createDetailSchedule(detailSchedule) {
        if (!(detailSchedule instanceof DetailSchedule)) {
            console.error('Error: detailSchedule must be an instance of DetailSchedule');
            return -1;
        }

        try {
            const data = {
                [dbSchema.DETAIL_SCHEDULE_COLUMNS.SCHEDULE_ID]: detailSchedule.schedule_id,
                [dbSchema.DETAIL_SCHEDULE_COLUMNS.DETAIL_SCHEDULE_BUS_ROUTE_ID]: detailSchedule.detail_schedule_bus_route_id,
                [dbSchema.DETAIL_SCHEDULE_COLUMNS.DETAIL_SCHEDULE_TIME_ROLE_ID]: detailSchedule.detail_schedule_time_role_id
            };

            const insertId = await this._protectedCreate(data);
            if (insertId <= 0) {
                console.error('Error: Failed to create detail schedule');
                return -1;
            }
            return insertId;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update detail schedule
     * @param {number} detailScheduleId
     * @param {DetailSchedule} detailSchedule
     * @return {Promise<number>} affected rows or -1 if failed
     * @memberof DetailScheduleDAO
     */
    async updateDetailSchedule(detailScheduleId, detailSchedule) {
        if (detailScheduleId === null || detailScheduleId === undefined || !Number.isInteger(detailScheduleId)) {
            console.error('Error: detailScheduleId is invalid');
            return -1;
        }

        if (detailScheduleId <= 0) {
            console.error('Error: detailScheduleId must be greater than zero');
            return -1;
        }

        if (!(detailSchedule instanceof DetailSchedule)) {
            console.error('Error: detailSchedule must be an instance of DetailSchedule');
            return -1;
        }

        try {
            const data = {
                [dbSchema.DETAIL_SCHEDULE_COLUMNS.SCHEDULE_ID]: detailSchedule.schedule_id,
                [dbSchema.DETAIL_SCHEDULE_COLUMNS.DETAIL_SCHEDULE_BUS_ROUTE_ID]: detailSchedule.detail_schedule_bus_route_id,
                [dbSchema.DETAIL_SCHEDULE_COLUMNS.DETAIL_SCHEDULE_TIME_ROLE_ID]: detailSchedule.detail_schedule_time_role_id
            };

            const affectedRows = await this._protectedUpdateById(detailScheduleId, data);
            if (affectedRows <= 0) {
                console.warn(`Warning: No detail schedule updated for detailScheduleId ${detailScheduleId}`);
                return -1;
            }
            return affectedRows;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Delete detail schedule
     * @param {number} detailScheduleId
     * @return {Promise<number>} affected rows or -1 if failed
     * @memberof DetailScheduleDAO
     */
    async deleteDetailSchedule(detailScheduleId) {
        if (detailScheduleId === null || detailScheduleId === undefined || !Number.isInteger(detailScheduleId)) {
            console.error('Error: detailScheduleId is invalid');
            return -1;
        }

        if (detailScheduleId <= 0) {
            console.error('Error: detailScheduleId must be greater than zero');
            return -1;
        }

        try {
            const affectedRows = await this._protectedDeleteById(detailScheduleId);
            if (affectedRows <= 0) {
                console.warn(`Warning: No detail schedule deleted for detailScheduleId ${detailScheduleId}`);
                return -1;
            }
            return affectedRows;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }
}

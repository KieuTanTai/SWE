import TimeRole from "../../models/TimeRole.js";
import { default as BaseDAO } from "./baseDAO.js";
import dbSchema from "./dbSchema.js";
import mySql from "mysql2/promise"

export default class TimeRoleDAO extends BaseDAO {
    
    /**
     * Creates an instance of TimeRoleDAO.
     * @param {mySql.PoolConnection} connection
     * @memberof TimeRoleDAO
     */
    constructor(connection) {
        super(connection, "Time_Role", dbSchema.TIME_ROLE_COLUMNS.TIME_ROLE_ID);
    }

    /**
     * Get all time roles
     * @return {Promise<TimeRole[]>} 
     * @memberof TimeRoleDAO
     */
    async getAllTimeRoles() {
        try {
            const results = await this._protectedGetAll();
            if (!results || results.length === 0) {
                console.warn(`Warning: No time roles found`);
                return [];
            }
            return results.map(row => TimeRole.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get time role by ID
     * @param {number} timeRoleId
     * @return {Promise<TimeRole>} 
     * @memberof TimeRoleDAO
     */
    async getByTimeRoleId(timeRoleId) {
        if (timeRoleId === null || timeRoleId === undefined || !Number.isInteger(timeRoleId)) {
            console.warn(`Warning: timeRoleId is invalid : ${timeRoleId}`);
            return new TimeRole();
        }

        try {
            if (timeRoleId <= 0) {
                console.warn(`Warning: timeRoleId must be greater than zero : ${timeRoleId}`);
                return new TimeRole();
            }

            const result = await this._protectedGetById(timeRoleId);
            if (!result) {
                console.warn(`Warning: No data found for timeRoleId ${timeRoleId}`);
                return new TimeRole();
            }
            return TimeRole.fromDatabase(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return new TimeRole();
        }
    }

    /**
     * Get time roles by multiple IDs
     * @param {number[]} timeRoleIds
     * @return {Promise<TimeRole[]>} 
     * @memberof TimeRoleDAO
     */
    async getByTimeRoleIds(timeRoleIds) {
        if (!Array.isArray(timeRoleIds) || timeRoleIds.length === 0) {
            console.warn(`Warning: timeRoleIds must be a non-empty array`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], timeRoleIds,
                `WHERE ${this.primaryKeyName} IN (${timeRoleIds.map(() => '?').join(', ')})`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No time roles found for provided timeRoleIds`);
                return [];
            }
            return results.map(row => TimeRole.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get time roles by status
     * @param {boolean} status
     * @return {Promise<TimeRole[]>} 
     * @memberof TimeRoleDAO
     */
    async getByStatus(status) {
        if (typeof status !== 'boolean') {
            console.warn(`Warning: status must be boolean`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [status],
                `WHERE ${dbSchema.TIME_ROLE_COLUMNS.TIME_ROLE_STATUS} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No time roles found for status ${status}`);
                return [];
            }
            return results.map(row => TimeRole.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Create new time role
     * @param {TimeRole} timeRole
     * @return {Promise<number>} insertId or -1 if failed
     * @memberof TimeRoleDAO
     */
    async createTimeRole(timeRole) {
        if (!(timeRole instanceof TimeRole)) {
            console.error('Error: timeRole must be an instance of TimeRole');
            return -1;
        }

        try {
            const data = {
                [dbSchema.TIME_ROLE_COLUMNS.TIME_ROLE_START_PICKUP_TIME]: timeRole.time_role_start_pickup_time,
                [dbSchema.TIME_ROLE_COLUMNS.TIME_ROLE_START_DROP_OFF_TIME]: timeRole.time_role_start_drop_off_time,
                [dbSchema.TIME_ROLE_COLUMNS.TIME_ROLE_STATUS]: timeRole.time_role_status
            };

            const insertId = await this._protectedCreate(data);
            if (insertId <= 0) {
                console.error('Error: Failed to create time role');
                return -1;
            }
            return insertId;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update time role
     * @param {number} timeRoleId
     * @param {TimeRole} timeRole
     * @return {Promise<number>} affected rows or -1 if failed
     * @memberof TimeRoleDAO
     */
    async updateTimeRole(timeRoleId, timeRole) {
        if (timeRoleId === null || timeRoleId === undefined || !Number.isInteger(timeRoleId)) {
            console.error('Error: timeRoleId is invalid');
            return -1;
        }

        if (timeRoleId <= 0) {
            console.error('Error: timeRoleId must be greater than zero');
            return -1;
        }

        if (!(timeRole instanceof TimeRole)) {
            console.error('Error: timeRole must be an instance of TimeRole');
            return -1;
        }

        try {
            const data = {
                [dbSchema.TIME_ROLE_COLUMNS.TIME_ROLE_START_PICKUP_TIME]: timeRole.time_role_start_pickup_time,
                [dbSchema.TIME_ROLE_COLUMNS.TIME_ROLE_START_DROP_OFF_TIME]: timeRole.time_role_start_drop_off_time,
                [dbSchema.TIME_ROLE_COLUMNS.TIME_ROLE_STATUS]: timeRole.time_role_status
            };

            const affectedRows = await this._protectedUpdateById(timeRoleId, data);
            if (affectedRows <= 0) {
                console.warn(`Warning: No time role updated for timeRoleId ${timeRoleId}`);
                return -1;
            }
            return affectedRows;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Delete time role
     * @param {number} timeRoleId
     * @return {Promise<number>} affected rows or -1 if failed
     * @memberof TimeRoleDAO
     */
    async deleteTimeRole(timeRoleId) {
        if (timeRoleId === null || timeRoleId === undefined || !Number.isInteger(timeRoleId)) {
            console.error('Error: timeRoleId is invalid');
            return -1;
        }

        if (timeRoleId <= 0) {
            console.error('Error: timeRoleId must be greater than zero');
            return -1;
        }

        try {
            const affectedRows = await this._protectedDeleteById(timeRoleId);
            if (affectedRows <= 0) {
                console.warn(`Warning: No time role deleted for timeRoleId ${timeRoleId}`);
                return -1;
            }
            return affectedRows;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }
}

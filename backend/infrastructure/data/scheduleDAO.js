import { Schedule } from "../../index.js";
import { default as BaseDAO } from "./baseDAO.js";
import dbSchema from "./dbSchema.js";
import mySql from "mysql2/promise"

export default class ScheduleDAO extends BaseDAO {
    
    /**
     * Creates an instance of ScheduleDAO.
     * @param {mySql.PoolConnection} connection
     * @memberof ScheduleDAO
     */
    constructor(connection) {
        super(connection, "Schedule", dbSchema.SCHEDULE_COLUMNS.SCHEDULE_ID);
    }

    /**
     * Get all schedules
     * @return {Promise<Schedule[]>} 
     * @memberof ScheduleDAO
     */
    async getAllSchedules() {
        try {
            const results = await this._protectedGetAll();
            if (!results || results.length === 0) {
                console.warn(`Warning: No schedules found`);
                return [];
            }
            return results.map(row => Schedule.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get schedule by ID
     * @param {number} scheduleId
     * @return {Promise<Schedule>} 
     * @memberof ScheduleDAO
     */
    async getByScheduleId(scheduleId) {
        if (scheduleId === null || scheduleId === undefined || !Number.isInteger(scheduleId)) {
            console.warn(`Warning: scheduleId is invalid : ${scheduleId}`);
            return new Schedule();
        }

        try {
            if (scheduleId <= 0) {
                console.warn(`Warning: scheduleId must be greater than zero : ${scheduleId}`);
                return new Schedule();
            }

            const result = await this._protectedGetById(scheduleId);
            if (!result) {
                console.warn(`Warning: No data found for scheduleId ${scheduleId}`);
                return new Schedule();
            }
            return Schedule.fromDatabase(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return new Schedule();
        }
    }

    /**
     * Get schedules by multiple IDs
     * @param {number[]} scheduleIds
     * @return {Promise<Schedule[]>} 
     * @memberof ScheduleDAO
     */
    async getByScheduleIds(scheduleIds) {
        if (!Array.isArray(scheduleIds) || scheduleIds.length === 0) {
            console.warn(`Warning: scheduleIds must be a non-empty array`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], scheduleIds,
                `WHERE ${this.primaryKeyName} IN (${scheduleIds.map(() => '?').join(', ')})`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No schedules found for provided scheduleIds`);
                return [];
            }
            return results.map(row => Schedule.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get schedules by manager ID
     * @param {number} managerId
     * @return {Promise<Schedule[]>} 
     * @memberof ScheduleDAO
     */
    async getByManagerId(managerId) {
        if (managerId === null || managerId === undefined || !Number.isInteger(managerId)) {
            console.warn(`Warning: managerId is invalid : ${managerId}`);
            return [];
        }

        try {
            if (managerId <= 0) {
                console.warn(`Warning: managerId must be greater than zero : ${managerId}`);
                return [];
            }

            const results = await this._protectedGetBySelection(["*"], [managerId],
                `WHERE ${dbSchema.SCHEDULE_COLUMNS.SCHEDULE_BY_MANAGER_ID} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No schedules found for managerId ${managerId}`);
                return [];
            }
            return results.map(row => Schedule.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get schedules by driver ID
     * @param {number} driverId
     * @return {Promise<Schedule[]>} 
     * @memberof ScheduleDAO
     */
    async getByDriverId(driverId) {
        if (driverId === null || driverId === undefined || !Number.isInteger(driverId)) {
            console.warn(`Warning: driverId is invalid : ${driverId}`);
            return [];
        }

        try {
            if (driverId <= 0) {
                console.warn(`Warning: driverId must be greater than zero : ${driverId}`);
                return [];
            }

            const results = await this._protectedGetBySelection(["*"], [driverId],
                `WHERE ${dbSchema.SCHEDULE_COLUMNS.SCHEDULE_DRIVER_ID} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No schedules found for driverId ${driverId}`);
                return [];
            }
            return results.map(row => Schedule.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get schedules by status
     * @param {boolean} status
     * @return {Promise<Schedule[]>} 
     * @memberof ScheduleDAO
     */
    async getByStatus(status) {
        if (typeof status !== 'boolean') {
            console.warn(`Warning: status must be boolean`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [status],
                `WHERE ${dbSchema.SCHEDULE_COLUMNS.SCHEDULE_STATUS} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No schedules found for status ${status}`);
                return [];
            }
            return results.map(row => Schedule.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get schedules by date range
     * @param {Date} startDate
     * @param {Date} endDate
     * @return {Promise<Schedule[]>} 
     * @memberof ScheduleDAO
     */
    async getByDateRange(startDate, endDate) {
        if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
            console.warn(`Warning: startDate and endDate must be Date objects`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [startDate, endDate],
                `WHERE ${dbSchema.SCHEDULE_COLUMNS.SCHEDULE_START_DATE} >= ? AND ${dbSchema.SCHEDULE_COLUMNS.SCHEDULE_END_DATE} <= ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No schedules found for date range`);
                return [];
            }
            return results.map(row => Schedule.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Create new schedule
     * @param {Schedule} schedule
     * @return {Promise<number>} insertId or -1 if failed
     * @memberof ScheduleDAO
     */
    async createSchedule(schedule) {
        if (!(schedule instanceof Schedule)) {
            console.error('Error: schedule must be an instance of Schedule');
            return -1;
        }

        try {
            const data = {
                [dbSchema.SCHEDULE_COLUMNS.SCHEDULE_BY_MANAGER_ID]: schedule.schedule_by_manager_id,
                [dbSchema.SCHEDULE_COLUMNS.SCHEDULE_DRIVER_ID]: schedule.schedule_driver_id,
                [dbSchema.SCHEDULE_COLUMNS.SCHEDULE_START_DATE]: schedule.schedule_start_date,
                [dbSchema.SCHEDULE_COLUMNS.SCHEDULE_END_DATE]: schedule.schedule_end_date,
                [dbSchema.SCHEDULE_COLUMNS.SCHEDULE_STATUS]: schedule.schedule_status
            };

            const insertId = await this._protectedCreate(data);
            if (insertId <= 0) {
                console.error('Error: Failed to create schedule');
                return -1;
            }
            return insertId;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update schedule
     * @param {number} scheduleId
     * @param {Schedule} schedule
     * @return {Promise<number>} affected rows or -1 if failed
     * @memberof ScheduleDAO
     */
    async updateSchedule(scheduleId, schedule) {
        if (scheduleId === null || scheduleId === undefined || !Number.isInteger(scheduleId)) {
            console.error('Error: scheduleId is invalid');
            return -1;
        }

        if (scheduleId <= 0) {
            console.error('Error: scheduleId must be greater than zero');
            return -1;
        }

        if (!(schedule instanceof Schedule)) {
            console.error('Error: schedule must be an instance of Schedule');
            return -1;
        }

        try {
            const data = {
                [dbSchema.SCHEDULE_COLUMNS.SCHEDULE_BY_MANAGER_ID]: schedule.schedule_by_manager_id,
                [dbSchema.SCHEDULE_COLUMNS.SCHEDULE_DRIVER_ID]: schedule.schedule_driver_id,
                [dbSchema.SCHEDULE_COLUMNS.SCHEDULE_START_DATE]: schedule.schedule_start_date,
                [dbSchema.SCHEDULE_COLUMNS.SCHEDULE_END_DATE]: schedule.schedule_end_date,
                [dbSchema.SCHEDULE_COLUMNS.SCHEDULE_STATUS]: schedule.schedule_status
            };

            const affectedRows = await this._protectedUpdateById(scheduleId, data);
            if (affectedRows <= 0) {
                console.warn(`Warning: No schedule updated for scheduleId ${scheduleId}`);
                return -1;
            }
            return affectedRows;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Delete schedule
     * @param {number} scheduleId
     * @return {Promise<number>} affected rows or -1 if failed
     * @memberof ScheduleDAO
     */
    async deleteSchedule(scheduleId) {
        if (scheduleId === null || scheduleId === undefined || !Number.isInteger(scheduleId)) {
            console.error('Error: scheduleId is invalid');
            return -1;
        }

        if (scheduleId <= 0) {
            console.error('Error: scheduleId must be greater than zero');
            return -1;
        }

        try {
            const affectedRows = await this._protectedDeleteById(scheduleId);
            if (affectedRows <= 0) {
                console.warn(`Warning: No schedule deleted for scheduleId ${scheduleId}`);
                return -1;
            }
            return affectedRows;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }
}

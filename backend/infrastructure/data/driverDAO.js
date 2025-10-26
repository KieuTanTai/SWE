import Driver from "../../models/Driver.js";
import { default as BaseDAO } from "./baseDAO.js";
import dbSchema from "./dbSchema.js";
import mySql from "mysql2/promise";

/**
 * DriverDAO
 * Data Access Object for Driver table operations
 */
export default class DriverDAO extends BaseDAO {
    
    /**
     * Creates an instance of DriverDAO.
     * @param {mySql.PoolConnection} connection
     * @memberof DriverDAO
     */
    constructor(connection) {
        super(connection, "Driver", dbSchema.DRIVER_COLUMNS.DRIVER_PERSON_ID);
    }

    /**
     * Get all drivers
     * @return {Promise<Driver[]>} 
     * @memberof DriverDAO
     */
    async getAllDrivers() {
        try {
            const results = await this._protectedGetAll();
            if (!results || results.length === 0) {
                console.warn(`Warning: No drivers found`);
                return [];
            }
            return results.map(row => Driver.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get driver by person ID
     * @param {number} driverPersonId
     * @return {Promise<Driver>} 
     * @memberof DriverDAO
     */
    async getByDriverPersonId(driverPersonId) {
        if (driverPersonId === null || driverPersonId === undefined || !Number.isInteger(driverPersonId)) {
            console.warn(`Warning: driverPersonId is invalid : ${driverPersonId}`);
            return new Driver();
        }

        try {
            if (driverPersonId <= 0) {
                console.warn(`Warning: driverPersonId must be greater than zero : ${driverPersonId}`);
                return new Driver();
            }

            const result = await this._protectedGetById(driverPersonId);
            if (!result) {
                console.warn(`Warning: No data found for driverPersonId ${driverPersonId}`);
                return new Driver();
            }
            return Driver.fromDatabase(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return new Driver();
        }
    }

    /**
     * Get drivers by multiple person IDs
     * @param {number[]} driverPersonIds
     * @return {Promise<Driver[]>} 
     * @memberof DriverDAO
     */
    async getByDriverPersonIds(driverPersonIds) {
        if (!Array.isArray(driverPersonIds) || driverPersonIds.length === 0) {
            console.warn(`Warning: driverPersonIds must be a non-empty array`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], driverPersonIds,
                `WHERE ${this.primaryKeyName} IN (${driverPersonIds.map(() => '?').join(', ')})`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No drivers found for provided driverPersonIds`);
                return [];
            }
            return results.map(row => Driver.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get drivers by experience type
     * @param {string} experienceType - 'day', 'month', 'year'
     * @return {Promise<Driver[]>} 
     * @memberof DriverDAO
     */
    async getByExperienceType(experienceType) {
        if (!experienceType || typeof experienceType !== 'string' || experienceType.trim() === '') {
            console.warn(`Warning: experienceType is invalid : ${experienceType}`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [experienceType],
                `WHERE ${dbSchema.DRIVER_COLUMNS.DRIVER_EXPERIENCE_TYPE} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No drivers found for experienceType ${experienceType}`);
                return [];
            }
            return results.map(row => Driver.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get drivers by minimum experience
     * @param {number} minExperience
     * @param {string} experienceType - 'day', 'month', 'year'
     * @return {Promise<Driver[]>} 
     * @memberof DriverDAO
     */
    async getByMinExperience(minExperience, experienceType = 'year') {
        if (typeof minExperience !== 'number' || minExperience < 0) {
            console.warn(`Warning: minExperience is invalid : ${minExperience}`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [minExperience, experienceType],
                `WHERE ${dbSchema.DRIVER_COLUMNS.DRIVER_EXPERIENCE} >= ? AND ${dbSchema.DRIVER_COLUMNS.DRIVER_EXPERIENCE_TYPE} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No drivers found with experience >= ${minExperience} ${experienceType}`);
                return [];
            }
            return results.map(row => Driver.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get drivers by maximum late arrival count
     * @param {number} maxLateArrivalCount
     * @return {Promise<Driver[]>} 
     * @memberof DriverDAO
     */
    async getByMaxLateArrivalCount(maxLateArrivalCount) {
        if (typeof maxLateArrivalCount !== 'number' || maxLateArrivalCount < 0) {
            console.warn(`Warning: maxLateArrivalCount is invalid : ${maxLateArrivalCount}`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [maxLateArrivalCount],
                `WHERE ${dbSchema.DRIVER_COLUMNS.DRIVER_LATE_ARRIVAL_COUNT} <= ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No drivers found with late arrival count <= ${maxLateArrivalCount}`);
                return [];
            }
            return results.map(row => Driver.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Create a new driver
     * @param {Driver} driver
     * @return {Promise<number>} The driver_person_id or -1 if failed
     * @memberof DriverDAO
     */
    async createDriver(driver) {
        if (!(driver instanceof Driver)) {
            console.warn(`Warning: Invalid driver object`);
            return -1;
        }

        try {
            const result = await this._protectedCreate(driver);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Create multiple drivers
     * @param {Driver[]} drivers
     * @return {Promise<number|number[]>} Number of affected rows or array of IDs, or -1 if failed
     * @memberof DriverDAO
     */
    async createDrivers(drivers) {
        if (!Array.isArray(drivers) || drivers.length === 0) {
            console.warn(`Warning: drivers must be a non-empty array`);
            return -1;
        }

        try {
            const valueInserts = drivers.map(driver => ({
                [dbSchema.DRIVER_COLUMNS.DRIVER_PERSON_ID]: driver.driver_person_id,
                [dbSchema.DRIVER_COLUMNS.DRIVER_EXPERIENCE]: driver.driver_experience,
                [dbSchema.DRIVER_COLUMNS.DRIVER_EXPERIENCE_TYPE]: driver.driver_experience_type,
                [dbSchema.DRIVER_COLUMNS.DRIVER_LATE_ARRIVAL_COUNT]: driver.driver_late_arrival_count
            }));
            const results = await this._protectedMultiCreate([
                dbSchema.DRIVER_COLUMNS.DRIVER_PERSON_ID,
                dbSchema.DRIVER_COLUMNS.DRIVER_EXPERIENCE,
                dbSchema.DRIVER_COLUMNS.DRIVER_EXPERIENCE_TYPE,
                dbSchema.DRIVER_COLUMNS.DRIVER_LATE_ARRIVAL_COUNT
            ], valueInserts);
            return results;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Private method to update a single driver
     * @param {Driver} driver
     * @return {Promise<number>} Number of affected rows or -1 if failed
     * @memberof DriverDAO
     */
    async #updateDriver(driver) {
        if (!driver) {
            console.warn(`Warning: Invalid driver: ${driver}`);
            return -1;
        }
        try {
            const result = await this._protectedUpdateById(driver[dbSchema.DRIVER_COLUMNS.DRIVER_PERSON_ID], driver);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Private method to update multiple drivers
     * @param {Driver[]} drivers
     * @return {Promise<number>} Number of affected rows or -1 if failed
     * @memberof DriverDAO
     */
    async #updateDrivers(drivers) {
        if (!Array.isArray(drivers) || drivers.length === 0) {
            console.warn(`Warning: drivers must be a non-empty array`);
            return -1;
        }

        try {
            const result = await this._protectedMultiUpdateById(drivers);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update driver experience
     * @param {number} driverPersonId
     * @param {number} newExperience
     * @param {string} experienceType
     * @return {Promise<number>} Number of affected rows or -1 if failed
     * @memberof DriverDAO
     */
    async updateExperience(driverPersonId, newExperience, experienceType) {
        if (!driverPersonId || !Number.isInteger(driverPersonId)) {
            console.warn(`Warning: Invalid driverPersonId`);
            return -1;
        }

        if (typeof newExperience !== 'number' || newExperience < 0) {
            console.warn(`Warning: Invalid newExperience`);
            return -1;
        }

        try {
            const result = await this.getByDriverPersonId(driverPersonId);
            if (!result || !result.driver_person_id) {
                console.warn(`Warning: No driver found for driverPersonId ${driverPersonId}`);
                return -1;
            }
            if (result.driver_experience === newExperience && result.driver_experience_type === experienceType) {
                console.info(`Info: Experience is already ${newExperience} ${experienceType} for driverPersonId ${driverPersonId}`);
                return 0;
            }
            result.driver_experience = newExperience;
            result.driver_experience_type = experienceType;
            return await this.#updateDriver(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update driver late arrival count
     * @param {number} driverPersonId
     * @param {number} newLateArrivalCount
     * @return {Promise<number>} Number of affected rows or -1 if failed
     * @memberof DriverDAO
     */
    async updateLateArrivalCount(driverPersonId, newLateArrivalCount) {
        if (!driverPersonId || !Number.isInteger(driverPersonId)) {
            console.warn(`Warning: Invalid driverPersonId`);
            return -1;
        }

        if (typeof newLateArrivalCount !== 'number' || newLateArrivalCount < 0) {
            console.warn(`Warning: Invalid newLateArrivalCount`);
            return -1;
        }

        try {
            const result = await this.getByDriverPersonId(driverPersonId);
            if (!result || !result.driver_person_id) {
                console.warn(`Warning: No driver found for driverPersonId ${driverPersonId}`);
                return -1;
            }
            if (result.driver_late_arrival_count === newLateArrivalCount) {
                console.info(`Info: Late arrival count is already ${newLateArrivalCount} for driverPersonId ${driverPersonId}`);
                return 0;
            }
            result.driver_late_arrival_count = newLateArrivalCount;
            return await this.#updateDriver(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Increment late arrival count for a driver
     * @param {number} driverPersonId
     * @return {Promise<number>} Number of affected rows or -1 if failed
     * @memberof DriverDAO
     */
    async incrementLateArrivalCount(driverPersonId) {
        if (!driverPersonId || !Number.isInteger(driverPersonId)) {
            console.warn(`Warning: Invalid driverPersonId`);
            return -1;
        }

        try {
            const result = await this.getByDriverPersonId(driverPersonId);
            if (!result || !result.driver_person_id) {
                console.warn(`Warning: No driver found for driverPersonId ${driverPersonId}`);
                return -1;
            }
            result.driver_late_arrival_count += 1;
            return await this.#updateDriver(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update experiences of multiple drivers
     * @param {Array<{driver_person_id: number, driver_experience: number, driver_experience_type: string}>} drivers - Plain objects with snake_case properties
     * @return {Promise<number>} Number of affected rows or -1 if failed
     * @memberof DriverDAO
     */
    async updateExperiences(drivers) {
        if (!Array.isArray(drivers) || drivers.length === 0) {
            console.warn(`Warning: drivers must be a non-empty array`);
            return -1;
        }
        try {
            const formattedDrivers = drivers.map(driver => {
                const obj = {};
                obj[dbSchema.DRIVER_COLUMNS.DRIVER_PERSON_ID] = driver.driver_person_id;
                obj[dbSchema.DRIVER_COLUMNS.DRIVER_EXPERIENCE] = driver.driver_experience;
                obj[dbSchema.DRIVER_COLUMNS.DRIVER_EXPERIENCE_TYPE] = driver.driver_experience_type;
                return new Driver(obj);
            });
            return await this.#updateDrivers(formattedDrivers);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update late arrival counts of multiple drivers
     * @param {Array<{driver_person_id: number, driver_late_arrival_count: number}>} drivers - Plain objects with snake_case properties
     * @return {Promise<number>} Number of affected rows or -1 if failed
     * @memberof DriverDAO
     */
    async updateLateArrivalCounts(drivers) {
        if (!Array.isArray(drivers) || drivers.length === 0) {
            console.warn(`Warning: drivers must be a non-empty array`);
            return -1;
        }
        try {
            const formattedDrivers = drivers.map(driver => {
                const obj = {};
                obj[dbSchema.DRIVER_COLUMNS.DRIVER_PERSON_ID] = driver.driver_person_id;
                obj[dbSchema.DRIVER_COLUMNS.DRIVER_LATE_ARRIVAL_COUNT] = driver.driver_late_arrival_count;
                return new Driver(obj);
            });
            return await this.#updateDrivers(formattedDrivers);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Delete driver by person ID
     * @param {number} driverPersonId
     * @return {Promise<number>} Number of affected rows or -1 if failed
     * @memberof DriverDAO
     */
    async deleteDriver(driverPersonId) {
        if (!driverPersonId || !Number.isInteger(driverPersonId)) {
            console.warn(`Warning: Invalid driverPersonId`);
            return -1;
        }

        try {
            const result = await this._protectedDeleteById(driverPersonId);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Delete multiple drivers by person IDs
     * @param {number[]} driverPersonIds
     * @return {Promise<number>} Number of affected rows or -1 if failed
     * @memberof DriverDAO
     */
    async deleteDrivers(driverPersonIds) {
        if (!Array.isArray(driverPersonIds) || driverPersonIds.length === 0) {
            console.warn(`Warning: driverPersonIds must be a non-empty array`);
            return -1;
        }

        try {
            const result = await this._protectedDeleteByIds(driverPersonIds);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }
}

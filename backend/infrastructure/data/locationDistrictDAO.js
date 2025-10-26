import LocationDistrict from "../../models/LocationDistrict.js";
import { default as BaseDAO } from "./baseDAO.js";
import dbSchema from "./dbSchema.js";
import mySql from "mysql2/promise"

export default class LocationDistrictDAO extends BaseDAO {
    
    /**
     * Creates an instance of LocationDistrictDAO.
     * @param {mySql.PoolConnection} connection
     * @memberof LocationDistrictDAO
     */
    constructor(connection) {
        super(connection, "Location_District", dbSchema.LOCATION_DISTRICT_COLUMNS.LOCATION_DISTRICT_ID);
    }

    /**
     * Get all districts
     * @return {Promise<LocationDistrict[]>} 
     * @memberof LocationDistrictDAO
     */
    async getAllDistricts() {
        try {
            const results = await this._protectedGetAll();
            if (!results || results.length === 0) {
                console.warn(`Warning: No districts found`);
                return [];
            }
            return results.map(row => LocationDistrict.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get district by ID
     * @param {number} districtId
     * @return {Promise<LocationDistrict>} 
     * @memberof LocationDistrictDAO
     */
    async getByDistrictId(districtId) {
        if (districtId === null || districtId === undefined || !Number.isInteger(districtId)) {
            console.warn(`Warning: districtId is invalid : ${districtId}`);
            return new LocationDistrict();
        }

        try {
            if (districtId <= 0) {
                console.warn(`Warning: districtId must be greater than zero : ${districtId}`);
                return new LocationDistrict();
            }

            const result = await this._protectedGetById(districtId);
            if (!result) {
                console.warn(`Warning: No data found for districtId ${districtId}`);
                return new LocationDistrict();
            }
            return LocationDistrict.fromDatabase(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return new LocationDistrict();
        }
    }

    /**
     * Get districts by multiple IDs
     * @param {number[]} districtIds
     * @return {Promise<LocationDistrict[]>} 
     * @memberof LocationDistrictDAO
     */
    async getByDistrictIds(districtIds) {
        if (!Array.isArray(districtIds) || districtIds.length === 0) {
            console.warn(`Warning: districtIds must be a non-empty array`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], districtIds,
                `WHERE ${this.primaryKeyName} IN (${districtIds.map(() => '?').join(', ')})`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No districts found for provided districtIds`);
                return [];
            }
            return results.map(row => LocationDistrict.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get districts by city ID
     * @param {number} cityId
     * @return {Promise<LocationDistrict[]>} 
     * @memberof LocationDistrictDAO
     */
    async getByCityId(cityId) {
        if (cityId === null || cityId === undefined || !Number.isInteger(cityId)) {
            console.warn(`Warning: cityId is invalid : ${cityId}`);
            return [];
        }

        try {
            if (cityId <= 0) {
                console.warn(`Warning: cityId must be greater than zero : ${cityId}`);
                return [];
            }

            const results = await this._protectedGetBySelection(["*"], [cityId],
                `WHERE ${dbSchema.LOCATION_DISTRICT_COLUMNS.LOCATION_CITY_ID} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No districts found for cityId ${cityId}`);
                return [];
            }
            return results.map(row => LocationDistrict.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get district by name in specific city
     * @param {string} districtName
     * @param {number} cityId
     * @return {Promise<LocationDistrict>} 
     * @memberof LocationDistrictDAO
     */
    async getByDistrictName(districtName, cityId) {
        if (!districtName || typeof districtName !== 'string' || districtName.trim() === '') {
            console.warn(`Warning: districtName is invalid : ${districtName}`);
            return new LocationDistrict();
        }

        if (cityId === null || cityId === undefined || !Number.isInteger(cityId)) {
            console.warn(`Warning: cityId is invalid : ${cityId}`);
            return new LocationDistrict();
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [districtName, cityId],
                `WHERE ${dbSchema.LOCATION_DISTRICT_COLUMNS.LOCATION_DISTRICT_NAME} = ? AND ${dbSchema.LOCATION_DISTRICT_COLUMNS.LOCATION_CITY_ID} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No district found for districtName ${districtName} in cityId ${cityId}`);
                return new LocationDistrict();
            }
            return results.map(row => LocationDistrict.fromDatabase(row))[0];
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return new LocationDistrict();
        }
    }

    /**
     * Get districts by status
     * @param {boolean} status
     * @return {Promise<LocationDistrict[]>} 
     * @memberof LocationDistrictDAO
     */
    async getByStatus(status) {
        if (typeof status !== 'boolean') {
            console.warn(`Warning: status must be boolean`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [status],
                `WHERE ${dbSchema.LOCATION_DISTRICT_COLUMNS.LOCATION_DISTRICT_STATUS} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No districts found for status ${status}`);
                return [];
            }
            return results.map(row => LocationDistrict.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Create new district
     * @param {LocationDistrict} district
     * @return {Promise<number>} insertId or -1 if failed
     * @memberof LocationDistrictDAO
     */
    async createDistrict(district) {
        if (!(district instanceof LocationDistrict)) {
            console.error('Error: district must be an instance of LocationDistrict');
            return -1;
        }

        try {
            const data = {
                [dbSchema.LOCATION_DISTRICT_COLUMNS.LOCATION_DISTRICT_NAME]: district.location_district_name,
                [dbSchema.LOCATION_DISTRICT_COLUMNS.LOCATION_CITY_ID]: district.location_city_id,
                [dbSchema.LOCATION_DISTRICT_COLUMNS.LOCATION_DISTRICT_STATUS]: district.location_district_status
            };

            const insertId = await this._protectedCreate(data);
            if (insertId <= 0) {
                console.error('Error: Failed to create district');
                return -1;
            }
            return insertId;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update district
     * @param {number} districtId
     * @param {LocationDistrict} district
     * @return {Promise<number>} affected rows or -1 if failed
     * @memberof LocationDistrictDAO
     */
    async updateDistrict(districtId, district) {
        if (districtId === null || districtId === undefined || !Number.isInteger(districtId)) {
            console.error('Error: districtId is invalid');
            return -1;
        }

        if (districtId <= 0) {
            console.error('Error: districtId must be greater than zero');
            return -1;
        }

        if (!(district instanceof LocationDistrict)) {
            console.error('Error: district must be an instance of LocationDistrict');
            return -1;
        }

        try {
            const data = {
                [dbSchema.LOCATION_DISTRICT_COLUMNS.LOCATION_DISTRICT_NAME]: district.location_district_name,
                [dbSchema.LOCATION_DISTRICT_COLUMNS.LOCATION_CITY_ID]: district.location_city_id,
                [dbSchema.LOCATION_DISTRICT_COLUMNS.LOCATION_DISTRICT_STATUS]: district.location_district_status
            };

            const affectedRows = await this._protectedUpdateById(districtId, data);
            if (affectedRows <= 0) {
                console.warn(`Warning: No district updated for districtId ${districtId}`);
                return -1;
            }
            return affectedRows;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Delete district
     * @param {number} districtId
     * @return {Promise<number>} affected rows or -1 if failed
     * @memberof LocationDistrictDAO
     */
    async deleteDistrict(districtId) {
        if (districtId === null || districtId === undefined || !Number.isInteger(districtId)) {
            console.error('Error: districtId is invalid');
            return -1;
        }

        if (districtId <= 0) {
            console.error('Error: districtId must be greater than zero');
            return -1;
        }

        try {
            const affectedRows = await this._protectedDeleteById(districtId);
            if (affectedRows <= 0) {
                console.warn(`Warning: No district deleted for districtId ${districtId}`);
                return -1;
            }
            return affectedRows;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }
}

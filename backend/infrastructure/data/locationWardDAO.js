import { LocationWard } from "../../index.js";
import { default as BaseDAO } from "./baseDAO.js";
import dbSchema from "./dbSchema.js";
import mySql from "mysql2/promise"

export default class LocationWardDAO extends BaseDAO {
    
    /**
     * Creates an instance of LocationWardDAO.
     * @param {mySql.PoolConnection} connection
     * @memberof LocationWardDAO
     */
    constructor(connection) {
        super(connection, "Location_Ward", dbSchema.LOCATION_WARD_COLUMNS.LOCATION_WARD_ID);
    }

    /**
     * Get all wards
     * @return {Promise<LocationWard[]>} 
     * @memberof LocationWardDAO
     */
    async getAllWards() {
        try {
            const results = await this._protectedGetAll();
            if (!results || results.length === 0) {
                console.warn(`Warning: No wards found`);
                return [];
            }
            return results.map(row => LocationWard.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get ward by ID
     * @param {number} wardId
     * @return {Promise<LocationWard>} 
     * @memberof LocationWardDAO
     */
    async getByWardId(wardId) {
        if (wardId === null || wardId === undefined || !Number.isInteger(wardId)) {
            console.warn(`Warning: wardId is invalid : ${wardId}`);
            return new LocationWard();
        }

        try {
            if (wardId <= 0) {
                console.warn(`Warning: wardId must be greater than zero : ${wardId}`);
                return new LocationWard();
            }

            const result = await this._protectedGetById(wardId);
            if (!result) {
                console.warn(`Warning: No data found for wardId ${wardId}`);
                return new LocationWard();
            }
            return LocationWard.fromDatabase(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return new LocationWard();
        }
    }

    /**
     * Get wards by multiple IDs
     * @param {number[]} wardIds
     * @return {Promise<LocationWard[]>} 
     * @memberof LocationWardDAO
     */
    async getByWardIds(wardIds) {
        if (!Array.isArray(wardIds) || wardIds.length === 0) {
            console.warn(`Warning: wardIds must be a non-empty array`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], wardIds,
                `WHERE ${this.primaryKeyName} IN (${wardIds.map(() => '?').join(', ')})`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No wards found for provided wardIds`);
                return [];
            }
            return results.map(row => LocationWard.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get wards by district ID
     * @param {number} districtId
     * @return {Promise<LocationWard[]>} 
     * @memberof LocationWardDAO
     */
    async getByDistrictId(districtId) {
        if (districtId === null || districtId === undefined || !Number.isInteger(districtId)) {
            console.warn(`Warning: districtId is invalid : ${districtId}`);
            return [];
        }

        try {
            if (districtId <= 0) {
                console.warn(`Warning: districtId must be greater than zero : ${districtId}`);
                return [];
            }

            const results = await this._protectedGetBySelection(["*"], [districtId],
                `WHERE ${dbSchema.LOCATION_WARD_COLUMNS.LOCATION_DISTRICT_ID} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No wards found for districtId ${districtId}`);
                return [];
            }
            return results.map(row => LocationWard.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get ward by name in specific district
     * @param {string} wardName
     * @param {number} districtId
     * @return {Promise<LocationWard>} 
     * @memberof LocationWardDAO
     */
    async getByWardName(wardName, districtId) {
        if (!wardName || typeof wardName !== 'string' || wardName.trim() === '') {
            console.warn(`Warning: wardName is invalid : ${wardName}`);
            return new LocationWard();
        }

        if (districtId === null || districtId === undefined || !Number.isInteger(districtId)) {
            console.warn(`Warning: districtId is invalid : ${districtId}`);
            return new LocationWard();
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [wardName, districtId],
                `WHERE ${dbSchema.LOCATION_WARD_COLUMNS.LOCATION_WARD_NAME} = ? AND ${dbSchema.LOCATION_WARD_COLUMNS.LOCATION_DISTRICT_ID} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No ward found for wardName ${wardName} in districtId ${districtId}`);
                return new LocationWard();
            }
            return results.map(row => LocationWard.fromDatabase(row))[0];
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return new LocationWard();
        }
    }

    /**
     * Get wards by status
     * @param {boolean} status
     * @return {Promise<LocationWard[]>} 
     * @memberof LocationWardDAO
     */
    async getByStatus(status) {
        if (typeof status !== 'boolean') {
            console.warn(`Warning: status must be boolean`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [status],
                `WHERE ${dbSchema.LOCATION_WARD_COLUMNS.LOCATION_WARD_STATUS} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No wards found for status ${status}`);
                return [];
            }
            return results.map(row => LocationWard.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Create new ward
     * @param {LocationWard} ward
     * @return {Promise<number>} insertId or -1 if failed
     * @memberof LocationWardDAO
     */
    async createWard(ward) {
        if (!(ward instanceof LocationWard)) {
            console.error('Error: ward must be an instance of LocationWard');
            return -1;
        }

        try {
            const data = {
                [dbSchema.LOCATION_WARD_COLUMNS.LOCATION_WARD_NAME]: ward.location_ward_name,
                [dbSchema.LOCATION_WARD_COLUMNS.LOCATION_DISTRICT_ID]: ward.location_district_id,
                [dbSchema.LOCATION_WARD_COLUMNS.LOCATION_WARD_STATUS]: ward.location_ward_status
            };

            const insertId = await this._protectedCreate(data);
            if (insertId <= 0) {
                console.error('Error: Failed to create ward');
                return -1;
            }
            return insertId;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update ward
     * @param {number} wardId
     * @param {LocationWard} ward
     * @return {Promise<number>} affected rows or -1 if failed
     * @memberof LocationWardDAO
     */
    async updateWard(wardId, ward) {
        if (wardId === null || wardId === undefined || !Number.isInteger(wardId)) {
            console.error('Error: wardId is invalid');
            return -1;
        }

        if (wardId <= 0) {
            console.error('Error: wardId must be greater than zero');
            return -1;
        }

        if (!(ward instanceof LocationWard)) {
            console.error('Error: ward must be an instance of LocationWard');
            return -1;
        }

        try {
            const data = {
                [dbSchema.LOCATION_WARD_COLUMNS.LOCATION_WARD_NAME]: ward.location_ward_name,
                [dbSchema.LOCATION_WARD_COLUMNS.LOCATION_DISTRICT_ID]: ward.location_district_id,
                [dbSchema.LOCATION_WARD_COLUMNS.LOCATION_WARD_STATUS]: ward.location_ward_status
            };

            const affectedRows = await this._protectedUpdateById(wardId, data);
            if (affectedRows <= 0) {
                console.warn(`Warning: No ward updated for wardId ${wardId}`);
                return -1;
            }
            return affectedRows;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Delete ward
     * @param {number} wardId
     * @return {Promise<number>} affected rows or -1 if failed
     * @memberof LocationWardDAO
     */
    async deleteWard(wardId) {
        if (wardId === null || wardId === undefined || !Number.isInteger(wardId)) {
            console.error('Error: wardId is invalid');
            return -1;
        }

        if (wardId <= 0) {
            console.error('Error: wardId must be greater than zero');
            return -1;
        }

        try {
            const affectedRows = await this._protectedDeleteById(wardId);
            if (affectedRows <= 0) {
                console.warn(`Warning: No ward deleted for wardId ${wardId}`);
                return -1;
            }
            return affectedRows;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }
}

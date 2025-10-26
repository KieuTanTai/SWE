import { LocationCity } from "../../index.js";
import { default as BaseDAO } from "./baseDAO.js";
import dbSchema from "./dbSchema.js";
import mySql from "mysql2/promise"

export default class LocationCityDAO extends BaseDAO {
    
    /**
     * Creates an instance of LocationCityDAO.
     * @param {mySql.PoolConnection} connection
     * @memberof LocationCityDAO
     */
    constructor(connection) {
        super(connection, "Location_City", dbSchema.LOCATION_CITY_COLUMNS.LOCATION_CITY_ID);
    }

    /**
     * Get all cities
     * @return {Promise<LocationCity[]>} 
     * @memberof LocationCityDAO
     */
    async getAllCities() {
        try {
            const results = await this._protectedGetAll();
            if (!results || results.length === 0) {
                console.warn(`Warning: No cities found`);
                return [];
            }
            return results.map(row => LocationCity.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get city by ID
     * @param {number} cityId
     * @return {Promise<LocationCity>} 
     * @memberof LocationCityDAO
     */
    async getByCityId(cityId) {
        if (cityId === null || cityId === undefined || !Number.isInteger(cityId)) {
            console.warn(`Warning: cityId is invalid : ${cityId}`);
            return new LocationCity();
        }

        try {
            if (cityId <= 0) {
                console.warn(`Warning: cityId must be greater than zero : ${cityId}`);
                return new LocationCity();
            }

            const result = await this._protectedGetById(cityId);
            if (!result) {
                console.warn(`Warning: No data found for cityId ${cityId}`);
                return new LocationCity();
            }
            return LocationCity.fromDatabase(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return new LocationCity();
        }
    }

    /**
     * Get cities by multiple IDs
     * @param {number[]} cityIds
     * @return {Promise<LocationCity[]>} 
     * @memberof LocationCityDAO
     */
    async getByCityIds(cityIds) {
        if (!Array.isArray(cityIds) || cityIds.length === 0) {
            console.warn(`Warning: cityIds must be a non-empty array`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], cityIds,
                `WHERE ${this.primaryKeyName} IN (${cityIds.map(() => '?').join(', ')})`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No cities found for provided cityIds`);
                return [];
            }
            return results.map(row => LocationCity.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get city by name
     * @param {string} cityName
     * @return {Promise<LocationCity>} 
     * @memberof LocationCityDAO
     */
    async getByCityName(cityName) {
        if (!cityName || typeof cityName !== 'string' || cityName.trim() === '') {
            console.warn(`Warning: cityName is invalid : ${cityName}`);
            return new LocationCity();
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [cityName],
                `WHERE ${dbSchema.LOCATION_CITY_COLUMNS.LOCATION_CITY_NAME} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No city found for cityName ${cityName}`);
                return new LocationCity();
            }
            return results.map(row => LocationCity.fromDatabase(row))[0];
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return new LocationCity();
        }
    }

    /**
     * Get cities by name pattern
     * @param {string} partialName
     * @return {Promise<LocationCity[]>} 
     * @memberof LocationCityDAO
     */
    async getLikeCityName(partialName) {
        if (!partialName || typeof partialName !== 'string' || partialName.trim() === '') {
            console.warn(`Warning: partialName is invalid : ${partialName}`);
            return [];
        }

        try {
            const likePattern = `%${partialName}%`;
            const results = await this._protectedGetBySelection(["*"], [likePattern],
                `WHERE ${dbSchema.LOCATION_CITY_COLUMNS.LOCATION_CITY_NAME} LIKE ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No cities found matching partialName ${partialName}`);
                return [];
            }
            return results.map(row => LocationCity.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get cities by status
     * @param {boolean} status
     * @return {Promise<LocationCity[]>} 
     * @memberof LocationCityDAO
     */
    async getByStatus(status) {
        if (typeof status !== 'boolean') {
            console.warn(`Warning: status must be boolean`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [status],
                `WHERE ${dbSchema.LOCATION_CITY_COLUMNS.LOCATION_CITY_STATUS} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No cities found for status ${status}`);
                return [];
            }
            return results.map(row => LocationCity.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Create new city
     * @param {LocationCity} city
     * @return {Promise<number>} insertId or -1 if failed
     * @memberof LocationCityDAO
     */
    async createCity(city) {
        if (!(city instanceof LocationCity)) {
            console.error('Error: city must be an instance of LocationCity');
            return -1;
        }

        try {
            const data = {
                [dbSchema.LOCATION_CITY_COLUMNS.LOCATION_CITY_NAME]: city.location_city_name,
                [dbSchema.LOCATION_CITY_COLUMNS.LOCATION_CITY_STATUS]: city.location_city_status
            };

            const insertId = await this._protectedCreate(data);
            if (insertId <= 0) {
                console.error('Error: Failed to create city');
                return -1;
            }
            return insertId;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update city
     * @param {number} cityId
     * @param {LocationCity} city
     * @return {Promise<number>} affected rows or -1 if failed
     * @memberof LocationCityDAO
     */
    async updateCity(cityId, city) {
        if (cityId === null || cityId === undefined || !Number.isInteger(cityId)) {
            console.error('Error: cityId is invalid');
            return -1;
        }

        if (cityId <= 0) {
            console.error('Error: cityId must be greater than zero');
            return -1;
        }

        if (!(city instanceof LocationCity)) {
            console.error('Error: city must be an instance of LocationCity');
            return -1;
        }

        try {
            const data = {
                [dbSchema.LOCATION_CITY_COLUMNS.LOCATION_CITY_NAME]: city.location_city_name,
                [dbSchema.LOCATION_CITY_COLUMNS.LOCATION_CITY_STATUS]: city.location_city_status
            };

            const affectedRows = await this._protectedUpdateById(cityId, data);
            if (affectedRows <= 0) {
                console.warn(`Warning: No city updated for cityId ${cityId}`);
                return -1;
            }
            return affectedRows;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Delete city
     * @param {number} cityId
     * @return {Promise<number>} affected rows or -1 if failed
     * @memberof LocationCityDAO
     */
    async deleteCity(cityId) {
        if (cityId === null || cityId === undefined || !Number.isInteger(cityId)) {
            console.error('Error: cityId is invalid');
            return -1;
        }

        if (cityId <= 0) {
            console.error('Error: cityId must be greater than zero');
            return -1;
        }

        try {
            const affectedRows = await this._protectedDeleteById(cityId);
            if (affectedRows <= 0) {
                console.warn(`Warning: No city deleted for cityId ${cityId}`);
                return -1;
            }
            return affectedRows;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }
}

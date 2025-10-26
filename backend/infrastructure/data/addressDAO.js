import { Address } from "../../index.js";
import { default as BaseDAO } from "./baseDAO.js";
import dbSchema from "./dbSchema.js";
import mySql from "mysql2/promise"

export default class AddressDAO extends BaseDAO {
    
    /**
     * Creates an instance of AddressDAO.
     * @param {mySql.PoolConnection} connection
     * @memberof AddressDAO
     */
    constructor(connection) {
        super(connection, "Address", dbSchema.ADDRESS_COLUMNS.ADDRESS_ID);
    }

    /**
     * Get all addresses
     * @return {Promise<Address[]>} 
     * @memberof AddressDAO
     */
    async getAllAddresses() {
        try {
            const results = await this._protectedGetAll();
            if (!results || results.length === 0) {
                console.warn(`Warning: No addresses found`);
                return [];
            }
            return results.map(row => Address.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get address by ID
     * @param {number} addressId
     * @return {Promise<Address>} 
     * @memberof AddressDAO
     */
    async getByAddressId(addressId) {
        if (addressId === null || addressId === undefined || !Number.isInteger(addressId)) {
            console.warn(`Warning: addressId is invalid : ${addressId}`);
            return new Address();
        }

        try {
            if (addressId <= 0) {
                console.warn(`Warning: addressId must be greater than zero : ${addressId}`);
                return new Address();
            }

            const result = await this._protectedGetById(addressId);
            if (!result) {
                console.warn(`Warning: No data found for addressId ${addressId}`);
                return new Address();
            }
            return Address.fromDatabase(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return new Address();
        }
    }

    /**
     * Get addresses by multiple IDs
     * @param {number[]} addressIds
     * @return {Promise<Address[]>} 
     * @memberof AddressDAO
     */
    async getByAddressIds(addressIds) {
        if (!Array.isArray(addressIds) || addressIds.length === 0) {
            console.warn(`Warning: addressIds must be a non-empty array`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], addressIds,
                `WHERE ${this.primaryKeyName} IN (${addressIds.map(() => '?').join(', ')})`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No addresses found for provided addressIds`);
                return [];
            }
            return results.map(row => Address.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get addresses by city ID
     * @param {number} cityId
     * @return {Promise<Address[]>} 
     * @memberof AddressDAO
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
                `WHERE ${dbSchema.ADDRESS_COLUMNS.ADDRESS_CITY_ID} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No addresses found for cityId ${cityId}`);
                return [];
            }
            return results.map(row => Address.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get addresses by district ID
     * @param {number} districtId
     * @return {Promise<Address[]>} 
     * @memberof AddressDAO
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
                `WHERE ${dbSchema.ADDRESS_COLUMNS.ADDRESS_DISTRICT_ID} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No addresses found for districtId ${districtId}`);
                return [];
            }
            return results.map(row => Address.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get addresses by ward ID
     * @param {number} wardId
     * @return {Promise<Address[]>} 
     * @memberof AddressDAO
     */
    async getByWardId(wardId) {
        if (wardId === null || wardId === undefined || !Number.isInteger(wardId)) {
            console.warn(`Warning: wardId is invalid : ${wardId}`);
            return [];
        }

        try {
            if (wardId <= 0) {
                console.warn(`Warning: wardId must be greater than zero : ${wardId}`);
                return [];
            }

            const results = await this._protectedGetBySelection(["*"], [wardId],
                `WHERE ${dbSchema.ADDRESS_COLUMNS.ADDRESS_WARD_ID} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No addresses found for wardId ${wardId}`);
                return [];
            }
            return results.map(row => Address.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get addresses by full location
     * @param {number} cityId
     * @param {number} districtId
     * @param {number} wardId
     * @return {Promise<Address[]>} 
     * @memberof AddressDAO
     */
    async getByLocation(cityId, districtId, wardId) {
        if (!Number.isInteger(cityId) || !Number.isInteger(districtId) || !Number.isInteger(wardId)) {
            console.warn(`Warning: Invalid location IDs`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [cityId, districtId, wardId],
                `WHERE ${dbSchema.ADDRESS_COLUMNS.ADDRESS_CITY_ID} = ? AND ${dbSchema.ADDRESS_COLUMNS.ADDRESS_DISTRICT_ID} = ? AND ${dbSchema.ADDRESS_COLUMNS.ADDRESS_WARD_ID} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No addresses found for location`);
                return [];
            }
            return results.map(row => Address.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Create new address
     * @param {Address} address
     * @return {Promise<number>} insertId or -1 if failed
     * @memberof AddressDAO
     */
    async createAddress(address) {
        if (!(address instanceof Address)) {
            console.error('Error: address must be an instance of Address');
            return -1;
        }

        try {
            const data = {
                [dbSchema.ADDRESS_COLUMNS.ADDRESS_CITY_ID]: address.address_city_id,
                [dbSchema.ADDRESS_COLUMNS.ADDRESS_DISTRICT_ID]: address.address_district_id,
                [dbSchema.ADDRESS_COLUMNS.ADDRESS_WARD_ID]: address.address_ward_id,
                [dbSchema.ADDRESS_COLUMNS.ADDRESS_NUMBER]: address.address_number
            };

            const insertId = await this._protectedCreate(data);
            if (insertId <= 0) {
                console.error('Error: Failed to create address');
                return -1;
            }
            return insertId;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update address
     * @param {number} addressId
     * @param {Address} address
     * @return {Promise<number>} affected rows or -1 if failed
     * @memberof AddressDAO
     */
    async updateAddress(addressId, address) {
        if (addressId === null || addressId === undefined || !Number.isInteger(addressId)) {
            console.error('Error: addressId is invalid');
            return -1;
        }

        if (addressId <= 0) {
            console.error('Error: addressId must be greater than zero');
            return -1;
        }

        if (!(address instanceof Address)) {
            console.error('Error: address must be an instance of Address');
            return -1;
        }

        try {
            const data = {
                [dbSchema.ADDRESS_COLUMNS.ADDRESS_CITY_ID]: address.address_city_id,
                [dbSchema.ADDRESS_COLUMNS.ADDRESS_DISTRICT_ID]: address.address_district_id,
                [dbSchema.ADDRESS_COLUMNS.ADDRESS_WARD_ID]: address.address_ward_id,
                [dbSchema.ADDRESS_COLUMNS.ADDRESS_NUMBER]: address.address_number
            };

            const affectedRows = await this._protectedUpdateById(addressId, data);
            if (affectedRows <= 0) {
                console.warn(`Warning: No address updated for addressId ${addressId}`);
                return -1;
            }
            return affectedRows;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Delete address
     * @param {number} addressId
     * @return {Promise<number>} affected rows or -1 if failed
     * @memberof AddressDAO
     */
    async deleteAddress(addressId) {
        if (addressId === null || addressId === undefined || !Number.isInteger(addressId)) {
            console.error('Error: addressId is invalid');
            return -1;
        }

        if (addressId <= 0) {
            console.error('Error: addressId must be greater than zero');
            return -1;
        }

        try {
            const affectedRows = await this._protectedDeleteById(addressId);
            if (affectedRows <= 0) {
                console.warn(`Warning: No address deleted for addressId ${addressId}`);
                return -1;
            }
            return affectedRows;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }
}

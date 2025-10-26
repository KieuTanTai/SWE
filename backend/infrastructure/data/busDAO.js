import Bus from '../../models/Bus.js';
import BaseDAO from './baseDAO';
import dbSchema from './dbSchema';
import mySql from 'mysql2/promise';

class BusDAO extends BaseDAO {
    /**
     * Creates an instance of BusDAO.
     * @param {mySql.PoolConnection} connection
     * @memberof BusDAO
     */
    constructor(connection) {
        super(connection, 'Bus', dbSchema.BUS_COLUMNS.BUS_ID);
    }

    /**
     * Get all buses
     * @return {Promise<Bus[]>}
     * @memberof BusDAO
     */
    async getAllBuses() {
        try {
            const result = await this._protectedGetAll();
            if (!result || result.length === 0) {
                console.warn(`Warnings: no buses found`);
                return [];
            }
            return result.map(item => Bus.fromDatabase(item));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get bus by ID
     * @param {number} busId
     * @return {Promise<Bus>}
     * @memberof BusDAO
     */
    async getByBusId(busId) {
        if (busId === undefined || busId === null || !Number.isInteger(busId)) {
            console.warn(`Warning: busId is invalid: ${busId}`);
            return new Bus();
        }

        try {
            if (Number.parseInt(busId.toString()) <= 0) {
                console.warn(`Warning: busId must be greater than zero: ${busId}`);
                return new Bus();
            }

            const result = await this._protectedGetById(busId);
            if (!result) {
                console.warn(`Warning: No data found for busId ${busId}`);
                return new Bus();
            }
            return Bus.fromDatabase(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return new Bus();
        }
    }


    /**
     * get multiple buses by ids
     * @param {Number[]} busIds 
     * @returns {Promise<Bus[]>}
     * @memberof BusDAO
     */
    async getByBusIds(busIds) {
        if (!Array.isArray(busIds) || busIds.length === 0) {
            console.warn(`Warning: busIds must be a non-empty array`);
            return [];
        }

        try {
            const result = await this._protectedGetBySelection(
                ["*"], [busIds.join(",")],
                `WHERE ${dbSchema.BUS_ROUTE_COLUMNS.BUS_ROUTE_ID} IN (${busIds.map(() => "?").join(",")})`
            );
            if (!result || result.length === 0) {
                console.warn(`Warning: No buses found for busIds ${busIds}`);
                return [];
            }

            return result.map(item => Bus.fromDatabase(item));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get buses by bus status
     * @param {Boolean} busStatus 
     * @returns {Promise<Bus[]}
     * @memberof BusDAO
     */
    async getByBusStatus(busStatus) {
        if (busStatus === null || busStatus === undefined || typeof busStatus !== 'boolean') {
            console.warn(`Warning: Invalid busStatus: ${busStatus}`);
            return [];
        }

        try {
            const result = await this._protectedGetBySelection(
                ["*"], [busStatus],
                `WHERE ${dbSchema.BUS_COLUMNS.BUS_STATUS} = ?`
            );

            if (!result || result.length === 0) {
                console.warn(`Warning: No buses found for busStatus: ${busStatus}`);
                return [];
            }

            return result.map(item => Bus.fromDatabase(item));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get buses of bus brand
     * @param {String} busBrand 
     * @returns {Promise<Bus[]>}
     */
    async getByBusBrand(busBrand) {
        if (!busBrand || typeof busBrand !== 'string' || busBrand.trim() === '') {
            console.warn(`Warning: Invalid busBrand: ${busBrand}`);
            return [];
        }

        try {
            const result = await this._protectedGetBySelection(
                ["*"], [busBrand],
                `WHERE ${dbSchema.BUS_COLUMNS.BUS_BRAND} = ?`);
            if (!result || result.length === 0) {
                console.warn(`Warning: No account found for busBrand ${busBrand}`);
                return [];
            }
            return result.map(item => Bus.fromDatabase(item));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get buses of bus model
     * @param {String} busModel 
     * @returns {Promise<Bus[]>}
     */
    async getByBusModel(busModel) {
        if (!busModel || typeof busModel !== 'string' || busModel.trim() === '') {
            console.warn(`Warning: Invalid busBrand: ${busModel}`);
            return [];
        }

        try {
            const result = await this._protectedGetBySelection(
                ["*"], [busModel],
                `WHERE ${dbSchema.BUS_COLUMNS.BUS_MODEL} = ?`);
            if (!result || result.length === 0) {
                console.warn(`Warning: No account found for busModel ${busModel}`);
                return [];
            }
            return result.map(item => Bus.fromDatabase(item));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get bus by license plate
     * @param {string} busLicensePlate
     * @return {Promise<Bus>}
     * @memberof BusDAO
     */
    async getByLicensePlate(busLicensePlate) {
        if (!busLicensePlate || typeof busLicensePlate !== 'string' || busLicensePlate.trim() === '') {
            console.warn(`Warning: Invalid license plate: ${busLicensePlate}`);
            return new Bus();
        }

        try {
            const result = await this._protectedGetBySelection(
                ['*'],
                [busLicensePlate],
                `WHERE ${dbSchema.BUS_COLUMNS.BUS_LICENSE_PLATE} = ?`
            );
            if (!result) {
                console.warn(`Warning: No data found for busId ${busLicensePlate}`);
                return new Bus();
            }
            return Bus.fromDatabase(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return new Bus();
        }
    }

    /**
     * Create a new bus
     * @param {Bus} bus 
     * @return {Promise<number|string>}
     * @memberof BusDAO
     */
    async createBus(bus) {
        if (!(bus instanceof Bus)) {
            console.warn(`Warning: Invalid bus object`);
            return -1;
        }

        try {
            const result = await this._protectedCreate(bus);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Private method to update one bus information
     * @param {Bus} bus
     * @return {Promise<number>}
     * @memberof BusDAO
     */

    async updateBus(bus) {
        if (!bus || !(bus instanceof Bus)) {
            console.warn(`Warning: Invalid bus:${bus}`);
            return -1;
        }

        try {
            const result = await this._protectedUpdateById(bus.bus_id, bus);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Private method to update multiple buses 
     * @param {Bus[]} buses
     * @return {Promise<number>}
     * @memberof BusDAO
     */
    async updateBuses(buses) {
        if (!buses || !Array.isArray(buses) || buses.length === 0) {
            console.warn(`Warning: buses must be a non-empty array`);
            return -1;
        }

        try {
            const result = await this._protectedMultiUpdateById(buses);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Delete bus by ID
     * @param {Number} busId
     * @return {Promise<number>}
     * @memberof BusDAO
     */
    async deleteBus(busId) {
        if (busId === undefined || busId === null || !Number.isInteger(busId)) {
            console.warn(`Warning: Invalid Bus Id: ${busId}`)
            return -1;
        }

        try {
            const result = await this._protectedDeleteById(busId);
            return result;
        } catch (error) {
            console.warn(`Error: ${error.message}`);
            return -1;
        }
    }
}

export default BusDAO;
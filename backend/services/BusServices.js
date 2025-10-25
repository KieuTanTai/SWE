import withConnection from "../database/connection.js";
import BusDAO from "../dao/BusDAO.js";
import Bus from "../models/Bus.js";

class BusService {
    /** Get all buses */
    async getAllBuses() {
        try {
            const result = await withConnection(conn => new BusDAO(conn).getAllBuses());
            return { success: true, data: result };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    /** Get bus by ID */
    async getBusById(busId) {
        if (!Number.isInteger(busId) || busId <= 0)
            return { success: false, error: "Invalid busId" };

        try {
            const result = await withConnection(conn => new BusDAO(conn).getByBusId(busId));
            if (!result || result.bus_id === 0) return { success: false, error: "Bus not found" };
            return { success: true, data: result };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    /** Get multiple buses by IDs */
    async getBusesByIds(busIds) {
        if (!Array.isArray(busIds) || busIds.length === 0)
            return { success: false, error: "Invalid busIds array" };

        try {
            const result = await withConnection(conn => new BusDAO(conn).getByBusIds(busIds));
            return { success: true, data: result };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    /** Get buses by status */
    async getBusesByStatus(busStatus) {
        if (typeof busStatus !== "boolean")
            return { success: false, error: "Invalid busStatus" };

        try {
            const result = await withConnection(conn => new BusDAO(conn).getByBusStatus(busStatus));
            return { success: true, data: result };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    /** Get buses by brand */
    async getBusesByBrand(busBrand) {
        if (!busBrand || typeof busBrand !== "string" || busBrand.trim() === "")
            return { success: false, error: "Invalid busBrand" };

        try {
            const result = await withConnection(conn => new BusDAO(conn).getByBusBrand(busBrand));
            return { success: true, data: result };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    /** Create bus */
    async createBus(busData) {
        if (!(busData instanceof Bus))
            return { success: false, error: "Invalid Bus object" };

        try {
            const result = await withConnection(conn => new BusDAO(conn).createBus(busData));
            return { success: true, id: result };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    /** Update bus */
    async updateBus(busData) {
        if (!(busData instanceof Bus))
            return { success: false, error: "Invalid Bus object" };

        try {
            const result = await withConnection(conn => new BusDAO(conn).updateBus(busData));
            return { success: true, affectedRows: result };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    /** Delete bus */
    async deleteBus(busId) {
        if (!Number.isInteger(busId) || busId <= 0)
            return { success: false, error: "Invalid busId" };

        try {
            const result = await withConnection(conn => new BusDAO(conn).deleteBus(busId));
            return { success: true, affectedRows: result };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }
}

export default BusService;
import withConnection from "../database/connection.js";
import BusRouteDAO from "../dao/BusRouteDAO.js";
import BusRoute from "../models/BusRoute.js";

class BusRouteService {
    /** Get all bus routes */
    async getAllBusRoutes() {
        try {
            const result = await withConnection(conn => new BusRouteDAO(conn).getAllBusRoutes());
            return { success: true, data: result };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    /** Get bus route by ID */
    async getBusRouteById(busRouteId) {
        if (!busRouteId || !Number.isInteger(busRouteId) || busRouteId <= 0)
            return { success: false, error: "Invalid busRouteId" };

        try {
            const result = await withConnection(conn => new BusRouteDAO(conn).getByBusRouteId(busRouteId));
            if (!result || result.bus_route_id === 0) return { success: false, error: "No buses routes found" };
            return { success: true, data: result };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    /** Get multiple bus routes by IDs */
    async getBusRoutesByIds(busRouteIds) {
        if (!Array.isArray(busRouteIds) || busRouteIds.length === 0)
            return { success: false, error: "Invalid busRouteIds array" };

        try {
            const result = await withConnection(conn => new BusRouteDAO(conn).getByBusRouteIds(busRouteIds));
            if (!result || result.length === 0) return { success: false, error: "Buses not found" };
            return { success: true, data: result };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    /** Get bus routes by busId */
    async getBusRoutesByBusId(busId) {
        if (!Number.isInteger(busId) || busId <= 0)
            return { success: false, error: "Invalid busId" };

        try {
            const result = await withConnection(conn => new BusRouteDAO(conn).getByBusId(busId));
            if (!result || result.bus_route_id === 0) return { success: false, error: "No buses routes found" };
            return { success: true, data: result };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    /** Get bus routes by multiple busIds */
    async getBusRoutesByBusIds(busIds) {
        if (!Array.isArray(busIds) || busIds.length === 0)
            return { success: false, error: "Invalid busIds array" };

        try {
            const result = await withConnection(conn => new BusRouteDAO(conn).getByBusIds(busIds));
            return { success: true, data: result };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    /** Get bus routes by routeId */
    async getBusRoutesByRouteId(routeId) {
        if (!Number.isInteger(routeId) || routeId <= 0)
            return { success: false, error: "Invalid routeId" };

        try {
            const result = await withConnection(conn => new BusRouteDAO(conn).getByRouteId(routeId));
            if (!result || result.bus_route_id === 0) return { success: false, error: "No buses routes found" };
            return { success: true, data: result };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    /** Get bus routes by multiple routeIds */
    async getBusRoutesByRouteIds(routeIds) {
        if (!Array.isArray(routeIds) || routeIds.length === 0)
            return { success: false, error: "Invalid routeIds array" };

        try {
            const result = await withConnection(conn => new BusRouteDAO(conn).getByRouteIds(routeIds));
            return { success: true, data: result };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    /** Get bus routes by status */
    async getBusRoutesByStatus(busRouteStatus) {
        if (typeof busRouteStatus !== "boolean")
            return { success: false, error: "Invalid busRouteStatus" };

        try {
            const result = await withConnection(conn => new BusRouteDAO(conn).getByBusRouteStatus(busRouteStatus));
            return { success: true, data: result };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    /** Create new bus route */
    async createBusRoute(busRouteData) {
        if (!(busRouteData instanceof BusRoute))
            return { success: false, error: "Invalid BusRoute object" };

        try {
            const result = await withConnection(conn => new BusRouteDAO(conn).createBusRoute(busRouteData));
            return { success: true, id: result };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    /** Update bus for bus route 
     * @param 
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     * @memberof BusRouteServices
     */
    async updateBus(busRouteId, busId) {
        if(!busId || !Number.isInteger(busId) || busId <= 0) {
            return { success: false, error: "Invalid busId" };
        }
        if(!busRouteId || !Number.isInteger(busRouteId) || busRouteId <= 0) {
            return { success: false, error: "Invalid busRouteId" };
        }

        try {
            const result = await withConnection(conn => new BusRouteDAO(conn).updateBus(busRouteId, busId));
            if(result === -1) return { success: false, error: "Failed to update bus for bus route" };
            return { success: true, data: result };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    /** Update route for bus route 
     * @param 
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     * @memberof BusRouteServices
     */
    async updateRoute(busRouteId, routeId) {
        if(!routeId || !Number.isInteger(routeId)|| routeId <= 0) {
            return { success: false, error: "Invalid routeId" };
        }
        if(!busRouteId || !Number.isInteger(busRouteId) || busRouteId <= 0) {
            return { success: false, error: "Invalid busRouteId" };
        }

        try {
            const result = await withConnection(conn => new BusRouteDAO(conn).updateRoute(busRouteId, routeId));
            if(result === -1) return { success: false, error: "Failed to update route for bus route" };
            return { success: true, data: result };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    /** Delete bus route
     * @param {Number} busRouteId 
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     * @memberof BusRouteService
     */
    async deleteBusRoute(busRouteId) {
        if (!Number.isInteger(busRouteId) || busRouteId <= 0)
            return { success: false, error: "Invalid busRouteId" };

        try {
            const result = await withConnection(conn => new BusRouteDAO(conn).deleteBusRoute(busRouteId));
            return { success: true, data: result };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }
}

export default BusRouteService;

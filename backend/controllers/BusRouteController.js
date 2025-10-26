import express from "express";
import BusRouteServices from "../services/BusRouteServices.js";
import BusRoute from "../models/BusRoute.js";

const router = express.Router();

// GET /api/bus-routes - Get all bus routes
router.get("/", async (req, res) => {
    try {
        const service = new BusRouteServices();
        const result = await service.getAllBusRoutes();
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/bus-routes/:busRouteId - Get bus route by ID
router.get("/:busRouteId", async (req, res) => {
    try {
        const busRouteId = parseInt(req.params.busRouteId);
        const service = new BusRouteServices();
        const result = await service.getByBusRouteId(busRouteId);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/bus-routes/batch?ids=1,2,3 - Get bus routes by multiple IDs
router.get("/batch/ids", async (req, res) => {
    try {
        const ids = req.query.ids;
        if (!ids || typeof ids !== 'string') {
            return res.status(400).json({ error: "Query parameter 'ids' is required" });
        }
        
        const busRouteIds = ids.split(",").map(id => parseInt(id.trim()));
        const service = new BusRouteServices();
        const result = await service.getByBusRouteIds(busRouteIds);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/bus-routes/bus/:busId - Get bus routes by bus ID
router.get("/bus/:busId", async (req, res) => {
    try {
        const busId = parseInt(req.params.busId);
        const service = new BusRouteServices();
        const result = await service.getByBusId(busId);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/bus-routes/bus/batch?ids=1,2,3 - Get bus routes by multiple bus IDs
router.get("/bus/batch/ids", async (req, res) => {
    try {
        const ids = req.query.ids;
        if (!ids || typeof ids !== 'string') {
            return res.status(400).json({ error: "Query parameter 'ids' is required" });
        }
        
        const busIds = ids.split(",").map(id => parseInt(id.trim()));
        const service = new BusRouteServices();
        const result = await service.getByBusIds(busIds);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/bus-routes/route/:routeId - Get bus routes by route ID
router.get("/route/:routeId", async (req, res) => {
    try {
        const routeId = parseInt(req.params.routeId);
        const service = new BusRouteServices();
        const result = await service.getByRouteId(routeId);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/bus-routes/route/batch?ids=1,2,3 - Get bus routes by multiple route IDs
router.get("/route/batch/ids", async (req, res) => {
    try {
        const ids = req.query.ids;
        if (!ids || typeof ids !== 'string') {
            return res.status(400).json({ error: "Query parameter 'ids' is required" });
        }
        
        const routeIds = ids.split(",").map(id => parseInt(id.trim()));
        const service = new BusRouteServices();
        const result = await service.getByRouteIds(routeIds);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/bus-routes/status/:status - Get bus routes by status
router.get("/status/:status", async (req, res) => {
    try {
        const busRouteStatus = req.params.status === 'true';
        const service = new BusRouteServices();
        const result = await service.getByBusRouteStatus(busRouteStatus);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/bus-routes - Create single bus route
router.post("/", async (req, res) => {
    try {
        const { bus_id, route_id, bus_route_status } = req.body;
        if (!bus_id || !route_id) {
            return res.status(400).json({ error: "bus_id and route_id are required" });
        }

        const busRoute = new BusRoute({ bus_id, route_id, bus_route_status });
        const service = new BusRouteServices();
        const result = await service.createBusRoute(busRoute);
        result.success ? res.status(201).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/bus-routes/:busRouteId/status - Update bus route status
router.put("/:busRouteId/status", async (req, res) => {
    try {
        const busRouteId = parseInt(req.params.busRouteId);
        const { status } = req.body;
        
        if (typeof status !== 'boolean') {
            return res.status(400).json({ error: "status (boolean) is required" });
        }

        const service = new BusRouteServices();
        const result = await service.updateBusRouteStatus(busRouteId, status);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/bus-routes/bulk/statuses - Update multiple bus routes' status
router.put("/bulk/statuses", async (req, res) => {
    try {
        const { busRoutes } = req.body;
        if (!Array.isArray(busRoutes) || busRoutes.length === 0) {
            return res.status(400).json({ error: "busRoutes array is required and cannot be empty" });
        }

        const busRouteObjects = busRoutes.map(br => new BusRoute(br));
        const service = new BusRouteServices();
        const result = await service.updateBusRoutesStatus(busRouteObjects);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/bus-routes/:busRouteId - Delete bus route
router.delete("/:busRouteId", async (req, res) => {
    try {
        const busRouteId = parseInt(req.params.busRouteId);
        const service = new BusRouteServices();
        const result = await service.deleteBusRoute(busRouteId);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

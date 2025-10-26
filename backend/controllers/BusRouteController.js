import express from "express";
import BusRouteService from "../services/BusRouteService.js";

const router = express.Router();
const service = new BusRouteService();

// GET /api/bus-routes - Get all bus routes
router.get("/", async (req, res) => {
    try {
        const result = await service.getAllBusRoutes();
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/bus-routes/:busRouteId - Get bus route by ID
router.get("/:busRouteId", async (req, res) => {
    try {
        const busRouteId = parseInt(req.params.busRouteId);
        const result = await service.getBusRouteById(busRouteId);
        result.success ? res.status(200).json(result.data) : res.status(404).json({ error: result.error });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/bus-routes/multiple?ids=1,2,3 - Get multiple bus routes
router.get("/multiple", async (req, res) => {
    try {
        const ids = req.query.ids;
        if (!ids || typeof ids !== "string") return res.status(400).json({ error: "Query parameter 'ids' is required" });

        const busRouteIds = ids.split(",").map(id => parseInt(id.trim()));
        const result = await service.getBusRoutesByIds(busRouteIds);
        result.success ? res.status(200).json(result.data) : res.status(404).json({ error: result.error });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/bus-routes/:busRouteId/update-bus - Update bus for bus route
router.put("/:busRouteId/update-bus", async (req, res) => {
    try {
        const busRouteId = parseInt(req.params.busRouteId);
        const { busId } = req.body;
        const result = await service.updateBus(busRouteId, busId);
        result.success ? res.status(200).json({ updated: result.data }) : res.status(400).json({ error: result.error });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/bus-routes/:busRouteId/update-route - Update route for bus route
router.put("/:busRouteId/update-route", async (req, res) => {
    try {
        const busRouteId = parseInt(req.params.busRouteId);
        const { routeId } = req.body;
        const result = await service.updateRoute(busRouteId, routeId);
        result.success ? res.status(200).json({ updated: result.data }) : res.status(400).json({ error: result.error });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/bus-routes/:busRouteId - Delete bus route
router.delete("/:busRouteId", async (req, res) => {
    try {
        const busRouteId = parseInt(req.params.busRouteId);
        const result = await service.deleteBusRoute(busRouteId);
        result.success ? res.status(200).json({ deleted: result.data }) : res.status(400).json({ error: result.error });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

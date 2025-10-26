import express from "express";
import BusRouteService from "../services/BusRouteService.js";

const router = express.Router();
const service = new BusRouteService();

// GET /api/bus-routes - Lấy tất cả bus routes
router.get("/", async (req, res) => {
    try {
        const result = await service.getAllBusRoutes();
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/bus-routes/:busRouteId - Lấy bus route theo ID
router.get("/:busRouteId", async (req, res) => {
    try {
        const busRouteId = parseInt(req.params.busRouteId);
        const result = await service.getBusRouteById(busRouteId);
        result.success ? res.status(200).json(result.data) : res.status(404).json({ error: result.error });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/bus-routes/multiple?ids=1,2,3 - Lấy nhiều bus routes
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

// PUT /api/bus-routes/:busRouteId/update-bus - Cập nhật bus cho bus route
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

// PUT /api/bus-routes/:busRouteId/update-route - Cập nhật route cho bus route
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

// POST /api/bus-routes - Tạo bus route mới
router.post("/", async (req, res) => {
    try {
        const busRouteData = req.body;
        const busRoute = new (require("../models/BusRoute.js").default)(busRouteData);

        const result = await service.createBusRoute(busRoute);
        result.success ? res.status(201).json({ id: result.id }) : res.status(400).json({ error: result.error });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/bus-routes/:busRouteId - Xóa bus route
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

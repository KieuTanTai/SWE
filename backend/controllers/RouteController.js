import express from "express";
import RouteService from "../services/RouteServices.js";
import Route from "../models/Route.js";

const router = express.Router();

// GET /api/routes - Get all routes
router.get("/", async (req, res) => {
    try {
        const service = new RouteService();
        const result = await service.getAllRoutes();
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/routes/:routeId - Get route by ID
router.get("/:routeId", async (req, res) => {
    try {
        const routeId = parseInt(req.params.routeId);
        const service = new RouteService();
        const result = await service.getByRouteId(routeId);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/routes/batch?ids=1,2,3 - Get routes by multiple IDs
router.get("/batch/ids", async (req, res) => {
    try {
        const ids = req.query.ids;
        if (!ids || typeof ids !== 'string') {
            return res.status(400).json({ error: "Query parameter 'ids' is required" });
        }
        
        const routeIds = ids.split(",").map(id => parseInt(id.trim()));
        const service = new RouteService();
        const result = await service.getByRouteIds(routeIds);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/routes/name/:routeName - Get route by name
router.get("/name/:routeName", async (req, res) => {
    try {
        const { routeName } = req.params;
        const service = new RouteService();
        const result = await service.getByRouteName(routeName);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/routes/search?pattern=... - Get routes with name like pattern
router.get("/search/pattern", async (req, res) => {
    try {
        const pattern = req.query.pattern;
        if (!pattern || typeof pattern !== 'string') {
            return res.status(400).json({ error: "Query parameter 'pattern' is required" });
        }
        
        const service = new RouteService();
        const result = await service.getLikeRouteName(pattern);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/routes/status/:status - Get routes by status
router.get("/status/:status", async (req, res) => {
    try {
        const routeStatus = req.params.status === 'true';
        const service = new RouteService();
        const result = await service.getByRouteStatus(routeStatus);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/routes - Create single route
router.post("/", async (req, res) => {
    try {
        const { route_name, route_status } = req.body;
        if (!route_name) {
            return res.status(400).json({ error: "route_name is required" });
        }

        const route = new Route({ route_name, route_status });
        const service = new RouteService();
        const result = await service.createRoute(route);
        result.success ? res.status(201).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/routes/bulk - Create multiple routes
router.post("/bulk", async (req, res) => {
    try {
        const { routes } = req.body;
        if (!Array.isArray(routes) || routes.length === 0) {
            return res.status(400).json({ error: "routes array is required and cannot be empty" });
        }

        const routeObjects = routes.map(r => new Route(r));
        const service = new RouteService();
        const result = await service.createRoutes(routeObjects);
        result.success ? res.status(201).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/routes/:routeId/name - Update route name
router.put("/:routeId/name", async (req, res) => {
    try {
        const routeId = parseInt(req.params.routeId);
        const { route_name } = req.body;
        
        if (!route_name) {
            return res.status(400).json({ error: "route_name is required" });
        }

        const service = new RouteService();
        const result = await service.updateRouteName(routeId, route_name);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/routes/:routeId/status - Update route status
router.put("/:routeId/status", async (req, res) => {
    try {
        const routeId = parseInt(req.params.routeId);
        const { route_status } = req.body;
        
        if (typeof route_status !== 'boolean') {
            return res.status(400).json({ error: "route_status (boolean) is required" });
        }

        const service = new RouteService();
        const result = await service.updateRouteStatus(routeId, route_status);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/routes/bulk/names - Update names of multiple routes
router.put("/bulk/names", async (req, res) => {
    try {
        const { routes } = req.body;
        if (!Array.isArray(routes) || routes.length === 0) {
            return res.status(400).json({ error: "routes array is required and cannot be empty" });
        }

        const service = new RouteService();
        const result = await service.updateRouteNames(routes);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/routes/bulk/statuses - Update statuses of multiple routes
router.put("/bulk/statuses", async (req, res) => {
    try {
        const { routes } = req.body;
        if (!Array.isArray(routes) || routes.length === 0) {
            return res.status(400).json({ error: "routes array is required and cannot be empty" });
        }

        const service = new RouteService();
        const result = await service.updateRouteStatuses(routes);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

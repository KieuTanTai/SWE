import express from "express";
import Connection from "../infrastructure/connection/getConnection.js";
import RouteDAO from "../infrastructure/data/routeDAO.js";
import RouteService from "../services/RouteService.js";

const router = express.Router();

/**
 * Initialize service with database connection
 * @returns {Promise<RouteService>}
 */
async function initService() {
    const conn = new Connection('./config.json');
    const pool = await conn.connect();
    const connection = await pool.getConnection();
    const routeDAO = new RouteDAO(connection);
    return new RouteService(routeDAO);
}

/**
 * GET /api/routes
 * Get all routes
 */
router.get('/', async (req, res) => {
    try {
        const service = await initService();
        const result = await service.getAllRoutes();
        
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in GET /routes:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/routes/:id
 * Get route by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const routeId = parseInt(req.params.id);
        if (isNaN(routeId)) {
            return res.status(400).json({ error: 'Invalid route ID' });
        }

        const service = await initService();
        const result = await service.getByRouteId(routeId);
        
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(404).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in GET /routes/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/routes/name/:name
 * Get route by name
 */
router.get('/name/:name', async (req, res) => {
    try {
        const routeName = String(req.params.name);
        if (!routeName || routeName.trim() === '') {
            return res.status(400).json({ error: 'Route name is required' });
        }

        const service = await initService();
        const result = await service.getByRouteName(routeName);
        
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(404).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in GET /routes/name/:name:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/routes/name/search
 * Search routes by partial name
 */
router.get('/name/search', async (req, res) => {
    try {
        const pattern = String(req.query.pattern || '');
        if (!pattern || pattern.trim() === '') {
            return res.status(400).json({ error: 'Search pattern is required' });
        }

        const service = await initService();
        const result = await service.getLikeRouteName(pattern);
        
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in GET /routes/name/search:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/routes/status/:status
 * Get routes by status (true/false)
 */
router.get('/status/:status', async (req, res) => {
    try {
        const status = req.params.status === 'true';
        
        const service = await initService();
        const result = await service.getByRouteStatus(status);
        
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in GET /routes/status/:status:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/routes
 * Create a new route
 */
router.post('/', async (req, res) => {
    try {
        const routeData = req.body;
        if (!routeData.route_name) {
            return res.status(400).json({ error: 'Route name is required' });
        }

        const service = await initService();
        const result = await service.createRoute(routeData);
        
        if (result.success) {
            res.status(201).json(result.data);
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in POST /routes:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/routes/bulk
 * Create multiple routes
 */
router.post('/bulk', async (req, res) => {
    try {
        const routes = req.body;
        if (!Array.isArray(routes) || routes.length === 0) {
            return res.status(400).json({ error: 'Array of routes is required' });
        }

        const service = await initService();
        const result = await service.createRoutes(routes);
        
        if (result.success) {
            res.status(201).json(result.data);
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in POST /routes/bulk:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * PATCH /api/routes/:id/name
 * Update route name
 */
router.patch('/:id/name', async (req, res) => {
    try {
        const routeId = parseInt(req.params.id);
        const { name } = req.body;
        
        if (isNaN(routeId)) {
            return res.status(400).json({ error: 'Invalid route ID' });
        }
        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Route name is required' });
        }

        const service = await initService();
        const result = await service.updateRouteName(routeId, name);
        
        if (result.success) {
            res.status(200).json({ message: 'Route name updated successfully' });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in PATCH /routes/:id/name:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * PATCH /api/routes/:id/status
 * Update route status (boolean)
 */
router.patch('/:id/status', async (req, res) => {
    try {
        const routeId = parseInt(req.params.id);
        const { status } = req.body;
        
        if (isNaN(routeId)) {
            return res.status(400).json({ error: 'Invalid route ID' });
        }
        if (typeof status !== 'boolean') {
            return res.status(400).json({ error: 'Route status must be a boolean' });
        }

        const service = await initService();
        const result = await service.updateRouteStatus(routeId, status);
        
        if (result.success) {
            res.status(200).json({ message: 'Route status updated successfully' });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in PATCH /routes/:id/status:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * PATCH /api/routes/batch/name
 * Batch update route names
 */
router.patch('/batch/name', async (req, res) => {
    try {
        const routes = req.body;
        if (!Array.isArray(routes) || routes.length === 0) {
            return res.status(400).json({ error: 'Array of routes is required' });
        }

        const service = await initService();
        const result = await service.updateRouteNames(routes);
        
        if (result.success) {
            res.status(200).json({ message: 'Route names updated successfully' });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in PATCH /routes/batch/name:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * PATCH /api/routes/batch/status
 * Batch update route statuses
 */
router.patch('/batch/status', async (req, res) => {
    try {
        const routes = req.body;
        if (!Array.isArray(routes) || routes.length === 0) {
            return res.status(400).json({ error: 'Array of routes is required' });
        }

        const service = await initService();
        const result = await service.updateRouteStatuses(routes);
        
        if (result.success) {
            res.status(200).json({ message: 'Route statuses updated successfully' });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in PATCH /routes/batch/status:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
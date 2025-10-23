import express from "express";
import DetailRouteService from "../services/DetailRouteService.js";
import { DetailRoute } from "../models/index.js";

const router = express.Router();

/**
 * GET /api/detail-routes
 * Get all detail routes
 */
router.get('/', async (req, res) => {
    try {
        const service = new DetailRouteService();
        const result = await service.getAllDetailRoutes();
        
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in GET /detail-routes:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/detail-routes/:id
 * Get detail route by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const detailRouteId = parseInt(req.params.id);
        if (isNaN(detailRouteId)) {
            return res.status(400).json({ error: 'Invalid detail route ID' });
        }

        const service = new DetailRouteService();
        const result = await service.getByDetailRouteId(detailRouteId);
        
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(404).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in GET /detail-routes/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/detail-routes/route/:routeId
 * Get detail routes by route ID
 */
router.get('/route/:routeId', async (req, res) => {
    try {
        const routeId = parseInt(req.params.routeId);
        if (isNaN(routeId)) {
            return res.status(400).json({ error: 'Invalid route ID' });
        }

        const service = new DetailRouteService();
        const result = await service.getByRouteId(routeId);
        
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(404).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in GET /detail-routes/route/:routeId:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/detail-routes/start-point/:startPointId
 * Get detail routes by start point ID
 */
router.get('/start-point/:startPointId', async (req, res) => {
    try {
        const startPointId = parseInt(req.params.startPointId);
        if (isNaN(startPointId)) {
            return res.status(400).json({ error: 'Invalid start point ID' });
        }

        const service = new DetailRouteService();
        const result = await service.getByRouteStartPointId(startPointId);
        
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(404).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in GET /detail-routes/start-point/:startPointId:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/detail-routes/end-point/:endPointId
 * Get detail routes by end point ID
 */
router.get('/end-point/:endPointId', async (req, res) => {
    try {
        const endPointId = parseInt(req.params.endPointId);
        if (isNaN(endPointId)) {
            return res.status(400).json({ error: 'Invalid end point ID' });
        }

        const service = new DetailRouteService();
        const result = await service.getByRouteEndPointId(endPointId);
        
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(404).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in GET /detail-routes/end-point/:endPointId:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/detail-routes/distance/:distance
 * Get detail routes by distance
 */
router.get('/distance/:distance', async (req, res) => {
    try {
        const distance = parseFloat(req.params.distance);
        if (isNaN(distance)) {
            return res.status(400).json({ error: 'Invalid distance' });
        }

        const service = new DetailRouteService();
        const result = await service.getByDetailRouteDistance(distance);
        
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(404).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in GET /detail-routes/distance/:distance:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/detail-routes
 * Create a new detail route
 * Body: { detail_route_id, route_id, detail_route_start_point_id, detail_route_end_point_id, detail_route_distance }
 */
router.post('/', async (req, res) => {
    try {
        const {
            detail_route_id,
            route_id,
            detail_route_start_point_id,
            detail_route_end_point_id,
            detail_route_distance
        } = req.body;

        // Create DetailRoute instance
        const detailRoute = new DetailRoute({
            detail_route_id,
            route_id,
            detail_route_start_point_id,
            detail_route_end_point_id,
            detail_route_distance
        });

        const service = new DetailRouteService();
        const result = await service.createDetailRoute(detailRoute);
        
        if (result.success) {
            res.status(201).json({
                message: 'Detail route created successfully',
                data: result.data
            });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in POST /detail-routes:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/detail-routes/bulk
 * Create multiple detail routes
 * Body: [{ detail_route_id, route_id, detail_route_start_point_id, detail_route_end_point_id, detail_route_distance }, ...]
 */
router.post('/bulk', async (req, res) => {
    try {
        const detailRoutesData = req.body;

        if (!Array.isArray(detailRoutesData) || detailRoutesData.length === 0) {
            return res.status(400).json({ error: 'Request body must be a non-empty array' });
        }

        // Create DetailRoute instances
        const detailRoutes = detailRoutesData.map(data => new DetailRoute({
            detail_route_id: data.detail_route_id,
            route_id: data.route_id,
            detail_route_start_point_id: data.detail_route_start_point_id,
            detail_route_end_point_id: data.detail_route_end_point_id,
            detail_route_distance: data.detail_route_distance
        }));

        const service = new DetailRouteService();
        const result = await service.createDetailRoutes(detailRoutes);
        
        if (result.success) {
            res.status(201).json({
                message: 'Detail routes created successfully',
                data: result.data
            });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in POST /detail-routes/bulk:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * PUT /api/detail-routes/:id/distance
 * Update detail route distance
 * Body: { distance }
 */
router.put('/:id/distance', async (req, res) => {
    try {
        const detailRouteId = parseInt(req.params.id);
        const { distance } = req.body;

        if (isNaN(detailRouteId)) {
            return res.status(400).json({ error: 'Invalid detail route ID' });
        }

        if (typeof distance !== 'number' || isNaN(distance)) {
            return res.status(400).json({ error: 'Invalid distance value' });
        }

        const service = new DetailRouteService();
        const result = await service.updateDistance(detailRouteId, distance);
        
        if (result.success) {
            res.status(200).json({
                message: 'Distance updated successfully',
                data: result.data
            });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in PUT /detail-routes/:id/distance:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * PUT /api/detail-routes/distances
 * Update distances of multiple detail routes
 * Body: [{ detail_route_id, detail_route_distance }, ...]
 */
router.put('/distances', async (req, res) => {
    try {
        const detailRoutesData = req.body;

        if (!Array.isArray(detailRoutesData) || detailRoutesData.length === 0) {
            return res.status(400).json({ error: 'Request body must be a non-empty array' });
        }

        const service = new DetailRouteService();
        const result = await service.updateDistances(detailRoutesData);
        
        if (result.success) {
            res.status(200).json({
                message: 'Distances updated successfully',
                data: result.data
            });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in PUT /detail-routes/distances:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * PUT /api/detail-routes/:id/start-point
 * Update detail route start point ID
 * Body: { start_point_id }
 */
router.put('/:id/start-point', async (req, res) => {
    try {
        const detailRouteId = parseInt(req.params.id);
        const { start_point_id } = req.body;

        if (isNaN(detailRouteId)) {
            return res.status(400).json({ error: 'Invalid detail route ID' });
        }

        if (!start_point_id || isNaN(parseInt(start_point_id))) {
            return res.status(400).json({ error: 'Invalid start point ID' });
        }

        const service = new DetailRouteService();
        const result = await service.updateStartPointId(detailRouteId, parseInt(start_point_id));
        
        if (result.success) {
            res.status(200).json({
                message: 'Start point ID updated successfully',
                data: result.data
            });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in PUT /detail-routes/:id/start-point:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * PUT /api/detail-routes/start-points
 * Update start point IDs of multiple detail routes
 * Body: [{ detail_route_id, detail_route_start_point_id }, ...]
 */
router.put('/start-points', async (req, res) => {
    try {
        const detailRoutesData = req.body;

        if (!Array.isArray(detailRoutesData) || detailRoutesData.length === 0) {
            return res.status(400).json({ error: 'Request body must be a non-empty array' });
        }

        const service = new DetailRouteService();
        const result = await service.updateStartPointIds(detailRoutesData);
        
        if (result.success) {
            res.status(200).json({
                message: 'Start point IDs updated successfully',
                data: result.data
            });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in PUT /detail-routes/start-points:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * PUT /api/detail-routes/:id/end-point
 * Update detail route end point ID
 * Body: { end_point_id }
 */
router.put('/:id/end-point', async (req, res) => {
    try {
        const detailRouteId = parseInt(req.params.id);
        const { end_point_id } = req.body;

        if (isNaN(detailRouteId)) {
            return res.status(400).json({ error: 'Invalid detail route ID' });
        }

        if (!end_point_id || isNaN(parseInt(end_point_id))) {
            return res.status(400).json({ error: 'Invalid end point ID' });
        }

        const service = new DetailRouteService();
        const result = await service.updateEndPointId(detailRouteId, parseInt(end_point_id));
        
        if (result.success) {
            res.status(200).json({
                message: 'End point ID updated successfully',
                data: result.data
            });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in PUT /detail-routes/:id/end-point:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * PUT /api/detail-routes/end-points
 * Update end point IDs of multiple detail routes
 * Body: [{ detail_route_id, detail_route_end_point_id }, ...]
 */
router.put('/end-points', async (req, res) => {
    try {
        const detailRoutesData = req.body;

        if (!Array.isArray(detailRoutesData) || detailRoutesData.length === 0) {
            return res.status(400).json({ error: 'Request body must be a non-empty array' });
        }

        const service = new DetailRouteService();
        const result = await service.updateEndPointIds(detailRoutesData);
        
        if (result.success) {
            res.status(200).json({
                message: 'End point IDs updated successfully',
                data: result.data
            });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in PUT /detail-routes/end-points:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/detail-routes/:id
 * Delete detail route by ID
 */
router.delete('/:id', async (req, res) => {
    try {
        const detailRouteId = parseInt(req.params.id);
        
        if (isNaN(detailRouteId)) {
            return res.status(400).json({ error: 'Invalid detail route ID' });
        }

        const service = new DetailRouteService();
        const result = await service.deleteDetailRoute(detailRouteId);
        
        if (result.success) {
            res.status(200).json({
                message: 'Detail route deleted successfully',
                data: result.data
            });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in DELETE /detail-routes/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/detail-routes
 * Delete multiple detail routes by IDs
 * Body: { ids: [id1, id2, ...] }
 */
router.delete('/', async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: 'ids must be a non-empty array' });
        }

        const detailRouteIds = ids.map(id => parseInt(id)).filter(id => !isNaN(id));
        
        if (detailRouteIds.length === 0) {
            return res.status(400).json({ error: 'No valid detail route IDs provided' });
        }

        const service = new DetailRouteService();
        const result = await service.deleteDetailRoutes(detailRouteIds);
        
        if (result.success) {
            res.status(200).json({
                message: 'Detail routes deleted successfully',
                data: result.data
            });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in DELETE /detail-routes:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;

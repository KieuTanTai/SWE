import express from "express";
import DetailRouteService from "../services/DetailRouteServices.js";
import DetailRoute from "../models/DetailRoute.js";
import AddressServices from "../services/AddressServices.js";

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
 * GET /api/detail-routes/details
 * Get detail routes by multiple route IDs
 * @param {number[]} routeIds - Query parameter: ?routeIds=1,2,3
 * @return {Promise<BusRouteDetailInfoVO[]>}
 */
router.get('/details', async (req, res) => {
    try {
        const service = new DetailRouteService();
        let routeIds = req.query.routeIds;
        if (!routeIds) {
            return res.status(400).json({ error: "Query parameter 'routeIds' is required" });
        }
        // this already array before use this endpoint
        if (typeof routeIds === 'string') {
            routeIds = routeIds.split(",").map(id => id.trim());
        }
        if (!Array.isArray(routeIds) || routeIds.length === 0) {
            return res.status(400).json({ error: "Query parameter 'routeIds' must be a non-empty array or comma-separated string" });
        }
        // Convert to number array for service usage
        const routeIdsNum = Array.isArray(routeIds) ? routeIds : [routeIds];
        const routeIdsNumParsed = routeIdsNum
            .map(id => parseInt(typeof id === 'string' ? id : String(id)))
            .filter(id => !isNaN(id));
        if (routeIdsNumParsed.length === 0) {
            return res.status(400).json({ error: "No valid route IDs provided" });
        }
        const result = await service.getBusRouteDetails(routeIdsNumParsed);
        if (result.success) {
            const valueObjects = await optimizeDetailRouteInfoVOs(result);
            // Log value objects
            console.log('Optimized result:', JSON.stringify(valueObjects, null, 2));
            res.status(200).json(valueObjects);
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in GET /detail-routes/details:', error);
        res.status(500).json({ error: error.message });
    }
});

async function hereGeocode(address, hereKey) {
    const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}&apiKey=${hereKey}`;
    const resp = await fetch(url);
    const data = await resp.json();
    if (Array.isArray(data.items) && data.items.length > 0) {
        return data.items[0].position; // {lat, lng}
    }
    return null;
}

router.get('/geocode-here', async (req, res) => {
    const hereKey = process.env.NEXT_PUBLIC_HERE_KEY;
    if (!hereKey) {
        return res.status(500).json({ error: 'Thiếu NEXT_PUBLIC_HERE_KEY ở backend.' });
    }

    const address = req.query.address;
    if (!address || typeof address !== 'string') {
        return res.status(400).json({ error: 'Thiếu hoặc sai kiểu tham số address.' });
    }

    const position = await hereGeocode(address, hereKey);
    if (!position) {
        return res.status(404).json({ error: 'Không thể geocode địa chỉ.' });
    }

    // Lấy route cho cùng địa chỉ (có thể truyền thêm các điểm qua query nếu muốn đi qua nhiều điểm)
    let routeUrl = `https://router.hereapi.com/v8/routes?origin=${position.lat},${position.lng}&destination=${position.lat},${position.lng}&transportMode=car&return=polyline,summary&apikey=${hereKey}`;
    const routeResp = await fetch(routeUrl);
    const routeData = await routeResp.json();

    let polyline = null;
    if (Array.isArray(routeData.routes) && routeData.routes.length > 0) {
        const secs = routeData.routes[0].sections;
        if (secs && secs[0].polyline) polyline = secs[0].polyline;
    }

    return res.status(200).json({
        position,
        polyline
    });
});

// Hàm lấy route từ HERE Routing API
async function getHereRoute(stops, key) {
    if (!Array.isArray(stops) || stops.length < 2) {
        throw new Error("Cần ít nhất 2 điểm để lấy route.");
    }

    const origin = `${stops[0].lat},${stops[0].lng}`;
    const destination = `${stops[stops.length - 1].lat},${stops[stops.length - 1].lng}`;
    let url = `https://router.hereapi.com/v8/routes?origin=${origin}&destination=${destination}&transportMode=car&return=polyline,summary&apikey=${key}`;

    if (stops.length > 2) {
        for (let i = 1; i < stops.length - 1; i++) {
            url += `&via=${stops[i].lat},${stops[i].lng}`;
        }
    }

    console.log("Gọi trực tiếp HERE Routing API với url:", url);

    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Không gọi được HERE: ${resp.statusText}`);
    const data = await resp.json();

    console.log("Response từ HERE Routing API:", data);

    return data;
}

router.post('/route-here', async (req, res) => {
    const hereKey = process.env.NEXT_PUBLIC_HERE_KEY;
    if (!hereKey) {
        console.log('Thiếu NEXT_PUBLIC_HERE_KEY ở backend!');
        return res.status(500).json({ error: 'Thiếu NEXT_PUBLIC_HERE_KEY ở backend.' });
    }

    const stops = req.body.stops;
    if (!Array.isArray(stops) || stops.length < 2) {
        console.log('Dữ liệu stops truyền lên không hợp lệ:', stops);
        return res.status(400).json({ error: 'Phải truyền mảng ít nhất 2 điểm stops.' });
    }

    try {
        const data = await getHereRoute(stops, hereKey);
        return res.status(200).json(data);
    } catch (err) {
        console.log("Lỗi khi gọi HERE Routing API:", err);
        return res.status(500).json({ error: err.message || 'Lỗi không xác định.' });
    }
});

async function optimizeDetailRouteInfoVOs(result) { 
    try {
        const addressService = new AddressServices();
            // For each busRoute, get the names of all detail routes (start -> end)
            return await Promise.all(result.data.map(async (busRoute) => {
                const detailRoutes = busRoute.route?.detailRoutes || [];
                // Get all start and end point ids for this route
                const startIds = detailRoutes.map(dr => dr.detail_route_start_point_id);
                const endIds = detailRoutes.map(dr => dr.detail_route_end_point_id);
                // Get address names in bulk
                const startNamesRes = await addressService.getStringNameAddressByIds(startIds);
                const endNamesRes = await addressService.getStringNameAddressByIds(endIds);
                const startNames = startNamesRes.data || [];
                const endNames = endNamesRes.data || [];
                // Compose array of detail route info objects
                const detailRouteInfos = detailRoutes.map((dr, idx) => ({
                    detail_route_id: dr.detail_route_id,
                    start_name: startNames[idx] || "",
                    end_name: endNames[idx] || ""
                }));
                return {
                    bus_route_id: busRoute.bus_route_id,
                    route_id: busRoute.route?.route_id,
                    route_name: busRoute.route?.route_name,
                    detail_routes: detailRouteInfos
                };
            }));
    } catch (ex) {
        if (ex instanceof Error)
            console.error('Error optimizing DetailRouteInfoVOs:', ex.message);
    }
}


/**
 * GET /api/detail-routes/:id
 * @returns {Promise<BusRoute>}
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

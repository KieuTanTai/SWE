import express from 'express';
import DriverService from '../services/DriverService.js';
import DriverDAO from '../infrastructure/data/driverDAO.js';
import Connection from '../infrastructure/connection/getConnection.js';
import { Driver } from '../models/index.js';

const router = express.Router();

/**
 * Initialize service with connection
 */
const initService = async () => {
    const connectionManager = new Connection('./config.json');
    const pool = await connectionManager.connect();
    const connection = await pool.getConnection();
    const driverDAO = new DriverDAO(connection);
    return new DriverService(driverDAO);
};

/**
 * GET /api/drivers
 * Get all drivers
 */
router.get('/', async (req, res) => {
    try {
        const service = await initService();
        const result = await service.getAllDrivers();
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in GET /api/drivers:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/drivers/:id
 * Get driver by person ID
 */
router.get('/:id', async (req, res) => {
    try {
        const driverPersonId = parseInt(req.params.id);
        
        if (isNaN(driverPersonId)) {
            return res.status(400).json({ success: false, error: 'Invalid driver person ID' });
        }
        
        const service = await initService();
        const result = await service.getByDriverPersonId(driverPersonId);
        
        if (!result.success) {
            return res.status(404).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in GET /api/drivers/:id:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/drivers/experience/type/:type
 * Get drivers by experience type
 */
router.get('/experience/type/:type', async (req, res) => {
    try {
        const experienceType = req.params.type;
        
        const service = await initService();
        const result = await service.getByExperienceType(experienceType);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in GET /api/drivers/experience/type/:type:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/drivers/experience/min/:min
 * Get drivers with minimum experience
 */
router.get('/experience/min/:min', async (req, res) => {
    try {
        const minExperience = parseInt(req.params.min);
        
        if (isNaN(minExperience)) {
            return res.status(400).json({ success: false, error: 'Invalid minimum experience' });
        }
        
        const service = await initService();
        const result = await service.getByMinExperience(minExperience);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in GET /api/drivers/experience/min/:min:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/drivers/late/max/:max
 * Get drivers with maximum late arrival count
 */
router.get('/late/max/:max', async (req, res) => {
    try {
        const maxLateCount = parseInt(req.params.max);
        
        if (isNaN(maxLateCount)) {
            return res.status(400).json({ success: false, error: 'Invalid maximum late count' });
        }
        
        const service = await initService();
        const result = await service.getByMaxLateArrivalCount(maxLateCount);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in GET /api/drivers/late/max/:max:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/drivers
 * Create a new driver
 */
router.post('/', async (req, res) => {
    try {
        const driver = new Driver(req.body);
        
        const service = await initService();
        const result = await service.createDriver(driver);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.status(201).json(result);
    } catch (error) {
        console.error('Error in POST /api/drivers:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/drivers/bulk
 * Create multiple drivers
 */
router.post('/bulk', async (req, res) => {
    try {
        const driversData = req.body;
        
        if (!Array.isArray(driversData)) {
            return res.status(400).json({ success: false, error: 'Request body must be an array' });
        }
        
        const drivers = driversData.map(data => new Driver(data));
        
        const service = await initService();
        const result = await service.createDrivers(drivers);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.status(201).json(result);
    } catch (error) {
        console.error('Error in POST /api/drivers/bulk:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * PATCH /api/drivers/:id/experience
 * Update driver's experience
 */
router.patch('/:id/experience', async (req, res) => {
    try {
        const driverPersonId = parseInt(req.params.id);
        const { experience, experienceType } = req.body;
        
        if (isNaN(driverPersonId)) {
            return res.status(400).json({ success: false, error: 'Invalid driver person ID' });
        }
        
        const service = await initService();
        const result = await service.updateExperience(driverPersonId, experience, experienceType);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in PATCH /api/drivers/:id/experience:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * PATCH /api/drivers/:id/late-count
 * Update driver's late arrival count
 */
router.patch('/:id/late-count', async (req, res) => {
    try {
        const driverPersonId = parseInt(req.params.id);
        const { lateCount } = req.body;
        
        if (isNaN(driverPersonId)) {
            return res.status(400).json({ success: false, error: 'Invalid driver person ID' });
        }
        
        const service = await initService();
        const result = await service.updateLateArrivalCount(driverPersonId, lateCount);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in PATCH /api/drivers/:id/late-count:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * PATCH /api/drivers/:id/increment-late
 * Increment driver's late arrival count by 1
 */
router.patch('/:id/increment-late', async (req, res) => {
    try {
        const driverPersonId = parseInt(req.params.id);
        
        if (isNaN(driverPersonId)) {
            return res.status(400).json({ success: false, error: 'Invalid driver person ID' });
        }
        
        const service = await initService();
        const result = await service.incrementLateArrivalCount(driverPersonId);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in PATCH /api/drivers/:id/increment-late:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * PATCH /api/drivers/batch/experience
 * Batch update driver experiences
 */
router.patch('/batch/experience', async (req, res) => {
    try {
        const drivers = req.body;
        
        if (!Array.isArray(drivers)) {
            return res.status(400).json({ success: false, error: 'Request body must be an array' });
        }
        
        const service = await initService();
        const result = await service.updateExperiences(drivers);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in PATCH /api/drivers/batch/experience:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * PATCH /api/drivers/batch/late-count
 * Batch update driver late arrival counts
 */
router.patch('/batch/late-count', async (req, res) => {
    try {
        const drivers = req.body;
        
        if (!Array.isArray(drivers)) {
            return res.status(400).json({ success: false, error: 'Request body must be an array' });
        }
        
        const service = await initService();
        const result = await service.updateLateArrivalCounts(drivers);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in PATCH /api/drivers/batch/late-count:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * DELETE /api/drivers/:id
 * Delete driver by person ID
 */
router.delete('/:id', async (req, res) => {
    try {
        const driverPersonId = parseInt(req.params.id);
        
        if (isNaN(driverPersonId)) {
            return res.status(400).json({ success: false, error: 'Invalid driver person ID' });
        }
        
        const service = await initService();
        const result = await service.deleteDriver(driverPersonId);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in DELETE /api/drivers/:id:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * DELETE /api/drivers/bulk
 * Delete multiple drivers
 */
router.delete('/bulk', async (req, res) => {
    try {
        const { driverPersonIds } = req.body;
        
        if (!Array.isArray(driverPersonIds)) {
            return res.status(400).json({ success: false, error: 'driverPersonIds must be an array' });
        }
        
        const service = await initService();
        const result = await service.deleteDrivers(driverPersonIds);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in DELETE /api/drivers/bulk:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;

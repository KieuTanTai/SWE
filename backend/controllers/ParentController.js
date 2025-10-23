import express from 'express';
import ParentService from '../services/ParentService.js';
import ParentDAO from '../infrastructure/data/parentDAO.js';
import Connection from '../infrastructure/connection/getConnection.js';
import { Parent } from '../models/index.js';

const router = express.Router();

/**
 * Initialize service with connection
 */
const initService = async () => {
    const connectionManager = new Connection('./config.json');
    const pool = await connectionManager.connect();
    const connection = await pool.getConnection();
    const parentDAO = new ParentDAO(connection);
    return new ParentService(parentDAO);
};

/**
 * GET /api/parents
 * Get all parents
 */
router.get('/', async (req, res) => {
    try {
        const service = await initService();
        const result = await service.getAllParents();
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in GET /api/parents:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/parents/:id
 * Get parent by person ID
 */
router.get('/:id', async (req, res) => {
    try {
        const parentPersonId = parseInt(req.params.id);
        
        if (isNaN(parentPersonId)) {
            return res.status(400).json({ success: false, error: 'Invalid parent person ID' });
        }
        
        const service = await initService();
        const result = await service.getByParentPersonId(parentPersonId);
        
        if (!result.success) {
            return res.status(404).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in GET /api/parents/:id:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/parents/address/:addressId
 * Get parents by address ID
 */
router.get('/address/:addressId', async (req, res) => {
    try {
        const addressId = parseInt(req.params.addressId);
        
        if (isNaN(addressId)) {
            return res.status(400).json({ success: false, error: 'Invalid address ID' });
        }
        
        const service = await initService();
        const result = await service.getByAddressId(addressId);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in GET /api/parents/address/:addressId:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/parents/type/:type
 * Get parents by parent type
 */
router.get('/type/:type', async (req, res) => {
    try {
        const parentType = req.params.type;
        
        const service = await initService();
        const result = await service.getByParentType(parentType);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in GET /api/parents/type/:type:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/parents/job/:job
 * Get parents by job
 */
router.get('/job/:job', async (req, res) => {
    try {
        const job = req.params.job;
        
        const service = await initService();
        const result = await service.getByJob(job);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in GET /api/parents/job/:job:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/parents/job/search
 * Search parents by job pattern
 */
router.get('/job/search', async (req, res) => {
    try {
        const jobPattern = String(req.query.pattern || '');
        
        if (!jobPattern) {
            return res.status(400).json({ success: false, error: 'Job pattern is required' });
        }
        
        const service = await initService();
        const result = await service.getLikeJob(jobPattern);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in GET /api/parents/job/search:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/parents
 * Create a new parent
 */
router.post('/', async (req, res) => {
    try {
        const parent = new Parent(req.body);
        
        const service = await initService();
        const result = await service.createParent(parent);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.status(201).json(result);
    } catch (error) {
        console.error('Error in POST /api/parents:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/parents/bulk
 * Create multiple parents
 */
router.post('/bulk', async (req, res) => {
    try {
        const parentsData = req.body;
        
        if (!Array.isArray(parentsData)) {
            return res.status(400).json({ success: false, error: 'Request body must be an array' });
        }
        
        const parents = parentsData.map(data => new Parent(data));
        
        const service = await initService();
        const result = await service.createParents(parents);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.status(201).json(result);
    } catch (error) {
        console.error('Error in POST /api/parents/bulk:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * PATCH /api/parents/:id/address
 * Update parent's address ID
 */
router.patch('/:id/address', async (req, res) => {
    try {
        const parentPersonId = parseInt(req.params.id);
        const { addressId } = req.body;
        
        if (isNaN(parentPersonId)) {
            return res.status(400).json({ success: false, error: 'Invalid parent person ID' });
        }
        
        const service = await initService();
        const result = await service.updateAddressId(parentPersonId, addressId);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in PATCH /api/parents/:id/address:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * PATCH /api/parents/:id/job
 * Update parent's job
 */
router.patch('/:id/job', async (req, res) => {
    try {
        const parentPersonId = parseInt(req.params.id);
        const { job } = req.body;
        
        if (isNaN(parentPersonId)) {
            return res.status(400).json({ success: false, error: 'Invalid parent person ID' });
        }
        
        const service = await initService();
        const result = await service.updateJob(parentPersonId, job);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in PATCH /api/parents/:id/job:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * PATCH /api/parents/:id/type
 * Update parent's type
 */
router.patch('/:id/type', async (req, res) => {
    try {
        const parentPersonId = parseInt(req.params.id);
        const { type } = req.body;
        
        if (isNaN(parentPersonId)) {
            return res.status(400).json({ success: false, error: 'Invalid parent person ID' });
        }
        
        const service = await initService();
        const result = await service.updateParentType(parentPersonId, type);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in PATCH /api/parents/:id/type:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * PATCH /api/parents/batch/address
 * Batch update parent addresses
 */
router.patch('/batch/address', async (req, res) => {
    try {
        const parents = req.body;
        
        if (!Array.isArray(parents)) {
            return res.status(400).json({ success: false, error: 'Request body must be an array' });
        }
        
        const service = await initService();
        const result = await service.updateAddressIds(parents);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in PATCH /api/parents/batch/address:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * PATCH /api/parents/batch/job
 * Batch update parent jobs
 */
router.patch('/batch/job', async (req, res) => {
    try {
        const parents = req.body;
        
        if (!Array.isArray(parents)) {
            return res.status(400).json({ success: false, error: 'Request body must be an array' });
        }
        
        const service = await initService();
        const result = await service.updateJobs(parents);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in PATCH /api/parents/batch/job:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * PATCH /api/parents/batch/type
 * Batch update parent types
 */
router.patch('/batch/type', async (req, res) => {
    try {
        const parents = req.body;
        
        if (!Array.isArray(parents)) {
            return res.status(400).json({ success: false, error: 'Request body must be an array' });
        }
        
        const service = await initService();
        const result = await service.updateParentTypes(parents);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in PATCH /api/parents/batch/type:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * DELETE /api/parents/:id
 * Delete parent by person ID
 */
router.delete('/:id', async (req, res) => {
    try {
        const parentPersonId = parseInt(req.params.id);
        
        if (isNaN(parentPersonId)) {
            return res.status(400).json({ success: false, error: 'Invalid parent person ID' });
        }
        
        const service = await initService();
        const result = await service.deleteParent(parentPersonId);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in DELETE /api/parents/:id:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * DELETE /api/parents/bulk
 * Delete multiple parents
 */
router.delete('/bulk', async (req, res) => {
    try {
        const { parentPersonIds } = req.body;
        
        if (!Array.isArray(parentPersonIds)) {
            return res.status(400).json({ success: false, error: 'parentPersonIds must be an array' });
        }
        
        const service = await initService();
        const result = await service.deleteParents(parentPersonIds);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in DELETE /api/parents/bulk:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;

import express from 'express';
import LocationWardServices from '../services/LocationWardServices.js';

const router = express.Router();

/**
 * @route GET /api/wards
 * @desc Get all wards
 */
router.get('/', async (req, res) => {
    try {
        const result = await LocationWardServices.getAllWards();
        if (result.success) {
            res.json(result.data);
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route GET /api/wards/:id
 * @desc Get ward by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const wardId = parseInt(req.params.id);
        const result = await LocationWardServices.getByWardId(wardId);
        
        if (result.success) {
            res.json(result.data);
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route POST /api/wards
 * @desc Create a new ward
 */
router.post('/', async (req, res) => {
    try {
        const result = await LocationWardServices.createWard(req.body);
        
        if (result.success) {
            res.status(201).json(result.data);
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route PUT /api/wards/:id
 * @desc Update a ward
 */
router.put('/:id', async (req, res) => {
    try {
        const wardId = parseInt(req.params.id);
        const result = await LocationWardServices.updateWard(wardId, req.body);
        
        if (result.success) {
            res.json(result.data);
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route DELETE /api/wards/:id
 * @desc Delete a ward
 */
router.delete('/:id', async (req, res) => {
    try {
        const wardId = parseInt(req.params.id);
        const result = await LocationWardServices.deleteWard(wardId);
        
        if (result.success) {
            res.status(204).send();
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

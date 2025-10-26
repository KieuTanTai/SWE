import express from 'express';
import LocationDistrictServices from '../services/LocationDistrictServices.js';

const router = express.Router();

/**
 * @route GET /api/districts
 * @desc Get all districts
 */
router.get('/', async (req, res) => {
    try {
        const result = await LocationDistrictServices.getAllDistricts();
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
 * @route GET /api/districts/:id
 * @desc Get district by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const districtId = parseInt(req.params.id);
        const result = await LocationDistrictServices.getByDistrictId(districtId);
        
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
 * @route POST /api/districts
 * @desc Create a new district
 */
router.post('/', async (req, res) => {
    try {
        const result = await LocationDistrictServices.createDistrict(req.body);
        
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
 * @route PUT /api/districts/:id
 * @desc Update a district
 */
router.put('/:id', async (req, res) => {
    try {
        const districtId = parseInt(req.params.id);
        const result = await LocationDistrictServices.updateDistrict(districtId, req.body);
        
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
 * @route DELETE /api/districts/:id
 * @desc Delete a district
 */
router.delete('/:id', async (req, res) => {
    try {
        const districtId = parseInt(req.params.id);
        const result = await LocationDistrictServices.deleteDistrict(districtId);
        
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

import express from 'express';
import TimeRoleServices from '../services/TimeRoleServices.js';

const router = express.Router();

/**
 * @route GET /api/time-roles
 * @desc Get all time roles
 */
router.get('/', async (req, res) => {
    try {
        const result = await TimeRoleServices.getAllTimeRoles();
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
 * @route GET /api/time-roles/:id
 * @desc Get time role by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const timeRoleId = parseInt(req.params.id);
        const result = await TimeRoleServices.getByTimeRoleId(timeRoleId);
        
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
 * @route POST /api/time-roles
 * @desc Create a new time role
 */
router.post('/', async (req, res) => {
    try {
        const result = await TimeRoleServices.createTimeRole(req.body);
        
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
 * @route PUT /api/time-roles/:id
 * @desc Update a time role
 */
router.put('/:id', async (req, res) => {
    try {
        const timeRoleId = parseInt(req.params.id);
        const result = await TimeRoleServices.updateTimeRole(timeRoleId, req.body);
        
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
 * @route DELETE /api/time-roles/:id
 * @desc Delete a time role
 */
router.delete('/:id', async (req, res) => {
    try {
        const timeRoleId = parseInt(req.params.id);
        const result = await TimeRoleServices.deleteTimeRole(timeRoleId);
        
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

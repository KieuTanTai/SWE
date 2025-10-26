import express from 'express';
import PickupScheduleServices from '../services/PickupScheduleServices.js';

const router = express.Router();

/**
 * @route GET /api/pickup-schedules
 * @desc Get all pickup schedules
 */
router.get('/', async (req, res) => {
    try {
        const result = await PickupScheduleServices.getAllPickupSchedules();
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
 * @route GET /api/pickup-schedules/:id
 * @desc Get pickup schedule by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const pickupScheduleId = parseInt(req.params.id);
        const result = await PickupScheduleServices.getByPickupScheduleId(pickupScheduleId);
        
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
 * @route POST /api/pickup-schedules
 * @desc Create a new pickup schedule
 */
router.post('/', async (req, res) => {
    try {
        const result = await PickupScheduleServices.createPickupSchedule(req.body);
        
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
 * @route PUT /api/pickup-schedules/:id
 * @desc Update a pickup schedule
 */
router.put('/:id', async (req, res) => {
    try {
        const pickupScheduleId = parseInt(req.params.id);
        const result = await PickupScheduleServices.updatePickupSchedule(pickupScheduleId, req.body);
        
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
 * @route DELETE /api/pickup-schedules/:id
 * @desc Delete a pickup schedule
 */
router.delete('/:id', async (req, res) => {
    try {
        const pickupScheduleId = parseInt(req.params.id);
        const result = await PickupScheduleServices.deletePickupSchedule(pickupScheduleId);
        
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

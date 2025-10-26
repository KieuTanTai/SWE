import express from 'express';
import ScheduleServices from '../services/ScheduleServices.js';

const router = express.Router();

/**
 * @route GET /api/schedules
 * @desc Get all schedules
 */
router.get('/', async (req, res) => {
    try {
        const result = await ScheduleServices.getAllSchedules();
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
 * @route GET /api/schedules/:id
 * @desc Get schedule by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const scheduleId = parseInt(req.params.id);
        const result = await ScheduleServices.getByScheduleId(scheduleId);
        
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
 * @route POST /api/schedules
 * @desc Create a new schedule
 */
router.post('/', async (req, res) => {
    try {
        const result = await ScheduleServices.createSchedule(req.body);
        
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
 * @route PUT /api/schedules/:id
 * @desc Update a schedule
 */
router.put('/:id', async (req, res) => {
    try {
        const scheduleId = parseInt(req.params.id);
        const result = await ScheduleServices.updateSchedule(scheduleId, req.body);
        
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
 * @route DELETE /api/schedules/:id
 * @desc Delete a schedule
 */
router.delete('/:id', async (req, res) => {
    try {
        const scheduleId = parseInt(req.params.id);
        const result = await ScheduleServices.deleteSchedule(scheduleId);
        
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

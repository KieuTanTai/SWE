import express from 'express';
import DetailScheduleServices from '../services/DetailScheduleServices.js';

const router = express.Router();

/**
 * @route GET /api/detail-schedules
 * @desc Get all detail schedules
 */
router.get('/', async (req, res) => {
    try {
        const result = await DetailScheduleServices.getAllDetailSchedules();
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
 * @route GET /api/detail-schedules/:id
 * @desc Get detail schedule by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const detailScheduleId = parseInt(req.params.id);
        const result = await DetailScheduleServices.getByDetailScheduleId(detailScheduleId);
        
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
 * @route POST /api/detail-schedules
 * @desc Create a new detail schedule
 */
router.post('/', async (req, res) => {
    try {
        const result = await DetailScheduleServices.createDetailSchedule(req.body);
        
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
 * @route PUT /api/detail-schedules/:id
 * @desc Update a detail schedule
 */
router.put('/:id', async (req, res) => {
    try {
        const detailScheduleId = parseInt(req.params.id);
        const result = await DetailScheduleServices.updateDetailSchedule(detailScheduleId, req.body);
        
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
 * @route DELETE /api/detail-schedules/:id
 * @desc Delete a detail schedule
 */
router.delete('/:id', async (req, res) => {
    try {
        const detailScheduleId = parseInt(req.params.id);
        const result = await DetailScheduleServices.deleteDetailSchedule(detailScheduleId);
        
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

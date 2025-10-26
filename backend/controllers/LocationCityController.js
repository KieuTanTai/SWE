import express from 'express';
import LocationCityServices from '../services/LocationCityServices.js';

const router = express.Router();

/**
 * @route GET /api/cities
 * @desc Get all cities
 */
router.get('/', async (req, res) => {
    try {
        const result = await LocationCityServices.getAllCities();
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
 * @route GET /api/cities/:id
 * @desc Get city by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const cityId = parseInt(req.params.id);
        const result = await LocationCityServices.getByCityId(cityId);
        
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
 * @route POST /api/cities
 * @desc Create a new city
 */
router.post('/', async (req, res) => {
    try {
        const result = await LocationCityServices.createCity(req.body);
        
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
 * @route PUT /api/cities/:id
 * @desc Update a city
 */
router.put('/:id', async (req, res) => {
    try {
        const cityId = parseInt(req.params.id);
        const result = await LocationCityServices.updateCity(cityId, req.body);
        
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
 * @route DELETE /api/cities/:id
 * @desc Delete a city
 */
router.delete('/:id', async (req, res) => {
    try {
        const cityId = parseInt(req.params.id);
        const result = await LocationCityServices.deleteCity(cityId);
        
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

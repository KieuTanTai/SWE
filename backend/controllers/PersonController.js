import express from 'express';
import PersonServices from '../services/PersonServices.js';

const router = express.Router();

/**
 * @route GET /api/persons
 * @desc Get all persons
 */
router.get('/', async (req, res) => {
    try {
        const result = await PersonServices.getAllPersons();
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
 * @route GET /api/persons/:id
 * @desc Get person by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const personId = parseInt(req.params.id);
        const result = await PersonServices.getByPersonId(personId);
        
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
 * @route POST /api/persons
 * @desc Create a new person
 */
router.post('/', async (req, res) => {
    try {
        const result = await PersonServices.createPerson(req.body);
        
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
 * @route PUT /api/persons/:id
 * @desc Update a person
 */
router.put('/:id', async (req, res) => {
    try {
        const personId = parseInt(req.params.id);
        const result = await PersonServices.updatePerson(personId, req.body);
        
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
 * @route DELETE /api/persons/:id
 * @desc Delete a person
 */
router.delete('/:id', async (req, res) => {
    try {
        const personId = parseInt(req.params.id);
        const result = await PersonServices.deletePerson(personId);
        
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

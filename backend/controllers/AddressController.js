import express from 'express';
import AddressServices from '../services/AddressServices.js';

const router = express.Router();

/**
 * @route GET /api/addresses
 * @desc Get all addresses
 */
router.get('/', async (req, res) => {
    try {
        const result = await AddressServices.getAllAddresses();
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
 * @route GET /api/addresses/:id
 * @desc Get address by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const addressId = parseInt(req.params.id);
        const result = await AddressServices.getByAddressId(addressId);
        
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
 * @route POST /api/addresses
 * @desc Create a new address
 */
router.post('/', async (req, res) => {
    try {
        const result = await AddressServices.createAddress(req.body);
        
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
 * @route PUT /api/addresses/:id
 * @desc Update an address
 */
router.put('/:id', async (req, res) => {
    try {
        const addressId = parseInt(req.params.id);
        const result = await AddressServices.updateAddress(addressId, req.body);
        
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
 * @route DELETE /api/addresses/:id
 * @desc Delete an address
 */
router.delete('/:id', async (req, res) => {
    try {
        const addressId = parseInt(req.params.id);
        const result = await AddressServices.deleteAddress(addressId);
        
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

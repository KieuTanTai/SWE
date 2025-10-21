import express from 'express';

const router = express.Router();
import driverService from '../services/DriverService.js';

router.get('/', async (req, res) => {
  res.json(await driverService.getAll());
});

router.get('/:id', async (req, res) => {
  res.json(await driverService.getById(req.params.id));
});

router.post('/', async (req, res) => {
  res.json(await driverService.create(req.body));
});

router.put('/:id', async (req, res) => {
  res.json(await driverService.update(req.params.id, req.body));
});

router.delete('/:id', async (req, res) => {
  res.json(await driverService.delete(req.params.id));
});

export default router;

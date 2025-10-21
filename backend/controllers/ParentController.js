
import express from 'express';

const router = express.Router();
import parentService from '../services/ParentService.js';

router.get('/', async (req, res) => {
  res.json(await parentService.getAll());
});

router.get('/:id', async (req, res) => {
  res.json(await parentService.getById(req.params.id));
});

router.post('/', async (req, res) => {
  res.json(await parentService.create(req.body));
});

router.put('/:id', async (req, res) => {
  res.json(await parentService.update(req.params.id, req.body));
});

router.delete('/:id', async (req, res) => {
  res.json(await parentService.delete(req.params.id));
});

export default router;

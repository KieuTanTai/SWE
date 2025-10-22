import express from 'express';

const router = express.Router();
import reportService from '../services/ReportService.js';


router.get('/', async (req, res) => {
  res.json(await reportService.getAll());
});

router.get('/:id', async (req, res) => {
  res.json(await reportService.getById(req.params.id));
});

router.post('/', async (req, res) => {
  res.json(await reportService.create(req.body));
});

router.put('/:id', async (req, res) => {
  res.json(await reportService.update(req.params.id, req.body));
});

router.delete('/:id', async (req, res) => {
  res.json(await reportService.delete(req.params.id));
});

export default router;

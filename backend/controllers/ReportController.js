import express from 'express';
import ReportService from '../services/ReportService.js';
import ReportDAO from '../infrastructure/data/reportDAO.js';
import Connection from '../infrastructure/connection/getConnection.js';
import { Report } from '../models/index.js';

const router = express.Router();

/**
 * Initialize service with connection
 */
const initService = async () => {
    const connectionManager = new Connection('./config.json');
    const pool = await connectionManager.connect();
    const connection = await pool.getConnection();
    const reportDAO = new ReportDAO(connection);
    return new ReportService(reportDAO);
};

/**
 * GET /api/reports
 * Get all reports
 */
router.get('/', async (req, res) => {
    try {
        const service = await initService();
        const result = await service.getAllReports();
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in GET /api/reports:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/reports/:id
 * Get report by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const reportId = parseInt(req.params.id);
        
        if (isNaN(reportId)) {
            return res.status(400).json({ success: false, error: 'Invalid report ID' });
        }
        
        const service = await initService();
        const result = await service.getByReportId(reportId);
        
        if (!result.success) {
            return res.status(404).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in GET /api/reports/:id:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/reports/driver/:driverId
 * Get reports by driver ID
 */
router.get('/driver/:driverId', async (req, res) => {
    try {
        const driverId = parseInt(req.params.driverId);
        
        if (isNaN(driverId)) {
            return res.status(400).json({ success: false, error: 'Invalid driver ID' });
        }
        
        const service = await initService();
        const result = await service.getByDriverId(driverId);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in GET /api/reports/driver/:driverId:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/reports/type/:type
 * Get reports by report type
 */
router.get('/type/:type', async (req, res) => {
    try {
        const reportType = req.params.type;
        
        const service = await initService();
        const result = await service.getByReportType(reportType);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in GET /api/reports/type/:type:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/reports/time-range
 * Get reports by time range
 */
router.get('/time-range', async (req, res) => {
    try {
        const startTime = req.query.start ? new Date(String(req.query.start)) : null;
        const endTime = req.query.end ? new Date(String(req.query.end)) : null;
        
        if (!startTime || !endTime) {
            return res.status(400).json({ success: false, error: 'Start and end time are required' });
        }
        
        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
            return res.status(400).json({ success: false, error: 'Invalid date format' });
        }
        
        const service = await initService();
        const result = await service.getByTimeRange(startTime, endTime);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in GET /api/reports/time-range:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/reports/driver/:driverId/type/:type
 * Get reports by driver ID and type
 */
router.get('/driver/:driverId/type/:type', async (req, res) => {
    try {
        const driverId = parseInt(req.params.driverId);
        const reportType = req.params.type;
        
        if (isNaN(driverId)) {
            return res.status(400).json({ success: false, error: 'Invalid driver ID' });
        }
        
        const service = await initService();
        const result = await service.getByDriverIdAndType(driverId, reportType);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in GET /api/reports/driver/:driverId/type/:type:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/reports
 * Create a new report
 */
router.post('/', async (req, res) => {
    try {
        const report = new Report(req.body);
        
        const service = await initService();
        const result = await service.createReport(report);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.status(201).json(result);
    } catch (error) {
        console.error('Error in POST /api/reports:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/reports/bulk
 * Create multiple reports
 */
router.post('/bulk', async (req, res) => {
    try {
        const reportsData = req.body;
        
        if (!Array.isArray(reportsData)) {
            return res.status(400).json({ success: false, error: 'Request body must be an array' });
        }
        
        const reports = reportsData.map(data => new Report(data));
        
        const service = await initService();
        const result = await service.createReports(reports);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.status(201).json(result);
    } catch (error) {
        console.error('Error in POST /api/reports/bulk:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * PATCH /api/reports/:id/type
 * Update report type
 */
router.patch('/:id/type', async (req, res) => {
    try {
        const reportId = parseInt(req.params.id);
        const { type } = req.body;
        
        if (isNaN(reportId)) {
            return res.status(400).json({ success: false, error: 'Invalid report ID' });
        }
        
        const service = await initService();
        const result = await service.updateReportType(reportId, type);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in PATCH /api/reports/:id/type:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * PATCH /api/reports/:id/content
 * Update report content
 */
router.patch('/:id/content', async (req, res) => {
    try {
        const reportId = parseInt(req.params.id);
        const { content } = req.body;
        
        if (isNaN(reportId)) {
            return res.status(400).json({ success: false, error: 'Invalid report ID' });
        }
        
        const service = await initService();
        const result = await service.updateReportContent(reportId, content);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in PATCH /api/reports/:id/content:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * PATCH /api/reports/batch/type
 * Batch update report types
 */
router.patch('/batch/type', async (req, res) => {
    try {
        const reports = req.body;
        
        if (!Array.isArray(reports)) {
            return res.status(400).json({ success: false, error: 'Request body must be an array' });
        }
        
        const service = await initService();
        const result = await service.updateReportTypes(reports);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in PATCH /api/reports/batch/type:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * PATCH /api/reports/batch/content
 * Batch update report contents
 */
router.patch('/batch/content', async (req, res) => {
    try {
        const reports = req.body;
        
        if (!Array.isArray(reports)) {
            return res.status(400).json({ success: false, error: 'Request body must be an array' });
        }
        
        const service = await initService();
        const result = await service.updateReportContents(reports);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in PATCH /api/reports/batch/content:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * DELETE /api/reports/:id
 * Delete report by ID
 */
router.delete('/:id', async (req, res) => {
    try {
        const reportId = parseInt(req.params.id);
        
        if (isNaN(reportId)) {
            return res.status(400).json({ success: false, error: 'Invalid report ID' });
        }
        
        const service = await initService();
        const result = await service.deleteReport(reportId);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in DELETE /api/reports/:id:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * DELETE /api/reports/bulk
 * Delete multiple reports
 */
router.delete('/bulk', async (req, res) => {
    try {
        const { reportIds } = req.body;
        
        if (!Array.isArray(reportIds)) {
            return res.status(400).json({ success: false, error: 'reportIds must be an array' });
        }
        
        const service = await initService();
        const result = await service.deleteReports(reportIds);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in DELETE /api/reports/bulk:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * DELETE /api/reports/driver/:driverId
 * Delete all reports by driver ID
 */
router.delete('/driver/:driverId', async (req, res) => {
    try {
        const driverId = parseInt(req.params.driverId);
        
        if (isNaN(driverId)) {
            return res.status(400).json({ success: false, error: 'Invalid driver ID' });
        }
        
        const service = await initService();
        const result = await service.deleteByDriverId(driverId);
        
        if (!result.success) {
            return res.status(400).json(result);
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in DELETE /api/reports/driver/:driverId:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;

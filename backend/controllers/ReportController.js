import express from "express";
import ReportService from "../services/ReportService.js";
import { Report } from "../index.js";

const router = express.Router();

// GET /api/reports - Get all reports
router.get("/", async (req, res) => {
    try {
        const service = new ReportService();
        const result = await service.getAllReports();
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/reports/:reportId - Get report by ID
router.get("/:reportId", async (req, res) => {
    try {
        const reportId = parseInt(req.params.reportId);
        const service = new ReportService();
        const result = await service.getByReportId(reportId);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/reports/batch?ids=1,2,3 - Get reports by multiple IDs
router.get("/batch/ids", async (req, res) => {
    try {
        const ids = req.query.ids;
        if (!ids || typeof ids !== 'string') {
            return res.status(400).json({ error: "Query parameter 'ids' is required" });
        }
        
        const reportIds = ids.split(",").map(id => parseInt(id.trim()));
        const service = new ReportService();
        const result = await service.getByReportIds(reportIds);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/reports/driver/:driverId - Get reports by driver ID
router.get("/driver/:driverId", async (req, res) => {
    try {
        const driverId = parseInt(req.params.driverId);
        const service = new ReportService();
        const result = await service.getByDriverId(driverId);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/reports/type/:reportType - Get reports by type
router.get("/type/:reportType", async (req, res) => {
    try {
        const { reportType } = req.params;
        const service = new ReportService();
        const result = await service.getByReportType(reportType);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/reports/time-range?start=...&end=... - Get reports by time range
router.get("/time-range/query", async (req, res) => {
    try {
        const start = req.query.start;
        const end = req.query.end;
        
        if (!start || !end || typeof start !== 'string' || typeof end !== 'string') {
            return res.status(400).json({ error: "Query parameters 'start' and 'end' are required" });
        }
        
        const startTime = new Date(start);
        const endTime = new Date(end);
        
        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
            return res.status(400).json({ error: "Invalid date format for 'start' or 'end'" });
        }

        const service = new ReportService();
        const result = await service.getByTimeRange(startTime, endTime);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/reports/driver/:driverId/type/:reportType - Get reports by driver and type
router.get("/driver/:driverId/type/:reportType", async (req, res) => {
    try {
        const driverId = parseInt(req.params.driverId);
        const { reportType } = req.params;
        const service = new ReportService();
        const result = await service.getByDriverIdAndType(driverId, reportType);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/reports - Create single report
router.post("/", async (req, res) => {
    try {
        const { report_time, report_type, report_content, report_driver_id } = req.body;
        if (!report_time || !report_type || !report_driver_id) {
            return res.status(400).json({ error: "report_time, report_type, and report_driver_id are required" });
        }

        const report = new Report({ report_time, report_type, report_content, report_driver_id });
        const service = new ReportService();
        const result = await service.createReport(report);
        result.success ? res.status(201).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/reports/bulk - Create multiple reports
router.post("/bulk", async (req, res) => {
    try {
        const { reports } = req.body;
        if (!Array.isArray(reports) || reports.length === 0) {
            return res.status(400).json({ error: "reports array is required and cannot be empty" });
        }

        const reportObjects = reports.map(r => new Report(r));
        const service = new ReportService();
        const result = await service.createReports(reportObjects);
        result.success ? res.status(201).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/reports/:reportId/type - Update report type
router.put("/:reportId/type", async (req, res) => {
    try {
        const reportId = parseInt(req.params.reportId);
        const { report_type } = req.body;
        
        if (!report_type) {
            return res.status(400).json({ error: "report_type is required" });
        }

        const service = new ReportService();
        const result = await service.updateReportType(reportId, report_type);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/reports/:reportId/content - Update report content
router.put("/:reportId/content", async (req, res) => {
    try {
        const reportId = parseInt(req.params.reportId);
        const { report_content } = req.body;
        
        if (!report_content) {
            return res.status(400).json({ error: "report_content is required" });
        }

        const service = new ReportService();
        const result = await service.updateReportContent(reportId, report_content);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/reports/bulk/types - Update types of multiple reports
router.put("/bulk/types", async (req, res) => {
    try {
        const { reports } = req.body;
        if (!Array.isArray(reports) || reports.length === 0) {
            return res.status(400).json({ error: "reports array is required and cannot be empty" });
        }

        const service = new ReportService();
        const result = await service.updateReportTypes(reports);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/reports/bulk/contents - Update contents of multiple reports
router.put("/bulk/contents", async (req, res) => {
    try {
        const { reports } = req.body;
        if (!Array.isArray(reports) || reports.length === 0) {
            return res.status(400).json({ error: "reports array is required and cannot be empty" });
        }

        const service = new ReportService();
        const result = await service.updateReportContents(reports);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/reports/:reportId - Delete report by ID
router.delete("/:reportId", async (req, res) => {
    try {
        const reportId = parseInt(req.params.reportId);
        const service = new ReportService();
        const result = await service.deleteReport(reportId);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/reports/batch?ids=1,2,3 - Delete multiple reports
router.delete("/batch/ids", async (req, res) => {
    try {
        const ids = req.query.ids;
        if (!ids || typeof ids !== 'string') {
            return res.status(400).json({ error: "Query parameter 'ids' is required" });
        }
        
        const reportIds = ids.split(",").map(id => parseInt(id.trim()));
        const service = new ReportService();
        const result = await service.deleteReports(reportIds);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/reports/driver/:driverId - Delete all reports by driver ID
router.delete("/driver/:driverId", async (req, res) => {
    try {
        const driverId = parseInt(req.params.driverId);
        const service = new ReportService();
        const result = await service.deleteByDriverId(driverId);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

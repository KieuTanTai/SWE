import express from "express";
import DriverService from "../services/DriverService.js";
import Driver from "../models/Driver.js";

const router = express.Router();

// GET /api/drivers - Get all drivers
router.get("/", async (req, res) => {
    try {
        const service = new DriverService();
        const result = await service.getAllDrivers();
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/drivers/:driverPersonId - Get driver by person ID
router.get("/:driverPersonId", async (req, res) => {
    try {
        const driverPersonId = parseInt(req.params.driverPersonId);
        const service = new DriverService();
        const result = await service.getByDriverPersonId(driverPersonId);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/drivers/batch?ids=1,2,3 - Get drivers by multiple person IDs
router.get("/batch/ids", async (req, res) => {
    try {
        const ids = req.query.ids;
        if (!ids || typeof ids !== 'string') {
            return res.status(400).json({ error: "Query parameter 'ids' is required" });
        }
        
        const driverPersonIds = ids.split(",").map(id => parseInt(id.trim()));
        const service = new DriverService();
        const result = await service.getByDriverPersonIds(driverPersonIds);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/drivers/experience-type/:type - Get drivers by experience type
router.get("/experience-type/:type", async (req, res) => {
    try {
        const { type } = req.params;
        const service = new DriverService();
        const result = await service.getByExperienceType(type);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/drivers/min-experience/:minExp - Get drivers with minimum experience
router.get("/min-experience/:minExp", async (req, res) => {
    try {
        const minExperience = parseInt(req.params.minExp);
        const service = new DriverService();
        const result = await service.getByMinExperience(minExperience);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/drivers/max-late-count/:maxCount - Get drivers with max late arrival count
router.get("/max-late-count/:maxCount", async (req, res) => {
    try {
        const maxLateCount = parseInt(req.params.maxCount);
        const service = new DriverService();
        const result = await service.getByMaxLateArrivalCount(maxLateCount);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/drivers - Create single driver
router.post("/", async (req, res) => {
    try {
        const { driver_person_id, driver_experience, driver_experience_type, driver_late_arrival_count } = req.body;
        if (!driver_person_id || driver_experience === undefined) {
            return res.status(400).json({ error: "driver_person_id and driver_experience are required" });
        }

        const driver = new Driver({ driver_person_id, driver_experience, driver_experience_type, driver_late_arrival_count });
        const service = new DriverService();
        const result = await service.createDriver(driver);
        result.success ? res.status(201).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/drivers/bulk - Create multiple drivers
router.post("/bulk", async (req, res) => {
    try {
        const { drivers } = req.body;
        if (!Array.isArray(drivers) || drivers.length === 0) {
            return res.status(400).json({ error: "drivers array is required and cannot be empty" });
        }

        const driverObjects = drivers.map(d => new Driver(d));
        const service = new DriverService();
        const result = await service.createDrivers(driverObjects);
        result.success ? res.status(201).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/drivers/:driverPersonId/experience - Update driver experience
router.put("/:driverPersonId/experience", async (req, res) => {
    try {
        const driverPersonId = parseInt(req.params.driverPersonId);
        const { experience, experience_type } = req.body;
        
        if (experience === undefined) {
            return res.status(400).json({ error: "experience is required" });
        }

        const service = new DriverService();
        const result = await service.updateExperience(driverPersonId, experience, experience_type);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/drivers/:driverPersonId/late-count - Update driver late arrival count
router.put("/:driverPersonId/late-count", async (req, res) => {
    try {
        const driverPersonId = parseInt(req.params.driverPersonId);
        const { late_count } = req.body;
        
        if (late_count === undefined) {
            return res.status(400).json({ error: "late_count is required" });
        }

        const service = new DriverService();
        const result = await service.updateLateArrivalCount(driverPersonId, late_count);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/drivers/:driverPersonId/increment-late - Increment late arrival count by 1
router.put("/:driverPersonId/increment-late", async (req, res) => {
    try {
        const driverPersonId = parseInt(req.params.driverPersonId);
        const service = new DriverService();
        const result = await service.incrementLateArrivalCount(driverPersonId);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/drivers/bulk/experiences - Update experiences of multiple drivers
router.put("/bulk/experiences", async (req, res) => {
    try {
        const { drivers } = req.body;
        if (!Array.isArray(drivers) || drivers.length === 0) {
            return res.status(400).json({ error: "drivers array is required and cannot be empty" });
        }

        const service = new DriverService();
        const result = await service.updateExperiences(drivers);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/drivers/bulk/late-counts - Update late counts of multiple drivers
router.put("/bulk/late-counts", async (req, res) => {
    try {
        const { drivers } = req.body;
        if (!Array.isArray(drivers) || drivers.length === 0) {
            return res.status(400).json({ error: "drivers array is required and cannot be empty" });
        }

        const service = new DriverService();
        const result = await service.updateLateArrivalCounts(drivers);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/drivers/:driverPersonId - Delete driver by person ID
router.delete("/:driverPersonId", async (req, res) => {
    try {
        const driverPersonId = parseInt(req.params.driverPersonId);
        const service = new DriverService();
        const result = await service.deleteDriver(driverPersonId);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/drivers/batch?ids=1,2,3 - Delete multiple drivers
router.delete("/batch/ids", async (req, res) => {
    try {
        const ids = req.query.ids;
        if (!ids || typeof ids !== 'string') {
            return res.status(400).json({ error: "Query parameter 'ids' is required" });
        }
        
        const driverPersonIds = ids.split(",").map(id => parseInt(id.trim()));
        const service = new DriverService();
        const result = await service.deleteDrivers(driverPersonIds);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

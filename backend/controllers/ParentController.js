import express from "express";
import ParentService from "../services/ParentService.js";
import { Parent } from "../models/index.js";

const router = express.Router();

// GET /api/parents - Get all parents
router.get("/", async (req, res) => {
    try {
        const service = new ParentService();
        const result = await service.getAllParents();
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/parents/:parentPersonId - Get parent by person ID
router.get("/:parentPersonId", async (req, res) => {
    try {
        const parentPersonId = parseInt(req.params.parentPersonId);
        const service = new ParentService();
        const result = await service.getByParentPersonId(parentPersonId);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/parents/batch?ids=1,2,3 - Get parents by multiple person IDs
router.get("/batch/ids", async (req, res) => {
    try {
        const ids = req.query.ids;
        if (!ids || typeof ids !== 'string') {
            return res.status(400).json({ error: "Query parameter 'ids' is required" });
        }
        
        const parentPersonIds = ids.split(",").map(id => parseInt(id.trim()));
        const service = new ParentService();
        const result = await service.getByParentPersonIds(parentPersonIds);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/parents/address/:addressId - Get parents by address ID
router.get("/address/:addressId", async (req, res) => {
    try {
        const addressId = parseInt(req.params.addressId);
        const service = new ParentService();
        const result = await service.getByAddressId(addressId);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/parents/type/:parentType - Get parents by type
router.get("/type/:parentType", async (req, res) => {
    try {
        const { parentType } = req.params;
        const service = new ParentService();
        const result = await service.getByParentType(parentType);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/parents/job/:job - Get parents by job
router.get("/job/:job", async (req, res) => {
    try {
        const { job } = req.params;
        const service = new ParentService();
        const result = await service.getByJob(job);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/parents/search/job?pattern=... - Get parents with job like pattern
router.get("/search/job", async (req, res) => {
    try {
        const pattern = req.query.pattern;
        if (!pattern || typeof pattern !== 'string') {
            return res.status(400).json({ error: "Query parameter 'pattern' is required" });
        }
        
        const service = new ParentService();
        const result = await service.getLikeJob(pattern);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/parents - Create single parent
router.post("/", async (req, res) => {
    try {
        const { parent_person_id, parent_address_id, parent_job, parent_type } = req.body;
        if (!parent_person_id) {
            return res.status(400).json({ error: "parent_person_id is required" });
        }

        const parent = new Parent({ parent_person_id, parent_address_id, parent_job, parent_type });
        const service = new ParentService();
        const result = await service.createParent(parent);
        result.success ? res.status(201).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/parents/bulk - Create multiple parents
router.post("/bulk", async (req, res) => {
    try {
        const { parents } = req.body;
        if (!Array.isArray(parents) || parents.length === 0) {
            return res.status(400).json({ error: "parents array is required and cannot be empty" });
        }

        const parentObjects = parents.map(p => new Parent(p));
        const service = new ParentService();
        const result = await service.createParents(parentObjects);
        result.success ? res.status(201).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/parents/:parentPersonId/address - Update parent address ID
router.put("/:parentPersonId/address", async (req, res) => {
    try {
        const parentPersonId = parseInt(req.params.parentPersonId);
        const { address_id } = req.body;
        
        if (address_id === undefined) {
            return res.status(400).json({ error: "address_id is required" });
        }

        const service = new ParentService();
        const result = await service.updateAddressId(parentPersonId, address_id);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/parents/:parentPersonId/job - Update parent job
router.put("/:parentPersonId/job", async (req, res) => {
    try {
        const parentPersonId = parseInt(req.params.parentPersonId);
        const { job } = req.body;
        
        if (!job) {
            return res.status(400).json({ error: "job is required" });
        }

        const service = new ParentService();
        const result = await service.updateJob(parentPersonId, job);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/parents/:parentPersonId/type - Update parent type
router.put("/:parentPersonId/type", async (req, res) => {
    try {
        const parentPersonId = parseInt(req.params.parentPersonId);
        const { parent_type } = req.body;
        
        if (!parent_type) {
            return res.status(400).json({ error: "parent_type is required" });
        }

        const service = new ParentService();
        const result = await service.updateParentType(parentPersonId, parent_type);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/parents/bulk/addresses - Update addresses of multiple parents
router.put("/bulk/addresses", async (req, res) => {
    try {
        const { parents } = req.body;
        if (!Array.isArray(parents) || parents.length === 0) {
            return res.status(400).json({ error: "parents array is required and cannot be empty" });
        }

        const service = new ParentService();
        const result = await service.updateAddressIds(parents);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/parents/bulk/jobs - Update jobs of multiple parents
router.put("/bulk/jobs", async (req, res) => {
    try {
        const { parents } = req.body;
        if (!Array.isArray(parents) || parents.length === 0) {
            return res.status(400).json({ error: "parents array is required and cannot be empty" });
        }

        const service = new ParentService();
        const result = await service.updateJobs(parents);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/parents/bulk/types - Update types of multiple parents
router.put("/bulk/types", async (req, res) => {
    try {
        const { parents } = req.body;
        if (!Array.isArray(parents) || parents.length === 0) {
            return res.status(400).json({ error: "parents array is required and cannot be empty" });
        }

        const service = new ParentService();
        const result = await service.updateParentTypes(parents);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/parents/:parentPersonId - Delete parent by person ID
router.delete("/:parentPersonId", async (req, res) => {
    try {
        const parentPersonId = parseInt(req.params.parentPersonId);
        const service = new ParentService();
        const result = await service.deleteParent(parentPersonId);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/parents/batch?ids=1,2,3 - Delete multiple parents
router.delete("/batch/ids", async (req, res) => {
    try {
        const ids = req.query.ids;
        if (!ids || typeof ids !== 'string') {
            return res.status(400).json({ error: "Query parameter 'ids' is required" });
        }
        
        const parentPersonIds = ids.split(",").map(id => parseInt(id.trim()));
        const service = new ParentService();
        const result = await service.deleteParents(parentPersonIds);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

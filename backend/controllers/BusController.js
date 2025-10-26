import express from "express";
import BusServices from "../services/BusServices.js";
import { Bus } from "../index.js";

const router = express.Router();

// GET /api/buses - Get all buses
router.get("/", async (req, res) => {
    try {
        const service = new BusServices();
        const result = await service.getAllBuses();
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/buses/:busId - Get bus by ID
router.get("/:busId", async (req, res) => {
    try {
        const busId = parseInt(req.params.busId);
        const service = new BusServices();
        const result = await service.getByBusId(busId);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/buses/batch?ids=1,2,3 - Get buses by multiple IDs
router.get("/batch/ids", async (req, res) => {
    try {
        const ids = req.query.ids;
        if (!ids || typeof ids !== 'string') {
            return res.status(400).json({ error: "Query parameter 'ids' is required" });
        }
        
        const busIds = ids.split(",").map(id => parseInt(id.trim()));
        const service = new BusServices();
        const result = await service.getByBusIds(busIds);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/buses/status/:status - Get buses by status
router.get("/status/:status", async (req, res) => {
    try {
        const busStatus = req.params.status === 'true';
        const service = new BusServices();
        const result = await service.getByBusStatus(busStatus);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/buses/brand/:brand - Get buses by brand
router.get("/brand/:brand", async (req, res) => {
    try {
        const { brand } = req.params;
        const service = new BusServices();
        const result = await service.getByBusBrand(brand);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/buses/model/:model - Get buses by model
router.get("/model/:model", async (req, res) => {
    try {
        const { model } = req.params;
        const service = new BusServices();
        const result = await service.getByBusModel(model);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/buses/license-plate/:plate - Get bus by license plate
router.get("/license-plate/:plate", async (req, res) => {
    try {
        const { plate } = req.params;
        const service = new BusServices();
        const result = await service.getByLicensePlate(plate);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/buses - Create single bus
router.post("/", async (req, res) => {
    try {
        const { bus_license_plate, bus_brand, bus_model, bus_capacity, bus_year_manufactured, bus_has_wifi, bus_has_camera, bus_color, bus_status } = req.body;
        if (!bus_license_plate || !bus_capacity) {
            return res.status(400).json({ error: "bus_license_plate and bus_capacity are required" });
        }

        const bus = new Bus({ bus_license_plate, bus_brand, bus_model, bus_capacity, bus_year_manufactured, bus_has_wifi, bus_has_camera, bus_color, bus_status });
        const service = new BusServices();
        const result = await service.createBus(bus);
        result.success ? res.status(201).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/buses/:busId - Update single bus
router.put("/:busId", async (req, res) => {
    try {
        const busId = parseInt(req.params.busId);
        const { bus_license_plate, bus_brand, bus_model, bus_capacity, bus_year_manufactured, bus_has_wifi, bus_has_camera, bus_color, bus_status } = req.body;
        
        const bus = new Bus({ bus_id: busId, bus_license_plate, bus_brand, bus_model, bus_capacity, bus_year_manufactured, bus_has_wifi, bus_has_camera, bus_color, bus_status });
        const service = new BusServices();
        const result = await service.updateBus(bus);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/buses/bulk - Update multiple buses
router.put("/bulk/update", async (req, res) => {
    try {
        const { buses } = req.body;
        if (!Array.isArray(buses) || buses.length === 0) {
            return res.status(400).json({ error: "buses array is required and cannot be empty" });
        }

        const busObjects = buses.map(b => new Bus(b));
        const service = new BusServices();
        const result = await service.updateBuses(busObjects);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/buses/:busId - Delete bus
router.delete("/:busId", async (req, res) => {
    try {
        const busId = parseInt(req.params.busId);
        const service = new BusServices();
        const result = await service.deleteBus(busId);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

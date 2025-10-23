import express from "express";
import RoleService from "../services/RoleService.js";
import { Role } from "../models/index.js";

const router = express.Router();

// GET /api/roles - Get all roles
router.get("/", async (req, res) => {
  try {
    const service = new RoleService();
    const result = await service.getAllRoles();
    result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/roles/:id - Get role by ID
router.get("/:id", async (req, res) => {
  try {
    const roleId = parseInt(req.params.id);
    if (isNaN(roleId)) return res.status(400).json({ error: "Invalid role ID" });
    
    const service = new RoleService();
    const result = await service.getByRoleId(roleId);
    result.success ? res.status(200).json(result.data) : res.status(404).json({ error: result.error });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/roles/name/:name - Get role by name
router.get("/name/:name", async (req, res) => {
  try {
    const service = new RoleService();
    const result = await service.getByRoleName(req.params.name);
    result.success ? res.status(200).json(result.data) : res.status(404).json({ error: result.error });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/roles - Create new role
router.post("/", async (req, res) => {
  try {
    const role = new Role(req.body);
    const service = new RoleService();
    const result = await service.createRole(role);
    result.success ? res.status(201).json(result.data) : res.status(400).json({ error: result.error });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/roles/bulk - Create multiple roles
router.post("/bulk", async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: "Request body must be a non-empty array" });
    }
    const roles = req.body.map(data => new Role(data));
    const service = new RoleService();
    const result = await service.createRoles(roles);
    result.success ? res.status(201).json(result.data) : res.status(400).json({ error: result.error });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/roles/:id/name - Update role name
router.put("/:id/name", async (req, res) => {
  try {
    const roleId = parseInt(req.params.id);
    const { name } = req.body;
    if (isNaN(roleId) || !name) return res.status(400).json({ error: "Invalid input" });
    
    const service = new RoleService();
    const result = await service.updateRoleName(roleId, name);
    result.success ? res.status(200).json(result.data) : res.status(400).json({ error: result.error });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/roles/:id/active-status - Update role active status
router.put("/:id/active-status", async (req, res) => {
  try {
    const roleId = parseInt(req.params.id);
    const { active_status } = req.body;
    if (isNaN(roleId) || active_status === undefined) return res.status(400).json({ error: "Invalid input" });
    
    const service = new RoleService();
    const result = await service.updateActiveStatus(roleId, active_status);
    result.success ? res.status(200).json(result.data) : res.status(400).json({ error: result.error });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

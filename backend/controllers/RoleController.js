import express from "express";
import Connection from "../infrastructure/connection/getConnection.js";
import RoleDAO from "../infrastructure/data/roleDAO.js";
import RoleService from "../services/RoleService.js";

const router = express.Router();

/**
 * Initialize service with database connection
 * @returns {Promise<RoleService>}
 */
async function initService() {
    const conn = new Connection('./config.json');
    const pool = await conn.connect();
    const connection = await pool.getConnection();
    const roleDAO = new RoleDAO(connection);
    return new RoleService(roleDAO);
}

/**
 * GET /api/roles
 * Get all roles
 */
router.get('/', async (req, res) => {
    try {
        const service = await initService();
        const result = await service.getAllRoles();
        
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in GET /roles:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/roles/:id
 * Get role by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const roleId = parseInt(req.params.id);
        if (isNaN(roleId)) {
            return res.status(400).json({ error: 'Invalid role ID' });
        }

        const service = await initService();
        const result = await service.getByRoleId(roleId);
        
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(404).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in GET /roles/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/roles/name/:name
 * Get role by name
 */
router.get('/name/:name', async (req, res) => {
    try {
        const roleName = String(req.params.name);
        if (!roleName || roleName.trim() === '') {
            return res.status(400).json({ error: 'Role name is required' });
        }

        const service = await initService();
        const result = await service.getByRoleName(roleName);
        
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(404).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in GET /roles/name/:name:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/roles/name/search
 * Search roles by partial name
 */
router.get('/name/search', async (req, res) => {
    try {
        const pattern = String(req.query.pattern || '');
        if (!pattern || pattern.trim() === '') {
            return res.status(400).json({ error: 'Search pattern is required' });
        }

        const service = await initService();
        const result = await service.getLikeRoleName(pattern);
        
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in GET /roles/name/search:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/roles/active/:status
 * Get roles by active status
 */
router.get('/active/:status', async (req, res) => {
    try {
        const status = req.params.status === 'true';
        const service = await initService();
        const result = await service.getByActiveStatus(status);
        
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in GET /roles/active/:status:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/roles
 * Create a new role
 */
router.post('/', async (req, res) => {
    try {
        const roleData = req.body;
        if (!roleData.role_name) {
            return res.status(400).json({ error: 'Role name is required' });
        }

        const service = await initService();
        const result = await service.createRole(roleData);
        
        if (result.success) {
            res.status(201).json(result.data);
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in POST /roles:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/roles/bulk
 * Create multiple roles
 */
router.post('/bulk', async (req, res) => {
    try {
        const roles = req.body;
        if (!Array.isArray(roles) || roles.length === 0) {
            return res.status(400).json({ error: 'Array of roles is required' });
        }

        const service = await initService();
        const result = await service.createRoles(roles);
        
        if (result.success) {
            res.status(201).json(result.data);
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in POST /roles/bulk:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * PATCH /api/roles/:id/name
 * Update role name
 */
router.patch('/:id/name', async (req, res) => {
    try {
        const roleId = parseInt(req.params.id);
        const { name } = req.body;
        
        if (isNaN(roleId)) {
            return res.status(400).json({ error: 'Invalid role ID' });
        }
        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Role name is required' });
        }

        const service = await initService();
        const result = await service.updateRoleName(roleId, name);
        
        if (result.success) {
            res.status(200).json({ message: 'Role name updated successfully' });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in PATCH /roles/:id/name:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * PATCH /api/roles/:id/active-status
 * Update role active status
 */
router.patch('/:id/active-status', async (req, res) => {
    try {
        const roleId = parseInt(req.params.id);
        const { activeStatus } = req.body;
        
        if (isNaN(roleId)) {
            return res.status(400).json({ error: 'Invalid role ID' });
        }
        if (typeof activeStatus !== 'boolean') {
            return res.status(400).json({ error: 'Active status must be a boolean' });
        }

        const service = await initService();
        const result = await service.updateActiveStatus(roleId, activeStatus);
        
        if (result.success) {
            res.status(200).json({ message: 'Active status updated successfully' });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in PATCH /roles/:id/active-status:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * PATCH /api/roles/batch/name
 * Batch update role names
 */
router.patch('/batch/name', async (req, res) => {
    try {
        const roles = req.body;
        if (!Array.isArray(roles) || roles.length === 0) {
            return res.status(400).json({ error: 'Array of roles is required' });
        }

        const service = await initService();
        const result = await service.updateRoleNames(roles);
        
        if (result.success) {
            res.status(200).json({ message: 'Role names updated successfully' });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in PATCH /roles/batch/name:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * PATCH /api/roles/batch/active-status
 * Batch update role active statuses
 */
router.patch('/batch/active-status', async (req, res) => {
    try {
        const roles = req.body;
        if (!Array.isArray(roles) || roles.length === 0) {
            return res.status(400).json({ error: 'Array of roles is required' });
        }

        const service = await initService();
        const result = await service.updateActiveStatuses(roles);
        
        if (result.success) {
            res.status(200).json({ message: 'Active statuses updated successfully' });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in PATCH /roles/batch/active-status:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
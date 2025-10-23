import express from "express";
import Connection from "../infrastructure/connection/getConnection.js";
import AccountRoleDAO from "../infrastructure/data/accountRoleDAO.js";
import AccountRoleService from "../services/AccountRoleService.js";

const router = express.Router();

/**
 * Initialize service with database connection
 * @returns {Promise<AccountRoleService>}
 */
async function initService() {
    const conn = new Connection('./config.json');
    const pool = await conn.connect();
    const connection = await pool.getConnection();
    const accountRoleDAO = new AccountRoleDAO(connection);
    return new AccountRoleService(accountRoleDAO);
}

/**
 * GET /api/account-roles
 * Get all account-role relationships
 */
router.get('/', async (req, res) => {
    try {
        const service = await initService();
        const result = await service.getAllAccountRoles();
        
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in GET /account-roles:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/account-roles/account/:accountId
 * Get all roles for a specific account
 */
router.get('/account/:accountId', async (req, res) => {
    try {
        const accountId = parseInt(req.params.accountId);
        if (isNaN(accountId)) {
            return res.status(400).json({ error: 'Invalid account ID' });
        }

        const service = await initService();
        const result = await service.getByAccountId(accountId);
        
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in GET /account-roles/account/:accountId:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/account-roles/role/:roleId
 * Get all accounts for a specific role
 */
router.get('/role/:roleId', async (req, res) => {
    try {
        const roleId = parseInt(req.params.roleId);
        if (isNaN(roleId)) {
            return res.status(400).json({ error: 'Invalid role ID' });
        }

        const service = await initService();
        const result = await service.getByRoleId(roleId);
        
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in GET /account-roles/role/:roleId:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/account-roles/account/:accountId/role/:roleId
 * Get specific account-role relationship
 */
router.get('/account/:accountId/role/:roleId', async (req, res) => {
    try {
        const accountId = parseInt(req.params.accountId);
        const roleId = parseInt(req.params.roleId);
        
        if (isNaN(accountId) || isNaN(roleId)) {
            return res.status(400).json({ error: 'Invalid account ID or role ID' });
        }

        const service = await initService();
        const result = await service.getByAccountIdAndRoleId(accountId, roleId);
        
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(404).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in GET /account-roles/account/:accountId/role/:roleId:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/account-roles
 * Assign a role to an account
 */
router.post('/', async (req, res) => {
    try {
        const { account_id, role_id, assigned_by } = req.body;
        
        if (!account_id || !role_id) {
            return res.status(400).json({ error: 'Account ID and Role ID are required' });
        }

        const service = await initService();
        const result = await service.createAccountRole({ account_id, role_id, assigned_by });
        
        if (result.success) {
            res.status(201).json(result.data);
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in POST /account-roles:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/account-roles/bulk
 * Assign multiple roles (bulk assignment)
 */
router.post('/bulk', async (req, res) => {
    try {
        const accountRoles = req.body;
        
        if (!Array.isArray(accountRoles) || accountRoles.length === 0) {
            return res.status(400).json({ error: 'Array of account-role assignments is required' });
        }

        const service = await initService();
        const result = await service.createAccountRoles(accountRoles);
        
        if (result.success) {
            res.status(201).json(result.data);
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in POST /account-roles/bulk:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/account-roles/account/:accountId
 * Revoke all roles from an account
 */
router.delete('/account/:accountId', async (req, res) => {
    try {
        const accountId = parseInt(req.params.accountId);
        if (isNaN(accountId)) {
            return res.status(400).json({ error: 'Invalid account ID' });
        }

        const service = await initService();
        const result = await service.deleteByAccountId(accountId);
        
        if (result.success) {
            res.status(200).json({ message: 'All roles revoked from account successfully' });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in DELETE /account-roles/account/:accountId:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/account-roles/role/:roleId
 * Remove a role from all accounts
 */
router.delete('/role/:roleId', async (req, res) => {
    try {
        const roleId = parseInt(req.params.roleId);
        if (isNaN(roleId)) {
            return res.status(400).json({ error: 'Invalid role ID' });
        }

        const service = await initService();
        const result = await service.deleteByRoleId(roleId);
        
        if (result.success) {
            res.status(200).json({ message: 'Role removed from all accounts successfully' });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in DELETE /account-roles/role/:roleId:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/account-roles/account/:accountId/role/:roleId
 * Revoke a specific role from an account
 */
router.delete('/account/:accountId/role/:roleId', async (req, res) => {
    try {
        const accountId = parseInt(req.params.accountId);
        const roleId = parseInt(req.params.roleId);
        
        if (isNaN(accountId) || isNaN(roleId)) {
            return res.status(400).json({ error: 'Invalid account ID or role ID' });
        }

        const service = await initService();
        const result = await service.deleteByAccountIdAndRoleId(accountId, roleId);
        
        if (result.success) {
            res.status(200).json({ message: 'Role revoked from account successfully' });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in DELETE /account-roles/account/:accountId/role/:roleId:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/account-roles/bulk/accounts
 * Revoke roles from multiple accounts
 */
router.delete('/bulk/accounts', async (req, res) => {
    try {
        const { accountIds } = req.body;
        
        if (!Array.isArray(accountIds) || accountIds.length === 0) {
            return res.status(400).json({ error: 'Array of account IDs is required' });
        }

        const service = await initService();
        const result = await service.deleteByAccountIds(accountIds);
        
        if (result.success) {
            res.status(200).json({ message: 'Roles revoked from multiple accounts successfully' });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in DELETE /account-roles/bulk/accounts:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/account-roles/bulk/roles
 * Remove multiple roles from all accounts
 */
router.delete('/bulk/roles', async (req, res) => {
    try {
        const { roleIds } = req.body;
        
        if (!Array.isArray(roleIds) || roleIds.length === 0) {
            return res.status(400).json({ error: 'Array of role IDs is required' });
        }

        const service = await initService();
        const result = await service.deleteByRoleIds(roleIds);
        
        if (result.success) {
            res.status(200).json({ message: 'Multiple roles removed from all accounts successfully' });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in DELETE /account-roles/bulk/roles:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
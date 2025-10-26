import express from "express";
import AccountRoleService from "../services/AccountRoleService.js";
import { AccountRole } from "../index.js";

const router = express.Router();

// GET /api/account-roles - Get all account roles
router.get("/", async (req, res) => {
    try {
        const service = new AccountRoleService();
        const result = await service.getAllAccountRoles();
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/account-roles/account/:accountId - Get roles for specific account
router.get("/account/:accountId", async (req, res) => {
    try {
        const accountId = parseInt(req.params.accountId);
        const service = new AccountRoleService();
        const result = await service.getByAccountId(accountId);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/account-roles/accounts?ids=1,2,3 - Get roles for multiple accounts
router.get("/accounts", async (req, res) => {
    try {
        const ids = req.query.ids;
        if (!ids || typeof ids !== 'string') {
            return res.status(400).json({ error: "Query parameter 'ids' is required" });
        }
        
        const accountIds = ids.split(",").map(id => parseInt(id.trim()));
        const service = new AccountRoleService();
        const result = await service.getByAccountIds(accountIds);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/account-roles/role/:roleId - Get accounts with specific role
router.get("/role/:roleId", async (req, res) => {
    try {
        const roleId = parseInt(req.params.roleId);
        const service = new AccountRoleService();
        const result = await service.getByRoleId(roleId);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/account-roles/roles?ids=1,2,3 - Get accounts for multiple roles
router.get("/roles", async (req, res) => {
    try {
        const ids = req.query.ids;
        if (!ids || typeof ids !== 'string') {
            return res.status(400).json({ error: "Query parameter 'ids' is required" });
        }
        
        const roleIds = ids.split(",").map(id => parseInt(id.trim()));
        const service = new AccountRoleService();
        const result = await service.getByRoleIds(roleIds);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/account-roles/account/:accountId/role/:roleId - Get specific account-role mapping
router.get("/account/:accountId/role/:roleId", async (req, res) => {
    try {
        const accountId = parseInt(req.params.accountId);
        const roleId = parseInt(req.params.roleId);
        const service = new AccountRoleService();
        const result = await service.getByAccountIdAndRoleId(accountId, roleId);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/account-roles/account/:accountId/has-role/:roleId - Check if account has role
router.get("/account/:accountId/has-role/:roleId", async (req, res) => {
    try {
        const accountId = parseInt(req.params.accountId);
        const roleId = parseInt(req.params.roleId);
        const service = new AccountRoleService();
        const result = await service.hasRole(accountId, roleId);
        result.success ? res.status(200).json({ hasRole: result.data }) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/account-roles/account/:accountId/role-ids - Get all role IDs for account
router.get("/account/:accountId/role-ids", async (req, res) => {
    try {
        const accountId = parseInt(req.params.accountId);
        const service = new AccountRoleService();
        const result = await service.getRoleIdsForAccount(accountId);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/account-roles/role/:roleId/account-ids - Get all account IDs for role
router.get("/role/:roleId/account-ids", async (req, res) => {
    try {
        const roleId = parseInt(req.params.roleId);
        const service = new AccountRoleService();
        const result = await service.getAccountIdsForRole(roleId);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/account-roles - Create single account-role mapping
router.post("/", async (req, res) => {
    try {
        const { account_id, role_id, assigned_date, assigned_by } = req.body;
        if (!account_id || !role_id) {
            return res.status(400).json({ error: "account_id and role_id are required" });
        }

        const accountRole = new AccountRole({ account_id, role_id, assigned_date, assigned_by });
        const service = new AccountRoleService();
        const result = await service.createAccountRole(accountRole);
        result.success ? res.status(201).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/account-roles/bulk - Create multiple account-role mappings
router.post("/bulk", async (req, res) => {
    try {
        const { accountRoles } = req.body;
        if (!Array.isArray(accountRoles) || accountRoles.length === 0) {
            return res.status(400).json({ error: "accountRoles array is required and cannot be empty" });
        }

        const accountRoleObjects = accountRoles.map(ar => new AccountRole(ar));
        const service = new AccountRoleService();
        const result = await service.createAccountRoles(accountRoleObjects);
        result.success ? res.status(201).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/account-roles/account/:accountId/assign-roles - Assign multiple roles to account
router.post("/account/:accountId/assign-roles", async (req, res) => {
    try {
        const accountId = parseInt(req.params.accountId);
        const { roleIds } = req.body;
        
        if (!Array.isArray(roleIds) || roleIds.length === 0) {
            return res.status(400).json({ error: "roleIds array is required and cannot be empty" });
        }

        const service = new AccountRoleService();
        const result = await service.assignRolesToAccount(accountId, roleIds);
        result.success ? res.status(201).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/account-roles/role/:roleId/assign-accounts - Assign role to multiple accounts
router.post("/role/:roleId/assign-accounts", async (req, res) => {
    try {
        const roleId = parseInt(req.params.roleId);
        const { accountIds } = req.body;
        
        if (!Array.isArray(accountIds) || accountIds.length === 0) {
            return res.status(400).json({ error: "accountIds array is required and cannot be empty" });
        }

        const service = new AccountRoleService();
        const result = await service.assignRoleToAccounts(accountIds, roleId);
        result.success ? res.status(201).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/account-roles/account/:accountId - Delete all roles for account
router.delete("/account/:accountId", async (req, res) => {
    try {
        const accountId = parseInt(req.params.accountId);
        const service = new AccountRoleService();
        const result = await service.deleteByAccountId(accountId);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/account-roles/role/:roleId - Delete all accounts for role
router.delete("/role/:roleId", async (req, res) => {
    try {
        const roleId = parseInt(req.params.roleId);
        const service = new AccountRoleService();
        const result = await service.deleteByRoleId(roleId);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/account-roles/account/:accountId/role/:roleId - Delete specific account-role mapping
router.delete("/account/:accountId/role/:roleId", async (req, res) => {
    try {
        const accountId = parseInt(req.params.accountId);
        const roleId = parseInt(req.params.roleId);
        const service = new AccountRoleService();
        const result = await service.deleteByAccountIdAndRoleId(accountId, roleId);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/account-roles/accounts?ids=1,2,3 - Delete all roles for multiple accounts
router.delete("/accounts", async (req, res) => {
    try {
        const ids = req.query.ids;
        if (!ids || typeof ids !== 'string') {
            return res.status(400).json({ error: "Query parameter 'ids' is required" });
        }
        
        const accountIds = ids.split(",").map(id => parseInt(id.trim()));
        const service = new AccountRoleService();
        const result = await service.deleteByAccountIds(accountIds);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/account-roles/roles?ids=1,2,3 - Delete all accounts for multiple roles
router.delete("/roles", async (req, res) => {
    try {
        const ids = req.query.ids;
        if (!ids || typeof ids !== 'string') {
            return res.status(400).json({ error: "Query parameter 'ids' is required" });
        }
        
        const roleIds = ids.split(",").map(id => parseInt(id.trim()));
        const service = new AccountRoleService();
        const result = await service.deleteByRoleIds(roleIds);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

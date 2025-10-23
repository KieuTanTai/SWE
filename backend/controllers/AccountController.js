import express from "express";
import AccountService from "../services/AccountService.js";
import { Account } from "../models/index.js";

const router = express.Router();

// GET /api/accounts - Get all accounts
router.get("/", async (req, res) => {
    try {
        const service = new AccountService();
        const result = await service.getAllAccounts();
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/accounts/:accountId - Get account by ID
router.get("/:accountId", async (req, res) => {
    try {
        const accountId = parseInt(req.params.accountId);
        const service = new AccountService();
        const result = await service.getByAccountId(accountId);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/accounts/batch?ids=1,2,3 - Get accounts by multiple IDs
router.get("/batch/ids", async (req, res) => {
    try {
        const ids = req.query.ids;
        if (!ids || typeof ids !== 'string') {
            return res.status(400).json({ error: "Query parameter 'ids' is required" });
        }
        
        const accountIds = ids.split(",").map(id => parseInt(id.trim()));
        const service = new AccountService();
        const result = await service.getByAccountIds(accountIds);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/accounts/email/:email - Get account by email
router.get("/email/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const service = new AccountService();
        const result = await service.getByEmail(email);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/accounts/batch/emails?emails=a@b.com,c@d.com - Get accounts by multiple emails
router.get("/batch/emails", async (req, res) => {
    try {
        const emails = req.query.emails;
        if (!emails || typeof emails !== 'string') {
            return res.status(400).json({ error: "Query parameter 'emails' is required" });
        }
        
        const emailArray = emails.split(",").map(e => e.trim());
        const service = new AccountService();
        const result = await service.getByEmails(emailArray);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/accounts/login-status/:status - Get accounts by login status
router.get("/login-status/:status", async (req, res) => {
    try {
        const loginStatus = req.params.status === 'true';
        const service = new AccountService();
        const result = await service.getByLoginStatus(loginStatus);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/accounts - Create single account
router.post("/", async (req, res) => {
    try {
        const { account_email, account_password, account_login_status } = req.body;
        if (!account_email || !account_password) {
            return res.status(400).json({ error: "account_email and account_password are required" });
        }

        const account = new Account({ account_email, account_password, account_login_status });
        const service = new AccountService();
        const result = await service.createAccount(account);
        result.success ? res.status(201).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/accounts/bulk - Create multiple accounts
router.post("/bulk", async (req, res) => {
    try {
        const { accounts } = req.body;
        if (!Array.isArray(accounts) || accounts.length === 0) {
            return res.status(400).json({ error: "accounts array is required and cannot be empty" });
        }

        const accountObjects = accounts.map(acc => new Account(acc));
        const service = new AccountService();
        const result = await service.createAccounts(accountObjects);
        result.success ? res.status(201).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/accounts/:accountId/email - Update account email
router.put("/:accountId/email", async (req, res) => {
    try {
        const accountId = parseInt(req.params.accountId);
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: "email is required" });
        }

        const service = new AccountService();
        const result = await service.updateEmail(accountId, email);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/accounts/:accountId/password - Update account password
router.put("/:accountId/password", async (req, res) => {
    try {
        const accountId = parseInt(req.params.accountId);
        const { password } = req.body;
        
        if (!password) {
            return res.status(400).json({ error: "password is required" });
        }

        const service = new AccountService();
        const result = await service.updatePassword(accountId, password);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/accounts/:accountId/login-status - Update account login status
router.put("/:accountId/login-status", async (req, res) => {
    try {
        const accountId = parseInt(req.params.accountId);
        const { login_status } = req.body;
        
        if (typeof login_status !== 'boolean') {
            return res.status(400).json({ error: "login_status (boolean) is required" });
        }

        const service = new AccountService();
        const result = await service.updateLoginStatus(accountId, login_status);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/accounts/bulk/emails - Update emails of multiple accounts
router.put("/bulk/emails", async (req, res) => {
    try {
        const { accounts } = req.body;
        if (!Array.isArray(accounts) || accounts.length === 0) {
            return res.status(400).json({ error: "accounts array is required and cannot be empty" });
        }

        const service = new AccountService();
        const result = await service.updateEmails(accounts);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/accounts/bulk/passwords - Update passwords of multiple accounts
router.put("/bulk/passwords", async (req, res) => {
    try {
        const { accounts } = req.body;
        if (!Array.isArray(accounts) || accounts.length === 0) {
            return res.status(400).json({ error: "accounts array is required and cannot be empty" });
        }

        const service = new AccountService();
        const result = await service.updatePasswords(accounts);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/accounts/bulk/login-statuses - Update login statuses of multiple accounts
router.put("/bulk/login-statuses", async (req, res) => {
    try {
        const { accounts } = req.body;
        if (!Array.isArray(accounts) || accounts.length === 0) {
            return res.status(400).json({ error: "accounts array is required and cannot be empty" });
        }

        const service = new AccountService();
        const result = await service.updateLoginStatuses(accounts);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

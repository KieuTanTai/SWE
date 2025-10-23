import express from "express";
import Connection from "../infrastructure/connection/getConnection.js";
import AccountDAO from "../infrastructure/data/accountDAO.js";
import AccountService from "../services/AccountService.js";

const router = express.Router();

/**
 * Initialize service with database connection
 * @returns {Promise<AccountService>}
 */
async function initService() {
    const conn = new Connection('./config.json');
    const pool = await conn.connect();
    const connection = await pool.getConnection();
    const accountDAO = new AccountDAO(connection);
    return new AccountService(accountDAO);
}

/**
 * GET /api/accounts
 * Get all accounts
 */
router.get('/', async (req, res) => {
    try {
        const service = await initService();
        const result = await service.getAllAccounts();
        
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in GET /accounts:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/accounts/:id
 * Get account by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const accountId = parseInt(req.params.id);
        if (isNaN(accountId)) {
            return res.status(400).json({ error: 'Invalid account ID' });
        }

        const service = await initService();
        const result = await service.getByAccountId(accountId);
        
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(404).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in GET /accounts/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/accounts/email/:email
 * Get account by email
 */
router.get('/email/:email', async (req, res) => {
    try {
        const email = String(req.params.email);
        if (!email || email.trim() === '') {
            return res.status(400).json({ error: 'Email is required' });
        }

        const service = await initService();
        const result = await service.getByEmail(email);
        
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(404).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in GET /accounts/email/:email:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/accounts/login-status/:status
 * Get accounts by login status
 */
router.get('/login-status/:status', async (req, res) => {
    try {
        const status = req.params.status === 'true';
        const service = await initService();
        const result = await service.getByLoginStatus(status);
        
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in GET /accounts/login-status/:status:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/accounts
 * Create a new account
 */
router.post('/', async (req, res) => {
    try {
        const accountData = req.body;
        if (!accountData.account_email || !accountData.account_password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const service = await initService();
        const result = await service.createAccount(accountData);
        
        if (result.success) {
            res.status(201).json(result.data);
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in POST /accounts:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/accounts/bulk
 * Create multiple accounts
 */
router.post('/bulk', async (req, res) => {
    try {
        const accounts = req.body;
        if (!Array.isArray(accounts) || accounts.length === 0) {
            return res.status(400).json({ error: 'Array of accounts is required' });
        }

        const service = await initService();
        const result = await service.createAccounts(accounts);
        
        if (result.success) {
            res.status(201).json(result.data);
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in POST /accounts/bulk:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * PATCH /api/accounts/:id/email
 * Update account email
 */
router.patch('/:id/email', async (req, res) => {
    try {
        const accountId = parseInt(req.params.id);
        const { email } = req.body;
        
        if (isNaN(accountId)) {
            return res.status(400).json({ error: 'Invalid account ID' });
        }
        if (!email || email.trim() === '') {
            return res.status(400).json({ error: 'Email is required' });
        }

        const service = await initService();
        const result = await service.updateEmail(accountId, email);
        
        if (result.success) {
            res.status(200).json({ message: 'Email updated successfully' });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in PATCH /accounts/:id/email:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * PATCH /api/accounts/:id/password
 * Update account password
 */
router.patch('/:id/password', async (req, res) => {
    try {
        const accountId = parseInt(req.params.id);
        const { password } = req.body;
        
        if (isNaN(accountId)) {
            return res.status(400).json({ error: 'Invalid account ID' });
        }
        if (!password || password.trim() === '') {
            return res.status(400).json({ error: 'Password is required' });
        }

        const service = await initService();
        const result = await service.updatePassword(accountId, password);
        
        if (result.success) {
            res.status(200).json({ message: 'Password updated successfully' });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in PATCH /accounts/:id/password:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * PATCH /api/accounts/:id/login-status
 * Update account login status
 */
router.patch('/:id/login-status', async (req, res) => {
    try {
        const accountId = parseInt(req.params.id);
        const { loginStatus } = req.body;

        if (isNaN(accountId)) {
            return res.status(400).json({ error: 'Invalid account ID' });
        }
        if (typeof loginStatus !== 'boolean') {
            return res.status(400).json({ error: 'Login status must be a boolean' });
        }

        const service = await initService();
        const result = await service.updateLoginStatus(accountId, loginStatus);
        
        if (result.success) {
            res.status(200).json({ message: 'Login status updated successfully' });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in PATCH /accounts/:id/login-status:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * PATCH /api/accounts/batch/email
 * Batch update account emails
 */
router.patch('/batch/email', async (req, res) => {
    try {
        const accounts = req.body;
        if (!Array.isArray(accounts) || accounts.length === 0) {
            return res.status(400).json({ error: 'Array of accounts is required' });
        }

        const service = await initService();
        const result = await service.updateEmails(accounts);
        
        if (result.success) {
            res.status(200).json({ message: 'Emails updated successfully' });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in PATCH /accounts/batch/email:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * PATCH /api/accounts/batch/password
 * Batch update account passwords
 */
router.patch('/batch/password', async (req, res) => {
    try {
        const accounts = req.body;
        if (!Array.isArray(accounts) || accounts.length === 0) {
            return res.status(400).json({ error: 'Array of accounts is required' });
        }

        const service = await initService();
        const result = await service.updatePasswords(accounts);
        
        if (result.success) {
            res.status(200).json({ message: 'Passwords updated successfully' });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in PATCH /accounts/batch/password:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * PATCH /api/accounts/batch/login-status
 * Batch update account login statuses
 */
router.patch('/batch/login-status', async (req, res) => {
    try {
        const accounts = req.body;
        if (!Array.isArray(accounts) || accounts.length === 0) {
            return res.status(400).json({ error: 'Array of accounts is required' });
        }

        const service = await initService();
        const result = await service.updateLoginStatuses(accounts);
        
        if (result.success) {
            res.status(200).json({ message: 'Login statuses updated successfully' });
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Error in PATCH /accounts/batch/login-status:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
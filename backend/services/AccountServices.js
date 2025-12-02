import { default as AccountDAO } from "../infrastructure/data/accountDAO.js";
import Account from "../models/Account.js";
import { withConnection, withTransaction } from "../infrastructure/connection/transactionHelper.js";
import { comparePassword, hashPassword } from "../utils/passwordHash.js";
import ServiceResponse from "../utils/ServiceResponse.js";
import AccountRoleDAO from "../infrastructure/data/accountRoleDAO.js";
import AccountRole from "../models/AccountRole.js";
import PersonDAO from "../infrastructure/data/personDAO.js";

/**
 * AccountServices
 * Service layer for managing accounts
 * Manages its own database connections and transactions
 */
class AccountServices {

    /**
     *
     *
     * @param {string} email
     * @param {string} password
     * @return {Promise<ServiceResponse>} 
     * @memberof AccountServices
     */
    async login(email, password) {
        try {
            if (!email || typeof email !== 'string')
                return ServiceResponse.failure('Invalid email');

            if (!password || typeof password !== 'string') {
                return ServiceResponse.failure('Invalid password');
            }

            let result = await withConnection(async (connection) => {
                const repo = new AccountDAO(connection);
                const personRepo = new PersonDAO(connection);

                const account = await repo.getByEmail(email);
                const person = await personRepo.getByAccountId(account.account_id);
                account.person = person;
                return account;
            });
            
            // Check if account exists (DAO returns empty Account object if not found)
            if (!result || !result.account_id || !result.account_password) {
                return ServiceResponse.failure('Authentication failed');
            }

            // Verify password
            const isPasswordValid = await comparePassword(password, result.account_password);
            if (!isPasswordValid) {
                return ServiceResponse.failure('Authentication failed');
            }

            // Get account roles
            result.roles = await withConnection(async (connection) => {
                const repo = new AccountRoleDAO(connection);
                return await repo.getByAccountId(result.account_id);
            });

            return ServiceResponse.success(result);
        } catch (error) {
            return ServiceResponse.failure(error.message);
        }
    }

    /**
     * Get all accounts
     * @return {Promise<ServiceResponse>}
     */
    async getAllAccounts() {
        try {
            const results = await withConnection(async (connection) => {
                const repo = new AccountDAO(connection);
                return await repo.getAllAccounts();
            });
            return ServiceResponse.success(results);
        } catch (error) {
            return ServiceResponse.failure(error.message);
        }
    }

    /**
     * Get account by ID
     * @param {number} accountId
     * @return {Promise<ServiceResponse>}
     */
    async getByAccountId(accountId) {
        try {
            if (!accountId || !Number.isInteger(accountId)) {
                return ServiceResponse.validationError('accountId');
            }

            const result = await withConnection(async (connection) => {
                const repo = new AccountDAO(connection);
                return await repo.getByAccountId(accountId);
            });
            // Lấy roles cho account
            if (result && result.account_id) {
                result.roles = await withConnection(async (connection) => {
                    const repo = new AccountRoleDAO(connection);
                    return await repo.getByAccountId(result.account_id);
                });
            }
            return ServiceResponse.success(result);
        } catch (error) {
            return ServiceResponse.failure(error.message);
        }
    }

    /**
     * Get accounts by multiple IDs
     * @param {number[]} accountIds
     * @return {Promise<ServiceResponse>}
     */
    async getByAccountIds(accountIds) {
        try {
            if (!Array.isArray(accountIds) || accountIds.length === 0) {
                return ServiceResponse.validationError('accountIds', 'must be a non-empty array');
            }

            const results = await withConnection(async (connection) => {
                const repo = new AccountDAO(connection);
                return await repo.getByAccountIds(accountIds);
            });
            
            return ServiceResponse.success(results);
        } catch (error) {
            return ServiceResponse.failure(error.message);
        }
    }

    /**
     * Get account by email
     * @param {string} email
     * @return {Promise<ServiceResponse>}
     */
    async getByEmail(email) {
        try {
            if (!email || typeof email !== 'string') {
                return ServiceResponse.validationError('email');
            }

            const result = await withConnection(async (connection) => {
                const repo = new AccountDAO(connection);
                return await repo.getByEmail(email);
            });
            
            return ServiceResponse.success(result);
        } catch (error) {
            return ServiceResponse.failure(error.message);
        }
    }

    /**
     * Get accounts by multiple emails
     * @param {string[]} emails
     * @return {Promise<ServiceResponse>}
     */
    async getByEmails(emails) {
        try {
            if (!Array.isArray(emails) || emails.length === 0) {
                return ServiceResponse.validationError('emails', 'must be a non-empty array');
            }

            const results = await withConnection(async (connection) => {
                const repo = new AccountDAO(connection);
                return await repo.getByEmails(emails);
            });
            
            return ServiceResponse.success(results);
        } catch (error) {
            return ServiceResponse.failure(error.message);
        }
    }

    /**
     * Get accounts by login status
     * @param {boolean} loginStatus
     * @return {Promise<ServiceResponse>}
     */
    async getByLoginStatus(loginStatus) {
        try {
            if (typeof loginStatus !== 'boolean') {
                return ServiceResponse.validationError('loginStatus');
            }

            const results = await withConnection(async (connection) => {
                const repo = new AccountDAO(connection);
                return await repo.getByLoginStatus(loginStatus);
            });
            
            return ServiceResponse.success(results);
        } catch (error) {
            return ServiceResponse.failure(error.message);
        }
    }

    /**
     * Create a new account
     * @param {Account} account
     * @return {Promise<ServiceResponse>}
     */
    async createAccount(account) {
        try {
            if (!(account instanceof Account)) {
                return ServiceResponse.validationError('account', 'must be an Account instance');
            }

            // Hash password before saving
            if (account.account_password) {
                account.account_password = await hashPassword(account.account_password);
            }


            // Create a new Account instance with only DB columns
            const dbAccount = new Account({
                account_email: account.account_email,
                account_password: account.account_password,
                account_create_date: account.account_create_date,
                account_last_updated_date: account.account_last_updated_date,
                account_login_status: account.account_login_status
            });

            const result = await withTransaction(async (connection) => {
                const repo = new AccountDAO(connection);
                return await repo.createAccount(dbAccount);
            });

            if (result === -1) {
                return ServiceResponse.failure('Failed to create account');
            }

            // Gán role mặc định là 4 (parent) cho account vừa tạo
            await withTransaction(async (connection) => {
                const accountRoleRepo = new AccountRoleDAO(connection);
                const assignedDate = new Date();
                const accountRole = new AccountRole({
                    account_id: result,
                    role_id: 4, // role 4 = parent
                    assigned_date: assignedDate,
                    assigned_by: null,
                });
                await accountRoleRepo.createAccountRole(accountRole);
            });

            return ServiceResponse.success(result);
        } catch (error) {
            return ServiceResponse.failure(error.message);
        }
    }

    /**
     * Create multiple accounts
     * @param {Account[]} accounts
     * @return {Promise<ServiceResponse>}
     */
    async createAccounts(accounts) {
        try {
            if (!Array.isArray(accounts) || accounts.length === 0) {
                return ServiceResponse.validationError('accounts', 'must be a non-empty array');
            }

            // Hash passwords for all accounts before saving
            for (const account of accounts) {
                if (account.account_password) {
                    account.account_password = await hashPassword(account.account_password);
                }
            }

            const result = await withTransaction(async (connection) => {
                const repo = new AccountDAO(connection);
                return await repo.createAccounts(accounts);
            });
            
            if (result === -1) {
                return ServiceResponse.failure('Failed to create accounts');
            }

            return ServiceResponse.success(result);
        } catch (error) {
            return ServiceResponse.failure(error.message);
        }
    }

    /**
     * Update account email
     * @param {number} accountId
     * @param {string} newEmail
     * @return {Promise<ServiceResponse>}
     */
    async updateEmail(accountId, newEmail) {
        try {
            if (!accountId || !Number.isInteger(accountId)) {
                return ServiceResponse.validationError('accountId');
            }

            if (!newEmail || typeof newEmail !== 'string') {
                return ServiceResponse.validationError('newEmail');
            }

            const result = await withTransaction(async (connection) => {
                const repo = new AccountDAO(connection);
                return await repo.updateEmail(accountId, newEmail);
            });
            
            if (result === -1) {
                return ServiceResponse.failure('Failed to update email');
            }

            return ServiceResponse.success(result);
        } catch (error) {
            return ServiceResponse.failure(error.message);
        }
    }

    /**
     * Update account password
     * @param {number} accountId
     * @param {string} newPassword
     * @return {Promise<ServiceResponse>}
     */
    async updatePassword(accountId, newPassword) {
        try {
            if (!accountId || !Number.isInteger(accountId)) {
                return ServiceResponse.validationError('accountId');
            }

            if (!newPassword || typeof newPassword !== 'string') {
                return ServiceResponse.validationError('newPassword');
            }

            // Hash the new password before updating
            const hashedPassword = await hashPassword(newPassword);

            const result = await withTransaction(async (connection) => {
                const repo = new AccountDAO(connection);
                return await repo.updatePassword(accountId, hashedPassword);
            });
            
            if (result === -1) {
                return ServiceResponse.failure('Failed to update password');
            }

            return ServiceResponse.success(result);
        } catch (error) {
            return ServiceResponse.failure(error.message);
        }
    }

    /**
     * Update account login status
     * @param {number} accountId
     * @param {boolean} loginStatus
     * @return {Promise<ServiceResponse>}
     */
    async updateLoginStatus(accountId, loginStatus) {
        try {
            if (!accountId || !Number.isInteger(accountId)) {
                return ServiceResponse.validationError('accountId');
            }

            if (typeof loginStatus !== 'boolean') {
                return ServiceResponse.validationError('loginStatus');
            }

            const result = await withTransaction(async (connection) => {
                const repo = new AccountDAO(connection);
                return await repo.updateLoginStatus(accountId, loginStatus);
            });
            
            if (result === -1) {
                return ServiceResponse.failure('Failed to update login status');
            }

            return ServiceResponse.success(result);
        } catch (error) {
            return ServiceResponse.failure(error.message);
        }
    }

    /**
     * Update emails of multiple accounts
     * @param {Array<{account_id: number, account_email: string}>} accounts - Plain objects with snake_case properties
     * @return {Promise<ServiceResponse>}
     */
    async updateEmails(accounts) {
        try {
            if (!Array.isArray(accounts) || accounts.length === 0) {
                return ServiceResponse.validationError('accounts', 'must be a non-empty array');
            }

            const result = await withTransaction(async (connection) => {
                const repo = new AccountDAO(connection);
                return await repo.updateEmails(accounts);
            });
            
            if (result === -1) {
                return ServiceResponse.failure('Failed to update emails');
            }

            return ServiceResponse.success(result);
        } catch (error) {
            return ServiceResponse.failure(error.message);
        }
    }
    /**
     * Update passwords of multiple accounts
     * @param {Array<{account_id: number, account_password: string}>} accounts - Plain objects with snake_case properties
     * @return {Promise<ServiceResponse>}
     */
    async updatePasswords(accounts) {
        try {
            if (!Array.isArray(accounts) || accounts.length === 0) {
                return ServiceResponse.validationError('accounts', 'must be a non-empty array');
            }

            // Hash all passwords before updating
            for (const account of accounts) {
                if (account.account_password) {
                    account.account_password = await hashPassword(account.account_password);
                }
            }

            const result = await withTransaction(async (connection) => {
                const repo = new AccountDAO(connection);
                return await repo.updatePasswords(accounts);
            });
            
            if (result === -1) {
                return ServiceResponse.failure('Failed to update passwords');
            }

            return ServiceResponse.success(result);
        } catch (error) {
            return ServiceResponse.failure(error.message);
        }
    }

    /**
     * Update login statuses of multiple accounts
     * @param {Array<{account_id: number, account_login_status: boolean}>} accounts - Plain objects with snake_case properties
     * @return {Promise<ServiceResponse>}
     */
    async updateLoginStatuses(accounts) {
        try {
            if (!Array.isArray(accounts) || accounts.length === 0) {
                return ServiceResponse.validationError('accounts', 'must be a non-empty array');
            }

            const result = await withTransaction(async (connection) => {
                const repo = new AccountDAO(connection);
                return await repo.updateLoginStatuses(accounts);
            });
            
            if (result === -1) {
                return ServiceResponse.failure('Failed to update login statuses');
            }

            return ServiceResponse.success(result);
        } catch (error) {
            return ServiceResponse.failure(error.message);
        }
    }
}

export default AccountServices;
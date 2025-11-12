import Account from "../../models/Account.js";
import { default as BaseDAO } from "./baseDAO.js";
import * as dbSchema from "./dbSchema.js";
import mySql from "mysql2/promise";

class AccountDAO extends BaseDAO {
    /**
     * Creates an instance of AccountDAO.
     * @param connection - MySQL pool connection
     */
    constructor(connection: mySql.PoolConnection) {
        super(connection, "Account", dbSchema.ACCOUNT_COLUMNS.ACCOUNT_ID);
    }

    /**
     * Get all accounts
     * @returns Array of Account objects
     */
    async getAllAccounts(): Promise<Account[]> {
        try {
            const results = await this._protectedGetAll();
            if (!results || results.length === 0) {
                console.warn(`Warning: No accounts found`);
                return [];
            }
            return results.map(item => Account.fromDatabase(item));
        } catch (error: any) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get account by ID
     * @param accountId - Account ID to search for
     * @returns Account object or empty Account if not found
     */
    async getByAccountId(accountId: number): Promise<Account> {
        if (accountId === null || accountId === undefined || !Number.isInteger(accountId)) {
            console.warn(`Warning: accountId is invalid : ${accountId}`);
            return new Account();
        }

        try {
            if (accountId <= 0) {
                console.warn(`Warning: accountId must be greater than zero : ${accountId}`);
                return new Account();
            }

            const result = await this._protectedGetById(accountId);
            if (!result) {
                console.warn(`Warning: No data found for accountId ${accountId}`);
                return new Account();
            }
            return Account.fromDatabase(result);
        } catch (error: any) {
            console.error(`Error: ${error.message}`);
            return new Account();
        }
    }

    /**
     * Get accounts by multiple IDs
     * @param accountIds - Array of account IDs
     * @returns Array of Account objects
     */
    async getByAccountIds(accountIds: number[]): Promise<Account[]> {
        if (!Array.isArray(accountIds) || accountIds.length === 0) {
            console.warn(`Warning: accountIds must be a non-empty array`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(
                ["*"],
                accountIds,
                `WHERE ${dbSchema.ACCOUNT_COLUMNS.ACCOUNT_ID} IN (${accountIds.map(() => "?").join(",")})`,
            );
            if (!results || results.length === 0) {
                console.warn(`Warning: No accounts found for accountIds ${accountIds}`);
                return [];
            }
            return results.map(item => Account.fromDatabase(item));
        } catch (error: any) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get account by email
     * @param email - Email address to search for
     * @returns Account object or empty Account if not found
     */
    async getByEmail(email: string): Promise<Account> {
        if (!email || typeof email !== 'string' || email.trim() === '') {
            console.warn(`Warning: email is invalid : ${email}`);
            return new Account();
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [email],
                `WHERE ${dbSchema.ACCOUNT_COLUMNS.ACCOUNT_EMAIL} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No account found for email ${email}`);
                return new Account();
            }
            return Account.fromDatabase(results[0]);
        } catch (error: any) {
            console.error(`Error: ${error.message}`);
            return new Account();
        }
    }

    /**
     * Get accounts by multiple emails
     * @param emails - Array of email addresses
     * @returns Array of Account objects
     */
    async getByEmails(emails: string[]): Promise<Account[]> {
        if (!Array.isArray(emails) || emails.length === 0) {
            console.warn(`Warning: emails must be a non-empty array`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(
                ["*"],
                emails,
                `WHERE ${dbSchema.ACCOUNT_COLUMNS.ACCOUNT_EMAIL} IN (${emails.map(() => "?").join(",")})`,
            );
            if (!results || results.length === 0) {
                console.warn(`Warning: No accounts found for emails ${emails}`);
                return [];
            }
            return results.map(item => Account.fromDatabase(item));
        } catch (error: any) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get accounts by login status
     * @param loginStatus - Login status to filter by
     * @returns Array of Account objects
     */
    async getByLoginStatus(loginStatus: boolean): Promise<Account[]> {
        if (loginStatus === null || loginStatus === undefined || typeof loginStatus !== 'boolean') {
            console.warn(`Warning: loginStatus is invalid : ${loginStatus}`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [loginStatus],
                `WHERE ${dbSchema.ACCOUNT_COLUMNS.ACCOUNT_LOGIN_STATUS} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No accounts found for loginStatus ${loginStatus}`);
                return [];
            }
            return results.map(item => Account.fromDatabase(item));
        } catch (error: any) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Create a new account
     * @param account - Account object to create
     * @returns Insert ID or -1 if failed
     */
    async createAccount(account: Account): Promise<number> {
        if (!(account instanceof Account)) {
            console.warn(`Warning: Invalid account object`);
            return -1;
        }

        try {
            const result = await this._protectedCreate(account);
            return result;
        } catch (error: any) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Create multiple accounts
     * @param accounts - Array of Account objects
     * @returns Array of insert IDs or -1 if failed
     */
    async createAccounts(accounts: Account[]): Promise<number[] | number> {
        if (!Array.isArray(accounts) || accounts.length === 0) {
            console.warn(`Warning: accounts must be a non-empty array`);
            return -1;
        }

        try {
            const valueInserts = accounts.map(account => ({
                [dbSchema.ACCOUNT_COLUMNS.ACCOUNT_EMAIL]: account[dbSchema.ACCOUNT_COLUMNS.ACCOUNT_EMAIL as keyof Account],
                [dbSchema.ACCOUNT_COLUMNS.ACCOUNT_PASSWORD]: account[dbSchema.ACCOUNT_COLUMNS.ACCOUNT_PASSWORD as keyof Account],
                [dbSchema.ACCOUNT_COLUMNS.ACCOUNT_LOGIN_STATUS]: account[dbSchema.ACCOUNT_COLUMNS.ACCOUNT_LOGIN_STATUS as keyof Account]
            }));
            const result = await this._protectedMultiCreate(
                [
                    dbSchema.ACCOUNT_COLUMNS.ACCOUNT_EMAIL,
                    dbSchema.ACCOUNT_COLUMNS.ACCOUNT_PASSWORD,
                    dbSchema.ACCOUNT_COLUMNS.ACCOUNT_LOGIN_STATUS
                ],
                valueInserts
            );
            return result;
        } catch (error: any) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Private method to update a single account
     * @param account - Account object with updated values
     * @returns Number of affected rows or -1 if failed
     */
    async #updateAccount(account: Account): Promise<number> {
        if (!account) {
            console.warn(`Warning: Invalid account: ${account}`);
            return -1;
        }
        try {
            const result = await this._protectedUpdateById(account[dbSchema.ACCOUNT_COLUMNS.ACCOUNT_ID as keyof Account], account);
            return result;
        } catch (error: any) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Private method to update multiple accounts
     * @param accounts - Array of Account objects with updated values
     * @returns Number of affected rows or -1 if failed
     */
    async #updateAccounts(accounts: Account[]): Promise<number> {
        if (!Array.isArray(accounts) || accounts.length === 0) {
            console.warn(`Warning: accounts must be a non-empty array`);
            return -1;
        }

        try {
            const result = await this._protectedMultiUpdateById(accounts);
            return result;
        } catch (error: any) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update account email
     * @param accountId - Account ID to update
     * @param newEmail - New email address
     * @returns Number of affected rows or -1 if failed
     */
    async updateEmail(accountId: number, newEmail: string): Promise<number> {
        if (!accountId || !newEmail || typeof newEmail !== 'string') {
            console.warn(`Warning: Invalid accountId or newEmail`);
            return -1;
        }

        try {
            const result = await this.getByAccountId(accountId);
            if (!result) {
                console.warn(`Warning: No account found for accountId ${accountId}`);
                return -1;
            }
            if (result.account_email === newEmail) {
                console.info(`Info: Account email is already '${newEmail}' for accountId ${accountId}`);
                return 0;
            }
            result.account_email = newEmail;
            return await this.#updateAccount(result);
        } catch (error: any) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update account password
     * @param accountId - Account ID to update
     * @param newPassword - New password (should be hashed)
     * @returns Number of affected rows or -1 if failed
     */
    async updatePassword(accountId: number, newPassword: string): Promise<number> {
        if (!accountId || !newPassword || typeof newPassword !== 'string') {
            console.warn(`Warning: Invalid accountId or newPassword`);
            return -1;
        }

        try {
            const result = await this.getByAccountId(accountId);
            if (!result) {
                console.warn(`Warning: No account found for accountId ${accountId}`);
                return -1;
            }
            if (result.account_password === newPassword) {
                console.info(`Info: Account password is already the same for accountId ${accountId}`);
                return 0;
            }
            result.account_password = newPassword;
            return await this.#updateAccount(result);
        } catch (error: any) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update account login status
     * @param accountId - Account ID to update
     * @param loginStatus - New login status
     * @returns Number of affected rows or -1 if failed
     */
    async updateLoginStatus(accountId: number, loginStatus: boolean): Promise<number> {
        if (!accountId || typeof loginStatus !== 'boolean') {
            console.warn(`Warning: Invalid accountId or loginStatus`);
            return -1;
        }

        try {
            const result = await this.getByAccountId(accountId);
            if (!result) {
                console.warn(`Warning: No account found for accountId ${accountId}`);
                return -1;
            }
            if (result.account_login_status === loginStatus) {
                console.info(`Info: Account login status is already '${loginStatus}' for accountId ${accountId}`);
                return 0;
            }
            result.account_login_status = loginStatus;
            return await this.#updateAccount(result);
        } catch (error: any) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update emails of multiple accounts
     * @param accounts - Array of objects with account_id and account_email
     * @returns Number of affected rows or -1 if failed
     */
    async updateEmails(accounts: Array<{account_id: number, account_email: string}>): Promise<number> {
        if (!Array.isArray(accounts) || accounts.length === 0) {
            console.warn(`Warning: accounts must be a non-empty array`);
            return -1;
        }
        try {
            const formattedAccounts = accounts.map(account => new Account({
                [dbSchema.ACCOUNT_COLUMNS.ACCOUNT_ID]: account.account_id,
                [dbSchema.ACCOUNT_COLUMNS.ACCOUNT_EMAIL]: account.account_email
            }));
            return await this.#updateAccounts(formattedAccounts);
        } catch (error: any) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update passwords of multiple accounts
     * @param accounts - Array of objects with account_id and account_password
     * @returns Number of affected rows or -1 if failed
     */
    async updatePasswords(accounts: Array<{account_id: number, account_password: string}>): Promise<number> {
        if (!Array.isArray(accounts) || accounts.length === 0) {
            console.warn(`Warning: accounts must be a non-empty array`);
            return -1;
        }
        try {
            const formattedAccounts = accounts.map(account => new Account({
                [dbSchema.ACCOUNT_COLUMNS.ACCOUNT_ID]: account.account_id,
                [dbSchema.ACCOUNT_COLUMNS.ACCOUNT_PASSWORD]: account.account_password
            }));
            return await this.#updateAccounts(formattedAccounts);
        } catch (error: any) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update login statuses of multiple accounts
     * @param accounts - Array of objects with account_id and account_login_status
     * @returns Number of affected rows or -1 if failed
     */
    async updateLoginStatuses(accounts: Array<{account_id: number, account_login_status: boolean}>): Promise<number> {
        if (!Array.isArray(accounts) || accounts.length === 0) {
            console.warn(`Warning: accounts must be a non-empty array`);
            return -1;
        }
        try {
            const formattedAccounts = accounts.map(account => new Account({
                [dbSchema.ACCOUNT_COLUMNS.ACCOUNT_ID]: account.account_id,
                [dbSchema.ACCOUNT_COLUMNS.ACCOUNT_LOGIN_STATUS]: account.account_login_status
            }));
            return await this.#updateAccounts(formattedAccounts);
        } catch (error: any) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }
}

export default AccountDAO;

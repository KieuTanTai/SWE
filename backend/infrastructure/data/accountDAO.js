import Account from "../../models/Account.js";
import { default as BaseDAO } from "./baseDAO.js";
import dbSchema from "./dbSchema.js";
import mySql from "mysql2/promise";

class AccountDAO extends BaseDAO {
    /**
     * Creates an instance of AccountDAO.
     * @param {mySql.PoolConnection} connection
     * @memberof AccountDAO
     */
    constructor(connection) {
        super(connection, "Account", dbSchema.ACCOUNT_COLUMNS.ACCOUNT_ID);
    }

    /**
     * Get all accounts
     * @return {Promise<Account[]>} 
     * @memberof AccountDAO
     */
    async getAllAccounts() {
        try {
            const results = await this._protectedGetAll();
            if (!results || results.length === 0) {
                console.warn(`Warning: No accounts found`);
                return [];
            }
            return results.map(item => Account.fromDatabase(item));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get account by ID
     * @param {number} accountId
     * @return {Promise<Account>} 
     * @memberof AccountDAO
     */
    async getByAccountId(accountId) {
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
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return new Account();
        }
    }

    /**
     *
     *
     * @param {number[]} accountIds
     * @return {Promise<Account[]>}
     * @memberof AccountDAO
     */
    async getByAccountIds(accountIds) {
        if (!Array.isArray(accountIds) || accountIds.length === 0) {
            console.warn(`Warning: accountIds must be a non-empty array`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(
                ["*"],
                [accountIds.join(",")],
                `WHERE ${dbSchema.ACCOUNT_COLUMNS.ACCOUNT_ID} IN (${accountIds.map(() => "?").join(",")})`,
            );
            if (!results || results.length === 0) {
                console.warn(`Warning: No accounts found for accountIds ${accountIds}`);
                return [];
            }
            return results.map(item => Account.fromDatabase(item));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get account by email
     * @param {string} email
     * @return {Promise<Account>} 
     * @memberof AccountDAO
     */
    async getByEmail(email) {
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
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return new Account();
        }
    }

    /**
     *
     *
     * @param {string[]} emails
     * @return {Promise<Account[]>} 
     * @memberof AccountDAO
     */
    async getByEmails(emails) {
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
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get accounts by login status
     * @param {boolean} loginStatus
     * @return {Promise<Account[]>} 
     * @memberof AccountDAO
     */
    async getByLoginStatus(loginStatus) {
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
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Create a new account
     * @param {Account} account
     * @return {Promise<number>} 
     * @memberof AccountDAO
     */
    async createAccount(account) {
        if (!(account instanceof Account)) {
            console.warn(`Warning: Invalid account object`);
            return -1;
        }

        // Only pass DB columns
        const dbAccount = {
            account_email: account.account_email,
            account_password: account.account_password,
            account_create_date: account.account_create_date,
            account_last_updated_date: account.account_last_updated_date,
            account_login_status: account.account_login_status
        };

        try {
            const result = await this._protectedCreate(dbAccount);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     *
     *
     * @param {Account[]} accounts
     * @return {Promise<number|number[]>} 
     * @memberof AccountDAO
     */
    async createAccounts(accounts) {
        if (!Array.isArray(accounts) || accounts.length === 0) {
            console.warn(`Warning: accounts must be a non-empty array`);
            return -1;
        }

        try {
            const valueInserts = accounts.map(account => ([
                account[dbSchema.ACCOUNT_COLUMNS.ACCOUNT_EMAIL],
                account[dbSchema.ACCOUNT_COLUMNS.ACCOUNT_PASSWORD],
                account[dbSchema.ACCOUNT_COLUMNS.ACCOUNT_LOGIN_STATUS]
            ]));
            const result = await this._protectedMultiCreate(
                [
                    dbSchema.ACCOUNT_COLUMNS.ACCOUNT_EMAIL,
                    dbSchema.ACCOUNT_COLUMNS.ACCOUNT_PASSWORD,
                    dbSchema.ACCOUNT_COLUMNS.ACCOUNT_LOGIN_STATUS
                ],
                valueInserts
            );
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Private method to update a single account
     * @param {Account} account
     * @return {Promise<number>} 
     * @memberof AccountDAO
     */
    async #updateAccount(account) {
        if (!account) {
            console.warn(`Warning: Invalid account: ${account}`);
            return -1;
        }
        try {
            const result = await this._protectedUpdateById(account[dbSchema.ACCOUNT_COLUMNS.ACCOUNT_ID], account);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Private method to update multiple accounts
     * @param {Account[]} accounts
     * @return {Promise<number>} 
     * @memberof AccountDAO
     */
    async #updateAccounts(accounts) {
        if (!Array.isArray(accounts) || accounts.length === 0) {
            console.warn(`Warning: accounts must be a non-empty array`);
            return 1;
        }

        try {
            const result = await this._protectedMultiUpdateById(accounts);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update account email
     * @param {number} accountId
     * @param {string} newEmail
     * @return {Promise<number>} 
     * @memberof AccountDAO
     */
    async updateEmail(accountId, newEmail) {
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
            if (result[dbSchema.ACCOUNT_COLUMNS.ACCOUNT_EMAIL] === newEmail) {
                console.info(`Info: Account email is already '${newEmail}' for accountId ${accountId}`);
                return 0;
            }
            result[dbSchema.ACCOUNT_COLUMNS.ACCOUNT_EMAIL] = newEmail;
            return await this.#updateAccount(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update account password
     * @param {number} accountId
     * @param {string} newPassword
     * @return {Promise<number>} 
     * @memberof AccountDAO
     */
    async updatePassword(accountId, newPassword) {
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
            if (result[dbSchema.ACCOUNT_COLUMNS.ACCOUNT_PASSWORD] === newPassword) {
                console.info(`Info: Account password is already the same for accountId ${accountId}`);
                return 0;
            }
            result[dbSchema.ACCOUNT_COLUMNS.ACCOUNT_PASSWORD] = newPassword;
            return await this.#updateAccount(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update account login status
     * @param {number} accountId
     * @param {boolean} loginStatus
     * @return {Promise<number>} 
     * @memberof AccountDAO
     */
    async updateLoginStatus(accountId, loginStatus) {
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
            if (result[dbSchema.ACCOUNT_COLUMNS.ACCOUNT_LOGIN_STATUS] === loginStatus) {
                console.info(`Info: Account login status is already '${loginStatus}' for accountId ${accountId}`);
                return 0;
            }
            result[dbSchema.ACCOUNT_COLUMNS.ACCOUNT_LOGIN_STATUS] = loginStatus;
            return await this.#updateAccount(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update emails of multiple accounts
     * @param {Array<{account_id: number, account_email: string}>} accounts - Plain objects with snake_case properties
     * @return {Promise<number>} Number of affected rows or -1 if failed
     */
    async updateEmails(accounts) {
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
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update passwords of multiple accounts
     * @param {Array<{account_id: number, account_password: string}>} accounts - Plain objects with snake_case properties
     * @return {Promise<number>} Number of affected rows or -1 if failed
     */
    async updatePasswords(accounts) {
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
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update login statuses of multiple accounts
     * @param {Array<{account_id: number, account_login_status: boolean}>} accounts - Plain objects with snake_case properties
     * @return {Promise<number>} Number of affected rows or -1 if failed
     */
    async updateLoginStatuses(accounts) {
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
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }
}

export default AccountDAO;

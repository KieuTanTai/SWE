import Account from "../../models/Account.js";
import AccountRole from "../../models/AccountRole.js";
import { default as BaseDAO } from "./baseDAO.js";
import dbSchema from "./dbSchema.js";
import mySql from "mysql2/promise";

class AccountRoleDAO extends BaseDAO {
    /**
     * Creates an instance of AccountRoleDAO.
     * @param {mySql.PoolConnection} connection
     * @memberof AccountRoleDAO
     */
    constructor(connection) {
        super(connection, "Account_Role", dbSchema.ACCOUNT_ROLE_COLUMNS.ACCOUNT_ID);
    }

    /**
     * Get all account-role relationships
     * @return {Promise<AccountRole[]>} 
     * @memberof AccountRoleDAO
     */
    async getAllAccountRoles() {
        try {
            const results = await this._protectedGetAll();
            if (!results || results.length === 0) {
                console.warn(`Warning: No account-role relationships found`);
                return [];
            }
            return results.map(item => AccountRole.fromDatabase(item));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get account-role relationships by account ID
     * @param {number} accountId
     * @return {Promise<AccountRole[]>} 
     * @memberof AccountRoleDAO
     */
    async getByAccountId(accountId) {
        if (accountId === null || accountId === undefined || !Number.isInteger(accountId)) {
            console.warn(`Warning: accountId is invalid : ${accountId}`);
            return [];
        }

        try {
            if (accountId <= 0) {
                console.warn(`Warning: accountId must be greater than zero : ${accountId}`);
                return [];
            }

            const results = await this._protectedGetBySelection(["*"], [accountId],
                `WHERE ${dbSchema.ACCOUNT_ROLE_COLUMNS.ACCOUNT_ID} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No roles found for accountId ${accountId}`);
                return [];
            }
            return results.map(item => AccountRole.fromDatabase(item));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     *
     *
     * @param {number[]} accountIds
     * @return {Promise<AccountRole[]>} 
     * @memberof AccountRoleDAO
     */
    async getByAccountIds(accountIds) {
        if (!accountIds || !Array.isArray(accountIds) || accountIds.length === 0) {
            console.warn(`Warning: Invalid accountIds array`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(
                ["*"],
                accountIds,
                `WHERE ${dbSchema.ACCOUNT_ROLE_COLUMNS.ACCOUNT_ID} IN (?)`
            );
            if (!results || results.length === 0) {
                console.warn(`Warning: No roles found for provided accountIds`);
                return [];
            }
            return results.map(item => AccountRole.fromDatabase(item));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get account-role relationships by role ID
     * @param {number} roleId
     * @return {Promise<AccountRole[]>} 
     * @memberof AccountRoleDAO
     */
    async getByRoleId(roleId) {
        if (roleId === null || roleId === undefined || !Number.isInteger(roleId)) {
            console.warn(`Warning: roleId is invalid : ${roleId}`);
            return [];
        }

        try {
            if (roleId <= 0) {
                console.warn(`Warning: roleId must be greater than zero : ${roleId}`);
                return [];
            }

            const results = await this._protectedGetBySelection(["*"], [roleId],
                `WHERE ${dbSchema.ACCOUNT_ROLE_COLUMNS.ROLE_ID} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No accounts found for roleId ${roleId}`);
                return [];
            }
            return results.map(item => AccountRole.fromDatabase(item));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     *
     *
     * @param {number[]} roleIds
     * @return {Promise<AccountRole[]>}
     * @memberof AccountRoleDAO
     */
    async getByRoleIds(roleIds) {
        if (!roleIds || !Array.isArray(roleIds) || roleIds.length === 0) {
            console.warn(`Warning: Invalid roleIds array`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(
                ["*"],
                roleIds,
                `WHERE ${dbSchema.ACCOUNT_ROLE_COLUMNS.ROLE_ID} IN (?)`
            );
            if (!results || results.length === 0) {
                console.warn(`Warning: No accounts found for provided roleIds`);
                return [];
            }
            return results.map(item => AccountRole.fromDatabase(item));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get specific account-role relationship
     * @param {number} accountId
     * @param {number} roleId
     * @return {Promise<AccountRole>} 
     * @memberof AccountRoleDAO
     */
    async getByAccountIdAndRoleId(accountId, roleId) {
        if (!accountId || !roleId) {
            console.warn(`Warning: Invalid accountId or roleId`);
            return new AccountRole();
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [accountId, roleId],
                `WHERE ${dbSchema.ACCOUNT_ROLE_COLUMNS.ACCOUNT_ID} = ? AND ${dbSchema.ACCOUNT_ROLE_COLUMNS.ROLE_ID} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No relationship found for accountId ${accountId} and roleId ${roleId}`);
                return new AccountRole();
            }
            return results[0];
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return new AccountRole();
        }
    }

    /**
     * Create a new account-role relationship
     * @param {AccountRole} accountRole
     * @return {Promise<number>} 
     * @memberof AccountRoleDAO
     */
    async createAccountRole(accountRole) {
        if (!(accountRole instanceof AccountRole)) {
            console.warn(`Warning: Invalid accountRole object`);
            return -1;
        }

        if (!accountRole.account_id || !accountRole.role_id) {
            console.warn(`Warning: Missing required fields (account_id or role_id)`);
            return -1;
        }

        try {
            const result = await this._protectedCreate(accountRole);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     *
     *
     * @param {AccountRole[]} accountRoles
     * @return {Promise<number|number[]>} 
     * @memberof AccountRoleDAO
     */
    async createAccountRoles(accountRoles) {
        if (!Array.isArray(accountRoles) || accountRoles.length === 0) {
            console.warn(`Warning: accountRoles must be a non-empty array`);
            return -1;
        }
        try {
            const insertIds = [];
            const values = accountRoles.map(account => ({
                [dbSchema.ACCOUNT_ROLE_COLUMNS.ACCOUNT_ID]: account.account_id,
                [dbSchema.ACCOUNT_ROLE_COLUMNS.ROLE_ID]: account.role_id
            }));

            const result = await this._protectedMultiCreate([dbSchema.ACCOUNT_ROLE_COLUMNS.ACCOUNT_ID, dbSchema.ACCOUNT_ROLE_COLUMNS.ROLE_ID], values);
            return result;
        } catch (error) {
            console.error(`Error creating account roles: ${error.message}`);
            return -1;
        }
    }

    /**
     * Delete account-role relationship by account ID
     * @param {number} accountId
     * @return {Promise<number>} 
     * @memberof AccountRoleDAO
     */
    async deleteByAccountId(accountId) {
        if (!accountId || !Number.isInteger(accountId)) {
            console.warn(`Warning: Invalid accountId: ${accountId}`);
            return -1;
        }

        try {
            const result = await this._protectedDeleteById(accountId);
            return result;
        } catch (error) {
            console.error(`Error deleting account-role by accountId: ${error.message}`);
            return -1;
        }
    }

    /**
     * Delete account-role relationship by role ID
     * @param {number} roleId
     * @return {Promise<number>} 
     * @memberof AccountRoleDAO
     */
    async deleteByRoleId(roleId) {
        if (!roleId || !Number.isInteger(roleId)) {
            console.warn(`Warning: Invalid roleId: ${roleId}`);
            return -1;
        }
        try {
            const sql = `DELETE FROM ${this.tableName} WHERE ${dbSchema.ACCOUNT_ROLE_COLUMNS.ROLE_ID} = ?`;

            this.connection.beginTransaction();
            const [result] = await this.connection.execute(sql, [roleId]);

            if (result && typeof result === 'object' && 'affectedRows' in result) {
                this.connection.commit();
                return result.affectedRows;
            }
            this.connection.rollback();
            return -1;
        } catch (exception) {
            this.connection.rollback();
            console.error(`Error: ${exception.message}`);
            return -1;
        }
    }

    /**
     * Delete specific account-role relationship
     * @param {number} accountId
     * @param {number} roleId
     * @return {Promise<number>} 
     * @memberof AccountRoleDAO
     */
    async deleteByAccountIdAndRoleId(accountId, roleId) {
        if (!accountId || !roleId || !Number.isInteger(accountId) || !Number.isInteger(roleId)) {
            console.warn(`Warning: Invalid accountId or roleId`);
            return -1;
        }

        try {
            const query = `DELETE FROM Account_Role WHERE ${dbSchema.ACCOUNT_ROLE_COLUMNS.ACCOUNT_ID} = ? AND ${dbSchema.ACCOUNT_ROLE_COLUMNS.ROLE_ID} = ?`;
            this.connection.beginTransaction();
            const [result] = await this.connection.execute(query, [accountId, roleId]);
            if (result && typeof result === 'object' && 'affectedRows' in result) {
                this.connection.commit();
                return result.affectedRows;
            }
            this.connection.rollback();
            return -1;
        } catch (error) {
            this.connection.rollback();
            console.error(`Error deleting account-role by accountId and roleId: ${error.message}`);
            return -1;
        }
    }

    /**
     * Delete multiple account-role relationships by account IDs
     * @param {Array<number>} accountIds
     * @return {Promise<number>} 
     * @memberof AccountRoleDAO
     */
    async deleteByAccountIds(accountIds) {
        if (!accountIds || !Array.isArray(accountIds) || accountIds.length === 0) {
            console.warn(`Warning: Invalid accountIds array`);
            return -1;
        }

        try {
            const result = await this._protectedDeleteByIds(accountIds);
            return result;
        } catch (error) {
            console.error(`Error deleting account-roles by accountIds: ${error.message}`);
            return -1;
        }
    }

    /**
     * Delete multiple account-role relationships by role IDs
     * @param {Array<number>} roleIds
     * @return {Promise<number>} 
     * @memberof AccountRoleDAO
     */
    async deleteByRoleIds(roleIds) {
        if (!roleIds || !Array.isArray(roleIds) || roleIds.length === 0) {
            console.warn(`Warning: Invalid roleIds array`);
            return -1;
        }
        try {
            const sql = `DELETE FROM ${this.tableName} WHERE ${dbSchema.ACCOUNT_ROLE_COLUMNS.ROLE_ID} IN (?)`;
            this.connection.beginTransaction();
            const [results] = await this.connection.execute(sql, [roleIds]);

            if (results && typeof results === 'object' && 'affectedRows' in results) {
                this.connection.commit();
                return results.affectedRows;
            }
            this.connection.rollback();
            return -1;
        } catch (exception) {
            this.connection.rollback();
            console.error(`Error: ${exception.message}`);
            return -1;
        }
    }
}

export default AccountRoleDAO;

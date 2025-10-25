import { default as AccountRoleDAO } from "../infrastructure/data/accountRoleDAO.js";
import { AccountRole } from "../models/index.js";
import { withConnection, withTransaction } from "../infrastructure/connection/transactionHelper.js";

/**
 * AccountRoleService
 * Service layer for managing account-role relationships
 * Manages its own database connections and transactions
 */
class AccountRoleService {
    /**
     * Get all account-role relationships
     * @return {Promise<{success: boolean, data?: AccountRole[], error?: string}>}
     */
    async getAllAccountRoles() {
        try {
            const results = await withConnection(async (connection) => {
                const repo = new AccountRoleDAO(connection);
                return await repo.getAllAccountRoles();
            });
            
            return {
                success: true,
                data: results
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get account-role relationships by account ID
     * @param {number} accountId
     * @return {Promise<{success: boolean, data?: AccountRole[], error?: string}>}
     */
    async getByAccountId(accountId) {
        try {
            if (!accountId || !Number.isInteger(accountId)) {
                return {
                    success: false,
                    error: 'Invalid accountId'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new AccountRoleDAO(connection);
                return await repo.getByAccountId(accountId);
            });
            
            return {
                success: true,
                data: results
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get account-role relationships by multiple account IDs
     * @param {number[]} accountIds
     * @return {Promise<{success: boolean, data?: AccountRole[], error?: string}>}
     */
    async getByAccountIds(accountIds) {
        try {
            if (!Array.isArray(accountIds) || accountIds.length === 0) {
                return {
                    success: false,
                    error: 'Invalid accountIds array'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new AccountRoleDAO(connection);
                return await repo.getByAccountIds(accountIds);
            });
            
            return {
                success: true,
                data: results
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get account-role relationships by role ID
     * @param {number} roleId
     * @return {Promise<{success: boolean, data?: AccountRole[], error?: string}>}
     */
    async getByRoleId(roleId) {
        try {
            if (!roleId || !Number.isInteger(roleId)) {
                return {
                    success: false,
                    error: 'Invalid roleId'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new AccountRoleDAO(connection);
                return await repo.getByRoleId(roleId);
            });
            
            return {
                success: true,
                data: results
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get account-role relationships by multiple role IDs
     * @param {number[]} roleIds
     * @return {Promise<{success: boolean, data?: AccountRole[], error?: string}>}
     */
    async getByRoleIds(roleIds) {
        try {
            if (!Array.isArray(roleIds) || roleIds.length === 0) {
                return {
                    success: false,
                    error: 'Invalid roleIds array'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new AccountRoleDAO(connection);
                return await repo.getByRoleIds(roleIds);
            });
            
            return {
                success: true,
                data: results
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get specific account-role relationship
     * @param {number} accountId
     * @param {number} roleId
     * @return {Promise<{success: boolean, data?: AccountRole, error?: string}>}
     */
    async getByAccountIdAndRoleId(accountId, roleId) {
        try {
            if (!accountId || !roleId || !Number.isInteger(accountId) || !Number.isInteger(roleId)) {
                return {
                    success: false,
                    error: 'Invalid accountId or roleId'
                };
            }

            const result = await withConnection(async (connection) => {
                const repo = new AccountRoleDAO(connection);
                return await repo.getByAccountIdAndRoleId(accountId, roleId);
            });
            
            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create a new account-role relationship
     * @param {Object} accountRole - {account_id, role_id}
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async createAccountRole(accountRole) {
        try {
            if (!accountRole || !accountRole.account_id || !accountRole.role_id) {
                return {
                    success: false,
                    error: 'Missing required fields: account_id and role_id'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new AccountRoleDAO(connection);
                return await repo.createAccountRole(accountRole);
            });
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to create account-role relationship'
                };
            }

            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create multiple account-role relationships
     * @param {Array<Object>} accountRoles - Array of {account_id, role_id}
     * @return {Promise<{success: boolean, data?: number|Array, error?: string}>}
     */
    async createAccountRoles(accountRoles) {
        try {
            if (!Array.isArray(accountRoles) || accountRoles.length === 0) {
                return {
                    success: false,
                    error: 'accountRoles must be a non-empty array'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new AccountRoleDAO(connection);
                return await repo.createAccountRoles(accountRoles);
            });
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to create account-role relationships'
                };
            }

            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Delete account-role relationship by account ID
     * @param {number} accountId
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async deleteByAccountId(accountId) {
        try {
            if (!accountId || !Number.isInteger(accountId)) {
                return {
                    success: false,
                    error: 'Invalid accountId'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new AccountRoleDAO(connection);
                return await repo.deleteByAccountId(accountId);
            });
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to delete account-role relationships'
                };
            }

            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Delete account-role relationship by role ID
     * @param {number} roleId
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async deleteByRoleId(roleId) {
        try {
            if (!roleId || !Number.isInteger(roleId)) {
                return {
                    success: false,
                    error: 'Invalid roleId'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new AccountRoleDAO(connection);
                return await repo.deleteByRoleId(roleId);
            });
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to delete account-role relationships'
                };
            }

            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Delete specific account-role relationship
     * @param {number} accountId
     * @param {number} roleId
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async deleteByAccountIdAndRoleId(accountId, roleId) {
        try {
            if (!accountId || !roleId || !Number.isInteger(accountId) || !Number.isInteger(roleId)) {
                return {
                    success: false,
                    error: 'Invalid accountId or roleId'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new AccountRoleDAO(connection);
                return await repo.deleteByAccountIdAndRoleId(accountId, roleId);
            });
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to delete account-role relationship'
                };
            }

            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Delete multiple account-role relationships by account IDs
     * @param {Array<number>} accountIds
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async deleteByAccountIds(accountIds) {
        try {
            if (!Array.isArray(accountIds) || accountIds.length === 0) {
                return {
                    success: false,
                    error: 'Invalid accountIds array'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new AccountRoleDAO(connection);
                return await repo.deleteByAccountIds(accountIds);
            });
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to delete account-role relationships'
                };
            }

            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Delete multiple account-role relationships by role IDs
     * @param {Array<number>} roleIds
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async deleteByRoleIds(roleIds) {
        try {
            if (!Array.isArray(roleIds) || roleIds.length === 0) {
                return {
                    success: false,
                    error: 'Invalid roleIds array'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new AccountRoleDAO(connection);
                return await repo.deleteByRoleIds(roleIds);
            });
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to delete account-role relationships'
                };
            }

            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Check if an account has a specific role
     * @param {number} accountId
     * @param {number} roleId
     * @return {Promise<{success: boolean, data?: boolean, error?: string}>}
     */
    async hasRole(accountId, roleId) {
        try {
            const result = await this.getByAccountIdAndRoleId(accountId, roleId);
            
            if (!result.success) {
                return {
                    success: false,
                    error: result.error
                };
            }

            return {
                success: true,
                data: result.data && result.data.account_id ? true : false
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get all roles for an account
     * @param {number} accountId
     * @return {Promise<{success: boolean, data?: Array<number>, error?: string}>}
     */
    async getRoleIdsForAccount(accountId) {
        try {
            const result = await this.getByAccountId(accountId);
            
            if (!result.success) {
                return {
                    success: false,
                    error: result.error
                };
            }

            const roleIds = result.data.map(ar => ar.role_id);
            return {
                success: true,
                data: roleIds
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get all accounts with a specific role
     * @param {number} roleId
     * @return {Promise<{success: boolean, data?: Array<number>, error?: string}>}
     */
    async getAccountIdsForRole(roleId) {
        try {
            const result = await this.getByRoleId(roleId);
            
            if (!result.success) {
                return {
                    success: false,
                    error: result.error
                }
            }

            const accountIds = result.data.map(ar => ar.account_id);
            return {
                success: true,
                data: accountIds
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Assign multiple roles to an account
     * @param {number} accountId
     * @param {Array<number>} roleIds
     * @return {Promise<{success: boolean, data?: number|Array, error?: string}>}
     */
    async assignRolesToAccount(accountId, roleIds) {
        try {
            if (!accountId || !Number.isInteger(accountId)) {
                return {
                    success: false,
                    error: 'Invalid accountId'
                };
            }

            if (!Array.isArray(roleIds) || roleIds.length === 0) {
                return {
                    success: false,
                    error: 'roleIds must be a non-empty array'
                };
            }

            const accountRoles = roleIds.map(roleId => ({
                account_id: accountId,
                role_id: roleId
            }));

            return await this.createAccountRoles(accountRoles);
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Assign a role to multiple accounts
     * @param {Array<number>} accountIds
     * @param {number} roleId
     * @return {Promise<{success: boolean, data?: number|Array, error?: string}>}
     */
    async assignRoleToAccounts(accountIds, roleId) {
        try {
            if (!roleId || !Number.isInteger(roleId)) {
                return {
                    success: false,
                    error: 'Invalid roleId'
                };
            }

            if (!Array.isArray(accountIds) || accountIds.length === 0) {
                return {
                    success: false,
                    error: 'accountIds must be a non-empty array'
                };
            }

            const accountRoles = accountIds.map(accountId => ({
                account_id: accountId,
                role_id: roleId
            }));

            return await this.createAccountRoles(accountRoles);
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Remove all roles from an account
     * @param {number} accountId
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async removeAllRolesFromAccount(accountId) {
        return await this.deleteByAccountId(accountId);
    }

    /**
     * Remove a role from all accounts
     * @param {number} roleId
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async removeRoleFromAllAccounts(roleId) {
        return await this.deleteByRoleId(roleId);
    }
}

export default AccountRoleService;
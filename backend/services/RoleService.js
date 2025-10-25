import { default as RoleDAO } from "../infrastructure/data/roleDAO.js";
import { Role } from "../models/index.js";
import { withConnection, withTransaction } from "../infrastructure/connection/transactionHelper.js";

/**
 * RoleService
 * Service layer for managing roles
 * Manages its own database connections and transactions
 */
class RoleService {

    /**
     * Get all roles
     * @return {Promise<{success: boolean, data?: Role[], error?: string}>}
     */
    async getAllRoles() {
        try {
            const results = await withConnection(async (connection) => {
                const repo = new RoleDAO(connection);
                return await repo.getAllRoles();
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
     * Get role by ID
     * @param {number} roleId
     * @return {Promise<{success: boolean, data?: Role, error?: string}>}
     */
    async getByRoleId(roleId) {
        try {
            if (!roleId || !Number.isInteger(roleId)) {
                return {
                    success: false,
                    error: 'Invalid roleId'
                };
            }

            const result = await withConnection(async (connection) => {
                const repo = new RoleDAO(connection);
                return await repo.getByRoleId(roleId);
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
     * Get roles by multiple IDs
     * @param {number[]} roleIds
     * @return {Promise<{success: boolean, data?: Role[], error?: string}>}
     */
    async getByIds(roleIds) {
        try {
            if (!Array.isArray(roleIds) || roleIds.length === 0) {
                return {
                    success: false,
                    error: 'Invalid roleIds array'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new RoleDAO(connection);
                return await repo.getByIds(roleIds);
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
     * Get role by name
     * @param {string} roleName
     * @return {Promise<{success: boolean, data?: Role, error?: string}>}
     */
    async getByRoleName(roleName) {
        try {
            if (!roleName || typeof roleName !== 'string') {
                return {
                    success: false,
                    error: 'Invalid roleName'
                };
            }

            const result = await withConnection(async (connection) => {
                const repo = new RoleDAO(connection);
                return await repo.getByRoleName(roleName);
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
     * Get roles with name like pattern
     * @param {string} roleNamePattern
     * @return {Promise<{success: boolean, data?: Role[], error?: string}>}
     */
    async getLikeRoleName(roleNamePattern) {
        try {
            if (!roleNamePattern || typeof roleNamePattern !== 'string') {
                return {
                    success: false,
                    error: 'Invalid roleNamePattern'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new RoleDAO(connection);
                return await repo.getLikeRoleName(roleNamePattern);
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
     * Get roles by active status
     * @param {boolean} activeStatus
     * @return {Promise<{success: boolean, data?: Role[], error?: string}>}
     */
    async getByActiveStatus(activeStatus) {
        try {
            if (typeof activeStatus !== 'boolean') {
                return {
                    success: false,
                    error: 'Invalid activeStatus'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new RoleDAO(connection);
                return await repo.getByActiveStatus(activeStatus);
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
     * Create a new role
     * @param {Role} role
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async createRole(role) {
        try {
            if (!(role instanceof Role)) {
                return {
                    success: false,
                    error: 'Invalid role object'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new RoleDAO(connection);
                return await repo.createRole(role);
            });
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to create role'
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
     * Create multiple roles
     * @param {Role[]} roles
     * @return {Promise<{success: boolean, data?: number|number[], error?: string}>}
     */
    async createRoles(roles) {
        try {
            if (!Array.isArray(roles) || roles.length === 0) {
                return {
                    success: false,
                    error: 'roles must be a non-empty array'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new RoleDAO(connection);
                return await repo.createRoles(roles);
            });
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to create roles'
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
     * Update role name
     * @param {number} roleId
     * @param {string} newRoleName
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateRoleName(roleId, newRoleName) {
        try {
            if (!roleId || !Number.isInteger(roleId)) {
                return {
                    success: false,
                    error: 'Invalid roleId'
                };
            }

            if (!newRoleName || typeof newRoleName !== 'string') {
                return {
                    success: false,
                    error: 'Invalid newRoleName'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new RoleDAO(connection);
                return await repo.updateRoleName(roleId, newRoleName);
            });
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update role name'
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
     * Update role active status
     * @param {number} roleId
     * @param {boolean} activeStatus
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateActiveStatus(roleId, activeStatus) {
        try {
            if (!roleId || !Number.isInteger(roleId)) {
                return {
                    success: false,
                    error: 'Invalid roleId'
                };
            }

            if (typeof activeStatus !== 'boolean') {
                return {
                    success: false,
                    error: 'Invalid activeStatus'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new RoleDAO(connection);
                return await repo.updateActiveStatus(roleId, activeStatus);
            });
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update active status'
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
     * Update role names of multiple roles
     * @param {Array<{role_id: number, role_name: string}>} roles - Plain objects with snake_case properties
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateRoleNames(roles) {
        try {
            if (!Array.isArray(roles) || roles.length === 0) {
                return {
                    success: false,
                    error: 'roles must be a non-empty array'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new RoleDAO(connection);
                return await repo.updateRoleNames(roles);
            });
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update role names'
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
     * Update active statuses of multiple roles
     * @param {Array<{role_id: number, role_active_status: boolean}>} roles - Plain objects with snake_case properties
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateActiveStatuses(roles) {
        try {
            if (!Array.isArray(roles) || roles.length === 0) {
                return {
                    success: false,
                    error: 'roles must be a non-empty array'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new RoleDAO(connection);
                return await repo.updateActiveStatuses(roles);
            });
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update active statuses'
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
}

export default RoleService;

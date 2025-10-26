import Role from "../../models/Role.js";
import { default as BaseDAO } from "./baseDAO.js";
import dbSchema from "./dbSchema.js";
import mySql from "mysql2/promise";

class RoleDAO extends BaseDAO {
    /**
     * Creates an instance of RoleDAO.
     * @param {mySql.PoolConnection} connection
     * @memberof RoleDAO
     */
    constructor(connection) {
        super(connection, "Role", dbSchema.ROLE_COLUMNS.ROLE_ID);
    }

    /**
     * Get all roles
     * @return {Promise<Role[]>} 
     * @memberof RoleDAO
     */
    async getAllRoles() {
        try {
            const results = await this._protectedGetAll();
            if (!results || results.length === 0) {
                console.warn(`Warning: No roles found`);
                return [];
            }
            return results.map(item => Role.fromDatabase(item));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get role by ID
     * @param {number} roleId
     * @return {Promise<Role>} 
     * @memberof RoleDAO
     */
    async getByRoleId(roleId) {
        if (roleId === null || roleId === undefined || !Number.isInteger(roleId)) {
            console.warn(`Warning: roleId is invalid : ${roleId}`);
            return new Role();
        }

        try {
            if (roleId <= 0) {
                console.warn(`Warning: roleId must be greater than zero : ${roleId}`);
                return new Role();
            }

            const result = await this._protectedGetById(roleId);
            if (!result) {
                console.warn(`Warning: No data found for roleId ${roleId}`);
                return new Role();
            }
            return Role.fromDatabase(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return new Role();
        }
    }

    async getByIds(roleIds) {
        if (!Array.isArray(roleIds) || roleIds.length === 0) {
            console.warn(`Warning: roleIds must be a non-empty array`);
            return [];
        }

        try {
            const placeholders = roleIds.map(() => '?').join(', ');
            const results = await this._protectedGetBySelection(["*"], roleIds,
                `WHERE ${dbSchema.ROLE_COLUMNS.ROLE_ID} IN (${placeholders})`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No roles found for provided roleIds`);
                return [];
            }
            return results.map(item => Role.fromDatabase(item));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get role by name
     * @param {string} roleName
     * @return {Promise<Role>} 
     * @memberof RoleDAO
     */
    async getByRoleName(roleName) {
        if (!roleName || typeof roleName !== 'string' || roleName.trim() === '') {
            console.warn(`Warning: roleName is invalid : ${roleName}`);
            return new Role();
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [roleName],
                `WHERE ${dbSchema.ROLE_COLUMNS.ROLE_NAME} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No role found for roleName ${roleName}`);
                return new Role();
            }
            return results[0];
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return new Role();
        }
    }

    /**
     *
     *
     * @param {string} partialName
     * @return {Promise<Role[]>} 
     * @memberof RoleDAO
     */
    async getLikeRoleName(partialName) {
        if (!partialName || typeof partialName !== 'string' || partialName.trim() === '') {
            console.warn(`Warning: partialName is invalid : ${partialName}`);
            return [];
        }

        try {
            const likePattern = `%${partialName}%`;
            const results = await this._protectedGetBySelection(["*"], [likePattern],
                `WHERE ${dbSchema.ROLE_COLUMNS.ROLE_NAME} LIKE ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No roles found matching partialName ${partialName}`);
                return [];
            }
            return results.map(item => Role.fromDatabase(item));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get roles by active status
     * @param {boolean} activeStatus
     * @return {Promise<Role[]>} 
     * @memberof RoleDAO
     */
    async getByActiveStatus(activeStatus) {
        if (activeStatus === null || activeStatus === undefined || typeof activeStatus !== 'boolean') {
            console.warn(`Warning: activeStatus is invalid : ${activeStatus}`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [activeStatus],
                `WHERE ${dbSchema.ROLE_COLUMNS.ROLE_ACTIVE_STATUS} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No roles found for activeStatus ${activeStatus}`);
                return [];
            }
            return results.map(item => Role.fromDatabase(item));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Create a new role
     * @param {Role} role
     * @return {Promise<number>} 
     * @memberof RoleDAO
     */
    async createRole(role) {
        if (!(role instanceof Role)) {
            console.warn(`Warning: Invalid role object`);
            return -1;
        }

        try {
            const result = await this._protectedCreate(role);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     *
     *
     * @param {Role[]} roles
     * @return {Promise<number|number[]>} 
     * @memberof RoleDAO
     */
    async createRoles(roles) {
        if (!Array.isArray(roles) || roles.length === 0) {
            console.warn(`Warning: roles must be a non-empty array`);
            return -1;
        }

        try {
            const valueInserts = roles.map(role => ({
                [dbSchema.ROLE_COLUMNS.ROLE_NAME]: role.role_name,
                [dbSchema.ROLE_COLUMNS.ROLE_ACTIVE_STATUS]: role.role_active_status
            }));
            const result = await this._protectedMultiCreate([dbSchema.ROLE_COLUMNS.ROLE_NAME, dbSchema.ROLE_COLUMNS.ROLE_ACTIVE_STATUS], valueInserts);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Private method to update a single role
     * @param {Role} role
     * @return {Promise<number>} 
     * @memberof RoleDAO
     */
    async #updateRole(role) {
        if (!role) {
            console.warn(`Warning: Invalid role: ${role}`);
            return -1;
        }
        try {
            const result = await this._protectedUpdateById(role[dbSchema.ROLE_COLUMNS.ROLE_ID], role);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Private method to update multiple roles
     * @param {Role[]} roles
     * @return {Promise<number>} 
     * @memberof RoleDAO
     */
    async #updateRoles(roles) {
        if (!Array.isArray(roles) || roles.length === 0) {
            console.warn(`Warning: roles must be a non-empty array`);
            return 1;
        }

        try {
            const result = await this._protectedMultiUpdateById(roles);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update role name
     * @param {number} roleId
     * @param {string} newRoleName
     * @return {Promise<number>} 
     * @memberof RoleDAO
     */
    async updateRoleName(roleId, newRoleName) {
        if (!roleId || !newRoleName || typeof newRoleName !== 'string') {
            console.warn(`Warning: Invalid roleId or newRoleName`);
            return -1;
        }

        try {
            const result = await this.getByRoleId(roleId);
            if (!result) {
                console.warn(`Warning: No role found for roleId ${roleId}`);
                return -1;
            }
            if (result.role_name === newRoleName) {
                console.info(`Info: Role name is already '${newRoleName}' for roleId ${roleId}`);
                return 0;
            }
            result.role_name = newRoleName;
            return await this.#updateRole(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update role active status
     * @param {number} roleId
     * @param {boolean} activeStatus
     * @return {Promise<number>} 
     * @memberof RoleDAO
     */
    async updateActiveStatus(roleId, activeStatus) {
        if (!roleId || typeof activeStatus !== 'boolean') {
            console.warn(`Warning: Invalid roleId or activeStatus`);
            return -1;
        }

        try {
            const result = await this.getByRoleId(roleId);
            if (!result) {
                console.warn(`Warning: No role found for roleId ${roleId}`);
                return -1;
            }
            if (result.role_active_status === activeStatus) {
                console.info(`Info: Role active status is already '${activeStatus}' for roleId ${roleId}`);
                return 0;
            }
            result.role_active_status = activeStatus;
            return await this.#updateRole(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update role names of multiple roles
     * @param {Array<{role_id: number, role_name: string}>} roles - Plain objects with snake_case properties
     * @return {Promise<number>} Number of affected rows or -1 if failed
     */
    async updateRoleNames(roles) {
        if (!Array.isArray(roles) || roles.length === 0) {
            console.warn(`Warning: roles must be a non-empty array`);
            return -1;
        }
        try {
            const formattedRoles = roles.map(role => new Role({
                [dbSchema.ROLE_COLUMNS.ROLE_ID]: role.role_id,
                [dbSchema.ROLE_COLUMNS.ROLE_NAME]: role.role_name
            }));
            return await this.#updateRoles(formattedRoles);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update active statuses of multiple roles
     * @param {Array<{role_id: number, role_active_status: boolean}>} roles - Plain objects with snake_case properties
     * @return {Promise<number>} Number of affected rows or -1 if failed
     */
    async updateActiveStatuses(roles) {
        if (!Array.isArray(roles) || roles.length === 0) {
            console.warn(`Warning: roles must be a non-empty array`);
            return -1;
        }
        try {
            const formattedRoles = roles.map(role => new Role({
                [dbSchema.ROLE_COLUMNS.ROLE_ID]: role.role_id,
                [dbSchema.ROLE_COLUMNS.ROLE_ACTIVE_STATUS]: role.role_active_status
            }));
            return await this.#updateRoles(formattedRoles);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }
}

export default RoleDAO;

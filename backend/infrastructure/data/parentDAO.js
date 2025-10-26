import Parent from "../../models/Parent.js";
import { default as BaseDAO } from "./baseDAO.js";
import dbSchema from "./dbSchema.js";
import mySql from "mysql2/promise";

/**
 * ParentDAO
 * Data Access Object for Parent table operations
 */
export default class ParentDAO extends BaseDAO {
    
    /**
     * Creates an instance of ParentDAO.
     * @param {mySql.PoolConnection} connection
     * @memberof ParentDAO
     */
    constructor(connection) {
        super(connection, "Parent", dbSchema.PARENT_COLUMNS.PARENT_PERSON_ID);
    }

    /**
     * Get all parents
     * @return {Promise<Parent[]>} 
     * @memberof ParentDAO
     */
    async getAllParents() {
        try {
            const results = await this._protectedGetAll();
            if (!results || results.length === 0) {
                console.warn(`Warning: No parents found`);
                return [];
            }
            return results.map(row => Parent.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get parent by person ID
     * @param {number} parentPersonId
     * @return {Promise<Parent>} 
     * @memberof ParentDAO
     */
    async getByParentPersonId(parentPersonId) {
        if (parentPersonId === null || parentPersonId === undefined || !Number.isInteger(parentPersonId)) {
            console.warn(`Warning: parentPersonId is invalid : ${parentPersonId}`);
            const emptyParent = {};
            emptyParent[dbSchema.PARENT_COLUMNS.PARENT_PERSON_ID] = 0;
            emptyParent[dbSchema.PARENT_COLUMNS.PARENT_TYPE] = '';
            return new Parent(emptyParent);
        }

        try {
            if (parentPersonId <= 0) {
                console.warn(`Warning: parentPersonId must be greater than zero : ${parentPersonId}`);
                const emptyParent = {};
                emptyParent[dbSchema.PARENT_COLUMNS.PARENT_PERSON_ID] = 0;
                emptyParent[dbSchema.PARENT_COLUMNS.PARENT_TYPE] = '';
                return new Parent(emptyParent);
            }

            const result = await this._protectedGetById(parentPersonId);
            if (!result) {
                console.warn(`Warning: No data found for parentPersonId ${parentPersonId}`);
                const emptyParent = {};
                emptyParent[dbSchema.PARENT_COLUMNS.PARENT_PERSON_ID] = 0;
                emptyParent[dbSchema.PARENT_COLUMNS.PARENT_TYPE] = '';
                return new Parent(emptyParent);
            }
            return Parent.fromDatabase(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            const emptyParent = {};
            emptyParent[dbSchema.PARENT_COLUMNS.PARENT_PERSON_ID] = 0;
            emptyParent[dbSchema.PARENT_COLUMNS.PARENT_TYPE] = '';
            return new Parent(emptyParent);
        }
    }

    /**
     * Get parents by multiple person IDs
     * @param {number[]} parentPersonIds
     * @return {Promise<Parent[]>} 
     * @memberof ParentDAO
     */
    async getByParentPersonIds(parentPersonIds) {
        if (!Array.isArray(parentPersonIds) || parentPersonIds.length === 0) {
            console.warn(`Warning: parentPersonIds must be a non-empty array`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], parentPersonIds,
                `WHERE ${this.primaryKeyName} IN (${parentPersonIds.map(() => '?').join(', ')})`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No parents found for provided parentPersonIds`);
                return [];
            }
            return results.map(row => Parent.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get parents by address ID
     * @param {number} addressId
     * @return {Promise<Parent[]>} 
     * @memberof ParentDAO
     */
    async getByAddressId(addressId) {
        if (addressId === null || addressId === undefined || !Number.isInteger(addressId)) {
            console.warn(`Warning: addressId is invalid : ${addressId}`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [addressId],
                `WHERE ${dbSchema.PARENT_COLUMNS.PARENT_ADDRESS_ID} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No parents found for addressId ${addressId}`);
                return [];
            }
            return results.map(row => Parent.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get parents by parent type
     * @param {string} parentType - 'father', 'mother', 'grandpa', 'grandma', 'other'
     * @return {Promise<Parent[]>} 
     * @memberof ParentDAO
     */
    async getByParentType(parentType) {
        if (!parentType || typeof parentType !== 'string' || parentType.trim() === '') {
            console.warn(`Warning: parentType is invalid : ${parentType}`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [parentType],
                `WHERE ${dbSchema.PARENT_COLUMNS.PARENT_TYPE} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No parents found for parentType ${parentType}`);
                return [];
            }
            return results.map(row => Parent.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get parents by job (exact match)
     * @param {string} job
     * @return {Promise<Parent[]>} 
     * @memberof ParentDAO
     */
    async getByJob(job) {
        if (!job || typeof job !== 'string' || job.trim() === '') {
            console.warn(`Warning: job is invalid : ${job}`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [job],
                `WHERE ${dbSchema.PARENT_COLUMNS.PARENT_JOB} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No parents found for job ${job}`);
                return [];
            }
            return results.map(row => Parent.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get parents by job (like pattern)
     * @param {string} jobPattern
     * @return {Promise<Parent[]>} 
     * @memberof ParentDAO
     */
    async getLikeJob(jobPattern) {
        if (!jobPattern || typeof jobPattern !== 'string' || jobPattern.trim() === '') {
            console.warn(`Warning: jobPattern is invalid : ${jobPattern}`);
            return [];
        }

        try {
            const likePattern = `%${jobPattern}%`;
            const results = await this._protectedGetBySelection(["*"], [likePattern],
                `WHERE ${dbSchema.PARENT_COLUMNS.PARENT_JOB} LIKE ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No parents found matching jobPattern ${jobPattern}`);
                return [];
            }
            return results.map(row => Parent.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Create a new parent
     * @param {Parent} parent
     * @return {Promise<number>} The parent_person_id or -1 if failed
     * @memberof ParentDAO
     */
    async createParent(parent) {
        if (!(parent instanceof Parent)) {
            console.warn(`Warning: Invalid parent object`);
            return -1;
        }

        try {
            const result = await this._protectedCreate(parent);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Create multiple parents
     * @param {Parent[]} parents
     * @return {Promise<number|number[]>} Number of affected rows or array of IDs, or -1 if failed
     * @memberof ParentDAO
     */
    async createParents(parents) {
        if (!Array.isArray(parents) || parents.length === 0) {
            console.warn(`Warning: parents must be a non-empty array`);
            return -1;
        }

        try {
            const valueInserts = parents.map(parent => ({
                [dbSchema.PARENT_COLUMNS.PARENT_PERSON_ID]: parent.parent_person_id,
                [dbSchema.PARENT_COLUMNS.PARENT_ADDRESS_ID]: parent.parent_address_id,
                [dbSchema.PARENT_COLUMNS.PARENT_JOB]: parent.parent_job,
                [dbSchema.PARENT_COLUMNS.PARENT_TYPE]: parent.parent_type
            }));
            const results = await this._protectedMultiCreate([
                dbSchema.PARENT_COLUMNS.PARENT_PERSON_ID,
                dbSchema.PARENT_COLUMNS.PARENT_ADDRESS_ID,
                dbSchema.PARENT_COLUMNS.PARENT_JOB,
                dbSchema.PARENT_COLUMNS.PARENT_TYPE
            ], valueInserts);
            return results;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Private method to update a single parent
     * @param {Parent} parent
     * @return {Promise<number>} Number of affected rows or -1 if failed
     * @memberof ParentDAO
     */
    async #updateParent(parent) {
        if (!parent) {
            console.warn(`Warning: Invalid parent: ${parent}`);
            return -1;
        }
        try {
            const result = await this._protectedUpdateById(parent[dbSchema.PARENT_COLUMNS.PARENT_PERSON_ID], parent);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Private method to update multiple parents
     * @param {Parent[]} parents
     * @return {Promise<number>} Number of affected rows or -1 if failed
     * @memberof ParentDAO
     */
    async #updateParents(parents) {
        if (!Array.isArray(parents) || parents.length === 0) {
            console.warn(`Warning: parents must be a non-empty array`);
            return -1;
        }

        try {
            const result = await this._protectedMultiUpdateById(parents);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update parent address ID
     * @param {number} parentPersonId
     * @param {number} newAddressId
     * @return {Promise<number>} Number of affected rows or -1 if failed
     * @memberof ParentDAO
     */
    async updateAddressId(parentPersonId, newAddressId) {
        if (!parentPersonId || !Number.isInteger(parentPersonId)) {
            console.warn(`Warning: Invalid parentPersonId`);
            return -1;
        }

        try {
            const result = await this.getByParentPersonId(parentPersonId);
            if (!result || !result.parent_person_id) {
                console.warn(`Warning: No parent found for parentPersonId ${parentPersonId}`);
                return -1;
            }
            if (result.parent_address_id === newAddressId) {
                console.info(`Info: Address ID is already ${newAddressId} for parentPersonId ${parentPersonId}`);
                return 0;
            }
            result.parent_address_id = newAddressId;
            return await this.#updateParent(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update parent job
     * @param {number} parentPersonId
     * @param {string} newJob
     * @return {Promise<number>} Number of affected rows or -1 if failed
     * @memberof ParentDAO
     */
    async updateJob(parentPersonId, newJob) {
        if (!parentPersonId || !Number.isInteger(parentPersonId)) {
            console.warn(`Warning: Invalid parentPersonId`);
            return -1;
        }

        try {
            const result = await this.getByParentPersonId(parentPersonId);
            if (!result || !result.parent_person_id) {
                console.warn(`Warning: No parent found for parentPersonId ${parentPersonId}`);
                return -1;
            }
            if (result.parent_job === newJob) {
                console.info(`Info: Job is already '${newJob}' for parentPersonId ${parentPersonId}`);
                return 0;
            }
            result.parent_job = newJob;
            return await this.#updateParent(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update parent type
     * @param {number} parentPersonId
     * @param {string} newType
     * @return {Promise<number>} Number of affected rows or -1 if failed
     * @memberof ParentDAO
     */
    async updateParentType(parentPersonId, newType) {
        if (!parentPersonId || !Number.isInteger(parentPersonId)) {
            console.warn(`Warning: Invalid parentPersonId`);
            return -1;
        }

        if (!newType || typeof newType !== 'string') {
            console.warn(`Warning: Invalid newType`);
            return -1;
        }

        try {
            const result = await this.getByParentPersonId(parentPersonId);
            if (!result || !result.parent_person_id) {
                console.warn(`Warning: No parent found for parentPersonId ${parentPersonId}`);
                return -1;
            }
            if (result.parent_type === newType) {
                console.info(`Info: Parent type is already '${newType}' for parentPersonId ${parentPersonId}`);
                return 0;
            }
            result.parent_type = newType;
            return await this.#updateParent(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update address IDs of multiple parents
     * @param {Array<{parent_person_id: number, parent_address_id: number}>} parents - Plain objects with snake_case properties
     * @return {Promise<number>} Number of affected rows or -1 if failed
     * @memberof ParentDAO
     */
    async updateAddressIds(parents) {
        if (!Array.isArray(parents) || parents.length === 0) {
            console.warn(`Warning: parents must be a non-empty array`);
            return -1;
        }
        try {
            const formattedParents = parents.map(parent => {
                const obj = {};
                obj[dbSchema.PARENT_COLUMNS.PARENT_PERSON_ID] = parent.parent_person_id;
                obj[dbSchema.PARENT_COLUMNS.PARENT_ADDRESS_ID] = parent.parent_address_id;
                obj[dbSchema.PARENT_COLUMNS.PARENT_TYPE] = ''; // Placeholder
                return new Parent(obj);
            });
            return await this.#updateParents(formattedParents);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update jobs of multiple parents
     * @param {Array<{parent_person_id: number, parent_job: string}>} parents - Plain objects with snake_case properties
     * @return {Promise<number>} Number of affected rows or -1 if failed
     * @memberof ParentDAO
     */
    async updateJobs(parents) {
        if (!Array.isArray(parents) || parents.length === 0) {
            console.warn(`Warning: parents must be a non-empty array`);
            return -1;
        }
        try {
            const formattedParents = parents.map(parent => {
                const obj = {};
                obj[dbSchema.PARENT_COLUMNS.PARENT_PERSON_ID] = parent.parent_person_id;
                obj[dbSchema.PARENT_COLUMNS.PARENT_JOB] = parent.parent_job;
                obj[dbSchema.PARENT_COLUMNS.PARENT_TYPE] = ''; // Placeholder
                return new Parent(obj);
            });
            return await this.#updateParents(formattedParents);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update parent types of multiple parents
     * @param {Array<{parent_person_id: number, parent_type: string}>} parents - Plain objects with snake_case properties
     * @return {Promise<number>} Number of affected rows or -1 if failed
     * @memberof ParentDAO
     */
    async updateParentTypes(parents) {
        if (!Array.isArray(parents) || parents.length === 0) {
            console.warn(`Warning: parents must be a non-empty array`);
            return -1;
        }
        try {
            const formattedParents = parents.map(parent => {
                const obj = {};
                obj[dbSchema.PARENT_COLUMNS.PARENT_PERSON_ID] = parent.parent_person_id;
                obj[dbSchema.PARENT_COLUMNS.PARENT_TYPE] = parent.parent_type;
                return new Parent(obj);
            });
            return await this.#updateParents(formattedParents);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Delete parent by person ID
     * @param {number} parentPersonId
     * @return {Promise<number>} Number of affected rows or -1 if failed
     * @memberof ParentDAO
     */
    async deleteParent(parentPersonId) {
        if (!parentPersonId || !Number.isInteger(parentPersonId)) {
            console.warn(`Warning: Invalid parentPersonId`);
            return -1;
        }

        try {
            const result = await this._protectedDeleteById(parentPersonId);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Delete multiple parents by person IDs
     * @param {number[]} parentPersonIds
     * @return {Promise<number>} Number of affected rows or -1 if failed
     * @memberof ParentDAO
     */
    async deleteParents(parentPersonIds) {
        if (!Array.isArray(parentPersonIds) || parentPersonIds.length === 0) {
            console.warn(`Warning: parentPersonIds must be a non-empty array`);
            return -1;
        }

        try {
            const result = await this._protectedDeleteByIds(parentPersonIds);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }
}

import { default as ParentDAO } from "../infrastructure/data/parentDAO.js";
import { Parent } from "../index.js";
import { withConnection, withTransaction } from "../infrastructure/connection/transactionHelper.js";

/**
 * ParentServices
 * Service layer for managing parents
 * Manages its own database connections and transactions
 */
class ParentServices {
    /**
     * Get all parents
     * @return {Promise<{success: boolean, data?: Parent[], error?: string}>}
     */
    async getAllParents() {
        try {
            const results = await withConnection(async (connection) => {
                const repo = new ParentDAO(connection);
                return await repo.getAllParents();
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
     * Get parent by person ID
     * @param {number} parentPersonId
     * @return {Promise<{success: boolean, data?: Parent, error?: string}>}
     */
    async getByParentPersonId(parentPersonId) {
        try {
            if (!parentPersonId || !Number.isInteger(parentPersonId)) {
                return {
                    success: false,
                    error: 'Invalid parentPersonId'
                };
            }

            const result = await withConnection(async (connection) => {
                const repo = new ParentDAO(connection);
                return await repo.getByParentPersonId(parentPersonId);
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
     * Get parents by multiple person IDs
     * @param {number[]} parentPersonIds
     * @return {Promise<{success: boolean, data?: Parent[], error?: string}>}
     */
    async getByParentPersonIds(parentPersonIds) {
        try {
            if (!Array.isArray(parentPersonIds) || parentPersonIds.length === 0) {
                return {
                    success: false,
                    error: 'Invalid parentPersonIds array'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new ParentDAO(connection);
                return await repo.getByParentPersonIds(parentPersonIds);
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
     * Get parents by address ID
     * @param {number} addressId
     * @return {Promise<{success: boolean, data?: Parent[], error?: string}>}
     */
    async getByAddressId(addressId) {
        try {
            if (!addressId || !Number.isInteger(addressId)) {
                return {
                    success: false,
                    error: 'Invalid addressId'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new ParentDAO(connection);
                return await repo.getByAddressId(addressId);
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
     * Get parents by parent type
     * @param {string} parentType
     * @return {Promise<{success: boolean, data?: Parent[], error?: string}>}
     */
    async getByParentType(parentType) {
        try {
            if (!parentType || typeof parentType !== 'string') {
                return {
                    success: false,
                    error: 'Invalid parentType'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new ParentDAO(connection);
                return await repo.getByParentType(parentType);
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
     * Get parents by job
     * @param {string} job
     * @return {Promise<{success: boolean, data?: Parent[], error?: string}>}
     */
    async getByJob(job) {
        try {
            if (!job || typeof job !== 'string') {
                return {
                    success: false,
                    error: 'Invalid job'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new ParentDAO(connection);
                return await repo.getByJob(job);
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
     * Get parents with job like pattern
     * @param {string} jobPattern
     * @return {Promise<{success: boolean, data?: Parent[], error?: string}>}
     */
    async getLikeJob(jobPattern) {
        try {
            if (!jobPattern || typeof jobPattern !== 'string') {
                return {
                    success: false,
                    error: 'Invalid jobPattern'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new ParentDAO(connection);
                return await repo.getLikeJob(jobPattern);
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
     * Create a new parent
     * @param {Parent} parent
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async createParent(parent) {
        try {
            if (!(parent instanceof Parent)) {
                return {
                    success: false,
                    error: 'Invalid parent object'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new ParentDAO(connection);
                return await repo.createParent(parent);
            });

            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to create parent'
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
     * Create multiple parents
     * @param {Parent[]} parents
     * @return {Promise<{success: boolean, data?: number|number[], error?: string}>}
     */
    async createParents(parents) {
        try {
            if (!Array.isArray(parents) || parents.length === 0) {
                return {
                    success: false,
                    error: 'Invalid parents array'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new ParentDAO(connection);
                return await repo.createParents(parents);
            });

            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to create parents'
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
     * Update parent address ID
     * @param {number} parentPersonId
     * @param {number} newAddressId
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateAddressId(parentPersonId, newAddressId) {
        try {
            if (!parentPersonId || !Number.isInteger(parentPersonId)) {
                return {
                    success: false,
                    error: 'Invalid parentPersonId'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new ParentDAO(connection);
                return await repo.updateAddressId(parentPersonId, newAddressId);
            });

            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update address ID'
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
     * Update parent job
     * @param {number} parentPersonId
     * @param {string} newJob
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateJob(parentPersonId, newJob) {
        try {
            if (!parentPersonId || !Number.isInteger(parentPersonId)) {
                return {
                    success: false,
                    error: 'Invalid parentPersonId'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new ParentDAO(connection);
                return await repo.updateJob(parentPersonId, newJob);
            });

            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update job'
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
     * Update parent type
     * @param {number} parentPersonId
     * @param {string} newType
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateParentType(parentPersonId, newType) {
        try {
            if (!parentPersonId || !Number.isInteger(parentPersonId)) {
                return {
                    success: false,
                    error: 'Invalid parentPersonId'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new ParentDAO(connection);
                return await repo.updateParentType(parentPersonId, newType);
            });

            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update parent type'
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
     * Update address IDs of multiple parents
     * @param {Array<{parent_person_id: number, parent_address_id: number}>} parents
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateAddressIds(parents) {
        try {
            if (!Array.isArray(parents) || parents.length === 0) {
                return {
                    success: false,
                    error: 'Invalid parents array'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new ParentDAO(connection);
                return await repo.updateAddressIds(parents);
            });

            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update address IDs'
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
     * Update jobs of multiple parents
     * @param {Array<{parent_person_id: number, parent_job: string}>} parents
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateJobs(parents) {
        try {
            if (!Array.isArray(parents) || parents.length === 0) {
                return {
                    success: false,
                    error: 'Invalid parents array'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new ParentDAO(connection);
                return await repo.updateJobs(parents);
            });

            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update jobs'
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
     * Update parent types of multiple parents
     * @param {Array<{parent_person_id: number, parent_type: string}>} parents
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateParentTypes(parents) {
        try {
            if (!Array.isArray(parents) || parents.length === 0) {
                return {
                    success: false,
                    error: 'Invalid parents array'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new ParentDAO(connection);
                return await repo.updateParentTypes(parents);
            });

            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update parent types'
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
     * Delete parent by person ID
     * @param {number} parentPersonId
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async deleteParent(parentPersonId) {
        try {
            if (!parentPersonId || !Number.isInteger(parentPersonId)) {
                return {
                    success: false,
                    error: 'Invalid parentPersonId'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new ParentDAO(connection);
                return await repo.deleteParent(parentPersonId);
            });

            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to delete parent'
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
     * Delete multiple parents by person IDs
     * @param {number[]} parentPersonIds
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async deleteParents(parentPersonIds) {
        try {
            if (!Array.isArray(parentPersonIds) || parentPersonIds.length === 0) {
                return {
                    success: false,
                    error: 'Invalid parentPersonIds array'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new ParentDAO(connection);
                return await repo.deleteParents(parentPersonIds);
            });

            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to delete parents'
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

export default ParentServices;

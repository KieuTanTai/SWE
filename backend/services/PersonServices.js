import { default as PersonDAO } from "../infrastructure/data/personDAO.js";
import Person from "../models/Person.js";
import { withConnection, withTransaction } from "../infrastructure/connection/transactionHelper.js";

/**
 * PersonServices
 * Service layer for managing persons
 * Manages its own database connections and transactions
 */
class PersonServices {
    /**
     * Get all persons
     * @return {Promise<{success: boolean, data?: Person[], error?: string}>}
     */
    async getAllPersons() {
        try {
            const results = await withConnection(async (connection) => {
                const repo = new PersonDAO(connection);
                return await repo.getAllPersons();
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
     * Get person by ID
     * @param {number} personId
     * @return {Promise<{success: boolean, data?: Person, error?: string}>}
     */
    async getByPersonId(personId) {
        try {
            if (!personId || !Number.isInteger(personId)) {
                return {
                    success: false,
                    error: 'Invalid personId'
                };
            }

            const result = await withConnection(async (connection) => {
                const repo = new PersonDAO(connection);
                return await repo.getByPersonId(personId);
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
     * Create a new person
     * @param {Object} personData
     * @return {Promise<{success: boolean, data?: Person, error?: string}>}
     */
    async createPerson(personData) {
        try {
            const result = await withTransaction(async (connection) => {
                const repo = new PersonDAO(connection);
                return await repo.createPerson(personData);
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
     * Update a person
     * @param {number} personId
     * @param {Object} personData
     * @return {Promise<{success: boolean, data?: Person, error?: string}>}
     */
    async updatePerson(personId, personData) {
        try {
            if (!personId || !Number.isInteger(personId)) {
                return {
                    success: false,
                    error: 'Invalid personId'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new PersonDAO(connection);
                return await repo.updatePerson(personId, personData);
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
     * Delete a person
     * @param {number} personId
     * @return {Promise<{success: boolean, error?: string}>}
     */
    async deletePerson(personId) {
        try {
            if (!personId || !Number.isInteger(personId)) {
                return {
                    success: false,
                    error: 'Invalid personId'
                };
            }

            await withTransaction(async (connection) => {
                const repo = new PersonDAO(connection);
                return await repo.deletePerson(personId);
            });
            
            return {
                success: true
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default new PersonServices();

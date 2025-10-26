import { default as AddressDAO } from "../infrastructure/data/addressDAO.js";
import Address from "../models/Address.js";
import { withConnection, withTransaction } from "../infrastructure/connection/transactionHelper.js";

/**
 * AddressServices
 * Service layer for managing addresses
 * Manages its own database connections and transactions
 */
class AddressServices {
    /**
     * Get all addresses
     * @return {Promise<{success: boolean, data?: Address[], error?: string}>}
     */
    async getAllAddresses() {
        try {
            const results = await withConnection(async (connection) => {
                const repo = new AddressDAO(connection);
                return await repo.getAllAddresses();
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
     * Get address by ID
     * @param {number} addressId
     * @return {Promise<{success: boolean, data?: Address, error?: string}>}
     */
    async getByAddressId(addressId) {
        try {
            if (!addressId || !Number.isInteger(addressId)) {
                return {
                    success: false,
                    error: 'Invalid addressId'
                };
            }

            const result = await withConnection(async (connection) => {
                const repo = new AddressDAO(connection);
                return await repo.getByAddressId(addressId);
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
     * Create a new address
     * @param {Object} addressData
     * @return {Promise<{success: boolean, data?: Address, error?: string}>}
     */
    async createAddress(addressData) {
        try {
            const result = await withTransaction(async (connection) => {
                const repo = new AddressDAO(connection);
                return await repo.createAddress(addressData);
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
     * Update an address
     * @param {number} addressId
     * @param {Object} addressData
     * @return {Promise<{success: boolean, data?: Address, error?: string}>}
     */
    async updateAddress(addressId, addressData) {
        try {
            if (!addressId || !Number.isInteger(addressId)) {
                return {
                    success: false,
                    error: 'Invalid addressId'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new AddressDAO(connection);
                return await repo.updateAddress(addressId, addressData);
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
     * Delete an address
     * @param {number} addressId
     * @return {Promise<{success: boolean, error?: string}>}
     */
    async deleteAddress(addressId) {
        try {
            if (!addressId || !Number.isInteger(addressId)) {
                return {
                    success: false,
                    error: 'Invalid addressId'
                };
            }

            await withTransaction(async (connection) => {
                const repo = new AddressDAO(connection);
                return await repo.deleteAddress(addressId);
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

export default new AddressServices();

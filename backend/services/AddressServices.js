import { default as AddressDAO } from "../infrastructure/data/addressDAO.js";
import Address from "../models/Address.js";
import { withConnection, withTransaction } from "../infrastructure/connection/transactionHelper.js";
import LocationCityDAO from "../infrastructure/data/locationCityDAO.js";
import LocationWardDAO from "../infrastructure/data/locationWardDAO.js";
import LocationDistrictDAO from "../infrastructure/data/locationDistrictDAO.js";
import LocationCity from "../models/LocationCity.js";
import LocationWard from "../models/LocationWard.js";
import LocationDistrict from "../models/LocationDistrict.js";

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
     *
     *
     * @param {number[]} addressIds
     * @return {Promise<{success: boolean, data?: string[], error?: string}>} 
     * @memberof AddressServices
     */
async getStringNameAddressByIds(addressIds) {
    try {
        if (!Array.isArray(addressIds) || addressIds.length === 0) {
            return {
                success: false,
                error: 'addressIds must be a non-empty array'
            };
        }

        const results = await withConnection(async (connection) => {
            const repo = new AddressDAO(connection);
            const CityRepo = new LocationCityDAO(connection);
            const wardRepo = new LocationWardDAO(connection);
            const districtRepo = new LocationDistrictDAO(connection);
            console.log('Address IDs:', addressIds);

            // Đảm bảo thứ tự khớp với addressIds
            const addresses = await Promise.all(addressIds.map(async (id) => {
                const address = await repo.getByAddressId(id);
                if (!address) return null;
                const city = await CityRepo._protectedGetById(address.address_city_id); 
                const district = await districtRepo._protectedGetById(address.address_district_id);
                const ward = await wardRepo._protectedGetById(address.address_ward_id);
                if (city && city.location_city_name && district && district.location_district_name && ward && ward.location_ward_name) {
                    return {
                        ...address,
                        
                        city_name: city.location_city_name,
                        district_name: district.location_district_name,
                        ward_name: ward.location_ward_name
                    };
                }
                return null;
            }));

            return addresses.map(addr => {
                if (!addr) return ""; // hoặc "Không xác định"
                const parts = [
                    addr.address_number,
                    addr.ward_name,
                    addr.district_name,
                    addr.city_name
                ].filter(part => part);
                return parts.join(', ');
            });
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

export default AddressServices;

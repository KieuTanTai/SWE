import { default as BusDAO } from "../infrastructure/data/busDAO.js";
import { Bus } from "../index.js";
import { withConnection, withTransaction } from "../infrastructure/connection/transactionHelper.js";

/**
 * BusServices
 * Service layer for managing buses
 * Manages its own database connections and transactions
 */
class BusServices {
    /**
     * Get all buses
     * @return {Promise<{success: boolean, data?: Bus[], error?: string}>}
     */
    async getAllBuses() {
        try {
            const results = await withConnection(async (connection) => {
                const repo = new BusDAO(connection);
                return await repo.getAllBuses();
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
     * Get bus by ID
     * @param {number} busId
     * @return {Promise<{success: boolean, data?: Bus, error?: string}>}
     */
    async getByBusId(busId) {
        try {
            if (!busId || !Number.isInteger(busId)) {
                return {
                    success: false,
                    error: 'Invalid busId'
                };
            }

            const result = await withConnection(async (connection) => {
                const repo = new BusDAO(connection);
                return await repo.getByBusId(busId);
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
     * Get buses by multiple IDs
     * @param {number[]} busIds
     * @return {Promise<{success: boolean, data?: Bus[], error?: string}>}
     */
    async getByBusIds(busIds) {
        try {
            if (!Array.isArray(busIds) || busIds.length === 0) {
                return {
                    success: false,
                    error: 'Invalid busIds array'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new BusDAO(connection);
                return await repo.getByBusIds(busIds);
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
     * Get buses by status
     * @param {boolean} busStatus
     * @return {Promise<{success: boolean, data?: Bus[], error?: string}>}
     */
    async getByBusStatus(busStatus) {
        try {
            if (!busStatus || typeof busStatus !== 'string') {
                return {
                    success: false,
                    error: 'Invalid busStatus'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new BusDAO(connection);
                return await repo.getByBusStatus(busStatus);
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
     * Get buses by brand
     * @param {string} busBrand
     * @return {Promise<{success: boolean, data?: Bus[], error?: string}>}
     */
    async getByBusBrand(busBrand) {
        try {
            if (!busBrand || typeof busBrand !== 'string') {
                return {
                    success: false,
                    error: 'Invalid busBrand'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new BusDAO(connection);
                return await repo.getByBusBrand(busBrand);
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
     * Get buses by model
     * @param {string} busModel
     * @return {Promise<{success: boolean, data?: Bus[], error?: string}>}
     */
    async getByBusModel(busModel) {
        try {
            if (!busModel || typeof busModel !== 'string') {
                return {
                    success: false,
                    error: 'Invalid busModel'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new BusDAO(connection);
                return await repo.getByBusModel(busModel);
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
     * Get bus by license plate
     * @param {string} busLicensePlate
     * @return {Promise<{success: boolean, data?: Bus, error?: string}>}
     */
    async getByLicensePlate(busLicensePlate) {
        try {
            if (!busLicensePlate || typeof busLicensePlate !== 'string') {
                return {
                    success: false,
                    error: 'Invalid busLicensePlate'
                };
            }

            const result = await withConnection(async (connection) => {
                const repo = new BusDAO(connection);
                return await repo.getByLicensePlate(busLicensePlate);
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
     * Create a new bus
     * @param {Bus} bus
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async createBus(bus) {
        try {
            if (!bus || !(bus instanceof Bus)) {
                return {
                    success: false,
                    error: 'Invalid bus object'
                };
            }

            const busId = await withTransaction(async (connection) => {
                const repo = new BusDAO(connection);
                return await repo.createBus(bus);
            });
            
            return {
                success: true,
                data: busId
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Update a bus
     * @param {Bus} bus
     * @return {Promise<{success: boolean, data?: boolean, error?: string}>}
     */
    async updateBus(bus) {
        try {
            if (!bus || !(bus instanceof Bus)) {
                return {
                    success: false,
                    error: 'Invalid bus object'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new BusDAO(connection);
                return await repo.updateBus(bus);
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
     * Update multiple buses
     * @param {Bus[]} buses
     * @return {Promise<{success: boolean, data?: boolean, error?: string}>}
     */
    async updateBuses(buses) {
        try {
            if (!Array.isArray(buses) || buses.length === 0) {
                return {
                    success: false,
                    error: 'Invalid buses array'
                };
            }

            if (!buses.every(b => b instanceof Bus)) {
                return {
                    success: false,
                    error: 'All items must be Bus instances'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new BusDAO(connection);
                return await repo.updateBuses(buses);
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
     * Delete a bus
     * @param {number} busId
     * @return {Promise<{success: boolean, data?: boolean, error?: string}>}
     */
    async deleteBus(busId) {
        try {
            if (!busId || !Number.isInteger(busId)) {
                return {
                    success: false,
                    error: 'Invalid busId'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new BusDAO(connection);
                return await repo.deleteBus(busId);
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
}

export default BusServices;
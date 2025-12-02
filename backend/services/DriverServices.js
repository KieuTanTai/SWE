import { default as DriverDAO } from "../infrastructure/data/driverDAO.js";
import { default as PersonDAO } from "../infrastructure/data/personDAO.js";
import Driver from "../models/Driver.js";
import { withConnection, withTransaction } from "../infrastructure/connection/transactionHelper.js";

/**
 * DriverServices
 * Service layer for managing drivers
 * Manages its own database connections and transactions
 */
class DriverServices {
    /**
     * Get all drivers
     * @return {Promise<{success: boolean, data?: Driver[], error?: string}>}
     */
    async getAllDrivers() {
        try {
            const results = await withConnection(async (connection) => {
                const driverRepo = new DriverDAO(connection);
                const personRepo = new PersonDAO(connection);
                
                const drivers = await driverRepo.getAllDrivers();
                if (drivers.length === 0) return drivers;
                
                // Load person navigation property
                const personIds = drivers.map(d => d.driver_person_id).filter(id => id);
                if (personIds.length > 0) {
                    const persons = await personRepo.getByPersonIds(personIds);
                    const personMap = new Map(persons.map(p => [p.person_id, p]));
                    drivers.forEach(driver => {
                        driver.person = personMap.get(driver.driver_person_id) || null;
                    });
                }
                
                return drivers;
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
     * Get driver by person ID
     * @param {number} driverPersonId
     * @return {Promise<{success: boolean, data?: Driver, error?: string}>}
     */
    async getByDriverPersonId(driverPersonId) {
        try {
            if (!driverPersonId || !Number.isInteger(driverPersonId)) {
                return {
                    success: false,
                    error: 'Invalid driverPersonId'
                };
            }

            const result = await withConnection(async (connection) => {
                const driverRepo = new DriverDAO(connection);
                const personRepo = new PersonDAO(connection);
                
                const driver = await driverRepo.getByDriverPersonId(driverPersonId);
                if (driver && driver.driver_person_id) {
                    driver.person = await personRepo.getByPersonId(driver.driver_person_id);
                }
                
                return driver;
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
     * Get drivers by multiple person IDs
     * @param {number[]} driverPersonIds
     * @return {Promise<{success: boolean, data?: Driver[], error?: string}>}
     */
    async getByDriverPersonIds(driverPersonIds) {
        try {
            if (!Array.isArray(driverPersonIds) || driverPersonIds.length === 0) {
                return {
                    success: false,
                    error: 'Invalid driverPersonIds array'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new DriverDAO(connection);
                return await repo.getByDriverPersonIds(driverPersonIds);
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
     * Get drivers by experience type
     * @param {string} experienceType - 'year' or 'month'
     * @return {Promise<{success: boolean, data?: Driver[], error?: string}>}
     */
    async getByExperienceType(experienceType) {
        try {
            if (!experienceType || !['year', 'month'].includes(experienceType)) {
                return {
                    success: false,
                    error: 'Invalid experienceType. Must be "year" or "month"'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new DriverDAO(connection);
                return await repo.getByExperienceType(experienceType);
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
     * Get drivers by minimum experience
     * @param {number} minExperience
     * @param {string} experienceType - 'year' or 'month'
     * @return {Promise<{success: boolean, data?: Driver[], error?: string}>}
     */
    async getByMinExperience(minExperience, experienceType = 'year') {
        try {
            if (!minExperience || !Number.isInteger(minExperience) || minExperience < 0) {
                return {
                    success: false,
                    error: 'Invalid minExperience'
                };
            }

            if (!['year', 'month'].includes(experienceType)) {
                return {
                    success: false,
                    error: 'Invalid experienceType. Must be "year" or "month"'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new DriverDAO(connection);
                return await repo.getByMinExperience(minExperience, experienceType);
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
     * Get drivers by maximum late arrival count
     * @param {number} maxLateArrivalCount
     * @return {Promise<{success: boolean, data?: Driver[], error?: string}>}
     */
    async getByMaxLateArrivalCount(maxLateArrivalCount) {
        try {
            if (!Number.isInteger(maxLateArrivalCount) || maxLateArrivalCount < 0) {
                return {
                    success: false,
                    error: 'Invalid maxLateArrivalCount'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new DriverDAO(connection);
                return await repo.getByMaxLateArrivalCount(maxLateArrivalCount);
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
     * Create a new driver
     * @param {Driver} driver
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async createDriver(driver) {
        try {
            if (!driver || !(driver instanceof Driver)) {
                return {
                    success: false,
                    error: 'Invalid driver object'
                };
            }

            const driverPersonId = await withTransaction(async (connection) => {
                const repo = new DriverDAO(connection);
                return await repo.createDriver(driver);
            });
            
            return {
                success: true,
                data: driverPersonId
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create multiple drivers
     * @param {Driver[]} drivers
     * @return {Promise<{success: boolean, data?: number[], error?: string}>}
     */
    async createDrivers(drivers) {
        try {
            if (!Array.isArray(drivers) || drivers.length === 0) {
                return {
                    success: false,
                    error: 'Invalid drivers array'
                };
            }

            if (!drivers.every(d => d instanceof Driver)) {
                return {
                    success: false,
                    error: 'All items must be Driver instances'
                };
            }

            const driverPersonIds = await withTransaction(async (connection) => {
                const repo = new DriverDAO(connection);
                return await repo.createDrivers(drivers);
            });
            
            return {
                success: true,
                data: driverPersonIds
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Update driver experience
     * @param {number} driverPersonId
     * @param {number} newExperience
     * @param {string} experienceType - 'year' or 'month'
     * @return {Promise<{success: boolean, data?: boolean, error?: string}>}
     */
    async updateExperience(driverPersonId, newExperience, experienceType) {
        try {
            if (!driverPersonId || !Number.isInteger(driverPersonId)) {
                return {
                    success: false,
                    error: 'Invalid driverPersonId'
                };
            }

            if (!Number.isInteger(newExperience) || newExperience < 0) {
                return {
                    success: false,
                    error: 'Invalid newExperience'
                };
            }

            if (!['year', 'month'].includes(experienceType)) {
                return {
                    success: false,
                    error: 'Invalid experienceType. Must be "year" or "month"'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new DriverDAO(connection);
                return await repo.updateExperience(driverPersonId, newExperience, experienceType);
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
     * Update driver late arrival count
     * @param {number} driverPersonId
     * @param {number} newLateArrivalCount
     * @return {Promise<{success: boolean, data?: boolean, error?: string}>}
     */
    async updateLateArrivalCount(driverPersonId, newLateArrivalCount) {
        try {
            if (!driverPersonId || !Number.isInteger(driverPersonId)) {
                return {
                    success: false,
                    error: 'Invalid driverPersonId'
                };
            }

            if (!Number.isInteger(newLateArrivalCount) || newLateArrivalCount < 0) {
                return {
                    success: false,
                    error: 'Invalid newLateArrivalCount'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new DriverDAO(connection);
                return await repo.updateLateArrivalCount(driverPersonId, newLateArrivalCount);
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
     * Increment driver late arrival count by 1
     * @param {number} driverPersonId
     * @return {Promise<{success: boolean, data?: boolean, error?: string}>}
     */
    async incrementLateArrivalCount(driverPersonId) {
        try {
            if (!driverPersonId || !Number.isInteger(driverPersonId)) {
                return {
                    success: false,
                    error: 'Invalid driverPersonId'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new DriverDAO(connection);
                return await repo.incrementLateArrivalCount(driverPersonId);
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
     * Update multiple drivers' experiences
     * @param {Driver[]} drivers - Array of drivers with updated experience
     * @return {Promise<{success: boolean, data?: boolean, error?: string}>}
     */
    async updateExperiences(drivers) {
        try {
            if (!Array.isArray(drivers) || drivers.length === 0) {
                return {
                    success: false,
                    error: 'Invalid drivers array'
                };
            }

            if (!drivers.every(d => d instanceof Driver)) {
                return {
                    success: false,
                    error: 'All items must be Driver instances'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new DriverDAO(connection);
                return await repo.updateExperiences(drivers);
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
     * Update multiple drivers' late arrival counts
     * @param {Driver[]} drivers - Array of drivers with updated late arrival counts
     * @return {Promise<{success: boolean, data?: boolean, error?: string}>}
     */
    async updateLateArrivalCounts(drivers) {
        try {
            if (!Array.isArray(drivers) || drivers.length === 0) {
                return {
                    success: false,
                    error: 'Invalid drivers array'
                };
            }

            if (!drivers.every(d => d instanceof Driver)) {
                return {
                    success: false,
                    error: 'All items must be Driver instances'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new DriverDAO(connection);
                return await repo.updateLateArrivalCounts(drivers);
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
     * Delete a driver
     * @param {number} driverPersonId
     * @return {Promise<{success: boolean, data?: boolean, error?: string}>}
     */
    async deleteDriver(driverPersonId) {
        try {
            if (!driverPersonId || !Number.isInteger(driverPersonId)) {
                return {
                    success: false,
                    error: 'Invalid driverPersonId'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new DriverDAO(connection);
                return await repo.deleteDriver(driverPersonId);
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
     * Delete multiple drivers
     * @param {number[]} driverPersonIds
     * @return {Promise<{success: boolean, data?: boolean, error?: string}>}
     */
    async deleteDrivers(driverPersonIds) {
        try {
            if (!Array.isArray(driverPersonIds) || driverPersonIds.length === 0) {
                return {
                    success: false,
                    error: 'Invalid driverPersonIds array'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new DriverDAO(connection);
                return await repo.deleteDrivers(driverPersonIds);
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

export default DriverServices;
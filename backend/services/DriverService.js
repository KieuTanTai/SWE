import { default as DriverDAO } from "../infrastructure/data/driverDAO.js";
import Driver from "../models/Driver.js";

/**
 * DriverService
 * Service layer for managing drivers
 */
class DriverService {
    /**
     * @param {DriverDAO} driverRepository
     */
    constructor(driverRepository) {
        this.driverRepository = driverRepository;
    }

    /**
     * Get all drivers
     * @return {Promise<{success: boolean, data?: Driver[], error?: string}>}
     */
    async getAllDrivers() {
        try {
            const results = await this.driverRepository.getAllDrivers();
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

            const result = await this.driverRepository.getByDriverPersonId(driverPersonId);
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

            const results = await this.driverRepository.getByDriverPersonIds(driverPersonIds);
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
            if (!experienceType || typeof experienceType !== 'string') {
                return {
                    success: false,
                    error: 'Invalid experienceType'
                };
            }

            const results = await this.driverRepository.getByExperienceType(experienceType);
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
     * Get drivers with minimum experience
     * @param {number} minExperience
     * @return {Promise<{success: boolean, data?: Driver[], error?: string}>}
     */
    async getByMinExperience(minExperience) {
        try {
            if (!Number.isInteger(minExperience)) {
                return {
                    success: false,
                    error: 'Invalid minExperience'
                };
            }

            const results = await this.driverRepository.getByMinExperience(minExperience);
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
     * Get drivers with maximum late arrival count
     * @param {number} maxLateCount
     * @return {Promise<{success: boolean, data?: Driver[], error?: string}>}
     */
    async getByMaxLateArrivalCount(maxLateCount) {
        try {
            if (!Number.isInteger(maxLateCount)) {
                return {
                    success: false,
                    error: 'Invalid maxLateCount'
                };
            }

            const results = await this.driverRepository.getByMaxLateArrivalCount(maxLateCount);
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
            if (!(driver instanceof Driver)) {
                return {
                    success: false,
                    error: 'Invalid driver object'
                };
            }

            const result = await this.driverRepository.createDriver(driver);
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to create driver'
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
     * Create multiple drivers
     * @param {Driver[]} drivers
     * @return {Promise<{success: boolean, data?: number|number[], error?: string}>}
     */
    async createDrivers(drivers) {
        try {
            if (!Array.isArray(drivers) || drivers.length === 0) {
                return {
                    success: false,
                    error: 'Invalid drivers array'
                };
            }

            const result = await this.driverRepository.createDrivers(drivers);
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to create drivers'
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
     * Update driver experience
     * @param {number} driverPersonId
     * @param {number} newExperience
     * @param {string} experienceType - 'year' or 'month'
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateExperience(driverPersonId, newExperience, experienceType) {
        try {
            if (!driverPersonId || !Number.isInteger(driverPersonId)) {
                return {
                    success: false,
                    error: 'Invalid driverPersonId'
                };
            }

            const result = await this.driverRepository.updateExperience(driverPersonId, newExperience, experienceType);
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update experience'
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
     * Update driver late arrival count
     * @param {number} driverPersonId
     * @param {number} newCount
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateLateArrivalCount(driverPersonId, newCount) {
        try {
            if (!driverPersonId || !Number.isInteger(driverPersonId)) {
                return {
                    success: false,
                    error: 'Invalid driverPersonId'
                };
            }

            const result = await this.driverRepository.updateLateArrivalCount(driverPersonId, newCount);
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update late arrival count'
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
     * Increment driver late arrival count by 1
     * @param {number} driverPersonId
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async incrementLateArrivalCount(driverPersonId) {
        try {
            if (!driverPersonId || !Number.isInteger(driverPersonId)) {
                return {
                    success: false,
                    error: 'Invalid driverPersonId'
                };
            }

            const result = await this.driverRepository.incrementLateArrivalCount(driverPersonId);
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to increment late arrival count'
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
     * Update experiences of multiple drivers
     * @param {Array<{driver_person_id: number, driver_experience: number, driver_experience_type: string}>} drivers
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateExperiences(drivers) {
        try {
            if (!Array.isArray(drivers) || drivers.length === 0) {
                return {
                    success: false,
                    error: 'Invalid drivers array'
                };
            }

            const result = await this.driverRepository.updateExperiences(drivers);
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update experiences'
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
     * Update late arrival counts of multiple drivers
     * @param {Array<{driver_person_id: number, driver_late_arrival_count: number}>} drivers
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateLateArrivalCounts(drivers) {
        try {
            if (!Array.isArray(drivers) || drivers.length === 0) {
                return {
                    success: false,
                    error: 'Invalid drivers array'
                };
            }

            const result = await this.driverRepository.updateLateArrivalCounts(drivers);
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update late arrival counts'
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
     * Delete driver by person ID
     * @param {number} driverPersonId
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async deleteDriver(driverPersonId) {
        try {
            if (!driverPersonId || !Number.isInteger(driverPersonId)) {
                return {
                    success: false,
                    error: 'Invalid driverPersonId'
                };
            }

            const result = await this.driverRepository.deleteDriver(driverPersonId);
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to delete driver'
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
     * Delete multiple drivers by person IDs
     * @param {number[]} driverPersonIds
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async deleteDrivers(driverPersonIds) {
        try {
            if (!Array.isArray(driverPersonIds) || driverPersonIds.length === 0) {
                return {
                    success: false,
                    error: 'Invalid driverPersonIds array'
                };
            }

            const result = await this.driverRepository.deleteDrivers(driverPersonIds);
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to delete drivers'
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

export default DriverService;

import { default as PickupScheduleDAO } from "../infrastructure/data/pickupScheduleDAO.js";
import { default as StudentDAO } from "../infrastructure/data/studentDAO.js";
import PickupSchedule from "../models/PickupSchedule.js";
import { withConnection, withTransaction } from "../infrastructure/connection/transactionHelper.js";

/**
 * PickupScheduleServices
 * Service layer for managing pickup schedules
 * Manages its own database connections and transactions
 */
class PickupScheduleServices {
    /**
     * Get all pickup schedules
     * @return {Promise<{success: boolean, data?: PickupSchedule[], error?: string}>}
     */
    async getAllPickupSchedules() {
        try {
            const results = await withConnection(async (connection) => {
                const pickupRepo = new PickupScheduleDAO(connection);
                const studentRepo = new StudentDAO(connection);
                
                const pickupSchedules = await pickupRepo.getAllPickupSchedules();
                
                if (pickupSchedules.length === 0) {
                    return [];
                }
                // Load students
                const students = await studentRepo.getAllStudents();
                const studentMap = new Map(students.map(s => [s.student_id, s]));
                
                // Attach students to pickup schedules
                pickupSchedules.forEach(pickup => {
                    pickup.student = studentMap.get(pickup.pickup_schedule_student_id) || null;
                });
                
                return pickupSchedules;
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
     * Get pickup schedule by ID
     * @param {number} pickupScheduleId
     * @return {Promise<{success: boolean, data?: PickupSchedule, error?: string}>}
     */
    async getByPickupScheduleId(pickupScheduleId) {
        try {
            if (!pickupScheduleId || !Number.isInteger(pickupScheduleId)) {
                return {
                    success: false,
                    error: 'Invalid pickupScheduleId'
                };
            }

            const result = await withConnection(async (connection) => {
                const pickupRepo = new PickupScheduleDAO(connection);
                const studentRepo = new StudentDAO(connection);
                
                const pickup = await pickupRepo.getByPickupScheduleId(pickupScheduleId);
                
                if (pickup && pickup.pickup_schedule_student_id) {
                    pickup.student = await studentRepo.getByStudentId(pickup.pickup_schedule_student_id);
                }
                
                return pickup;
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

    
    async getByDetailScheduleId(detailScheduleId) {
        try {
            if (!detailScheduleId || !Number.isInteger(detailScheduleId)) {
                return {
                    success: false,
                    error: 'Invalid detailScheduleId'
                };
            }

            const result = await withConnection(async (connection) => {
                const pickupRepo = new PickupScheduleDAO(connection);
                const studentRepo = new StudentDAO(connection);
                
                const pickupSchedules = await pickupRepo.getByDetailScheduleId(detailScheduleId);
                
                if (pickupSchedules.length === 0) {
                    return [];
                }
                // Load students
                const students = await studentRepo.getAllStudents();
                const studentMap = new Map(students.map(s => [s.student_id, s]));
                
                // Attach students to pickup schedules
                pickupSchedules.forEach(pickup => {
                    pickup.student = studentMap.get(pickup.pickup_schedule_student_id) || null;
                });
                
                return pickupSchedules;
            });
            
            return result;
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get pickup schedule by studentId
     * @param {number} studentId
     * @return {Promise<{success: boolean, data?: PickupSchedule, error?: string}>}
     */
    async getByStudentId(studentId) {
        if(!studentId || !Number.isInteger(studentId)) {
            return {
            success: false,
            error: `Invalid student id: ${studentId}`
            }
        };
        try {
            const result = await withConnection(async (connection) => {
                const repo = new PickupScheduleDAO(connection);
                return repo.getByStudentId(studentId)
            })

            return {
                success: true,
                data: result
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create a new pickup schedule
     * @param {Object} scheduleData
     * @return {Promise<{success: boolean, data?: PickupSchedule, error?: string}>}
     */
    async createPickupSchedule(scheduleData) {
        try {
            const result = await withTransaction(async (connection) => {
                const repo = new PickupScheduleDAO(connection);
                return await repo.createPickupSchedule(scheduleData);
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
     * Update a pickup schedule
     * @param {number} pickupScheduleId
     * @param {Object} scheduleData
     * @return {Promise<{success: boolean, data?: PickupSchedule, error?: string}>}
     */
    async updatePickupSchedule(pickupScheduleId, scheduleData) {
        try {
            if (!pickupScheduleId || !Number.isInteger(pickupScheduleId)) {
                return {
                    success: false,
                    error: 'Invalid pickupScheduleId'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new PickupScheduleDAO(connection);
                return await repo.updatePickupSchedule(pickupScheduleId, scheduleData);
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
     * Delete a pickup schedule
     * @param {number} pickupScheduleId
     * @return {Promise<{success: boolean, error?: string}>}
     */
    async deletePickupSchedule(pickupScheduleId) {
        try {
            if (!pickupScheduleId || !Number.isInteger(pickupScheduleId)) {
                return {
                    success: false,
                    error: 'Invalid pickupScheduleId'
                };
            }

            await withTransaction(async (connection) => {
                const repo = new PickupScheduleDAO(connection);
                return await repo.deletePickupSchedule(pickupScheduleId);
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

    async getPickupScheduleDate(pickup_schedule_id) {
        
    }
}

export default new PickupScheduleServices();

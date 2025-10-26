import { default as StudentDAO } from "../infrastructure/data/studentDAO.js";
import Student from "../models/Student.js";
import { withConnection, withTransaction } from "../infrastructure/connection/transactionHelper.js";

/**
 * StudentServices
 * Service layer for managing students
 * Manages its own database connections and transactions
 */
class StudentServices {
    /**
     * Get all students
     * @return {Promise<{success: boolean, data?: Student[], error?: string}>}
     */
    async getAllStudents() {
        try {
            const results = await withConnection(async (connection) => {
                const repo = new StudentDAO(connection);
                return await repo.getAllStudents();
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
     * Get student by ID
     * @param {number} studentId
     * @return {Promise<{success: boolean, data?: Student, error?: string}>}
     */
    async getByStudentId(studentId) {
        try {
            if (!studentId || !Number.isInteger(studentId)) {
                return {
                    success: false,
                    error: 'Invalid studentId'
                };
            }

            const result = await withConnection(async (connection) => {
                const repo = new StudentDAO(connection);
                return await repo.getByStudentId(studentId);
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
     * Get students by multiple IDs
     * @param {number[]} studentIds
     * @return {Promise<{success: boolean, data?: Student[], error?: string}>}
     */
    async getByStudentIds(studentIds) {
        try {
            if (!Array.isArray(studentIds) || studentIds.length === 0) {
                return {
                    success: false,
                    error: 'Invalid studentIds array'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new StudentDAO(connection);
                return await repo.getByStudentIds(studentIds);
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
     * Get student by person ID
     * @param {number} personId
     * @return {Promise<{success: boolean, data?: Student, error?: string}>}
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
                const repo = new StudentDAO(connection);
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
     * Get students by parent ID
     * @param {number} parentId
     * @return {Promise<{success: boolean, data?: Student[], error?: string}>}
     */
    async getByParentId(parentId) {
        try {
            if (!parentId || !Number.isInteger(parentId)) {
                return {
                    success: false,
                    error: 'Invalid parentId'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new StudentDAO(connection);
                return await repo.getByParentId(parentId);
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
     * Get students by grade
     * @param {number} grade
     * @return {Promise<{success: boolean, data?: Student[], error?: string}>}
     */
    async getByGrade(grade) {
        try {
            if (!grade || !Number.isInteger(grade)) {
                return {
                    success: false,
                    error: 'Invalid grade'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new StudentDAO(connection);
                return await repo.getByGrade(grade);
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
     * Create a new student
     * @param {Student} student
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async createStudent(student) {
        try {
            if (!(student instanceof Student)) {
                return {
                    success: false,
                    error: 'Invalid student object'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new StudentDAO(connection);
                return await repo.createStudent(student);
            });
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to create student'
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
     * Update student
     * @param {number} studentId
     * @param {Student} student
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateStudent(studentId, student) {
        try {
            if (!studentId || !Number.isInteger(studentId)) {
                return {
                    success: false,
                    error: 'Invalid studentId'
                };
            }

            if (!(student instanceof Student)) {
                return {
                    success: false,
                    error: 'Invalid student object'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new StudentDAO(connection);
                return await repo.updateStudent(studentId, student);
            });
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update student'
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
     * Delete student
     * @param {number} studentId
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async deleteStudent(studentId) {
        try {
            if (!studentId || !Number.isInteger(studentId)) {
                return {
                    success: false,
                    error: 'Invalid studentId'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new StudentDAO(connection);
                return await repo.deleteStudent(studentId);
            });
            
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to delete student'
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
     * Check if person is already a student
     * @param {number} personId
     * @return {Promise<{success: boolean, data?: boolean, error?: string}>}
     */
    async isPersonStudent(personId) {
        try {
            if (!personId || !Number.isInteger(personId)) {
                return {
                    success: false,
                    error: 'Invalid personId'
                };
            }

            const result = await withConnection(async (connection) => {
                const repo = new StudentDAO(connection);
                return await repo.isPersonStudent(personId);
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

export default StudentServices;

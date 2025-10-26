import Student from "../../models/Student.js";
import * as PersonModule from "../../models/Person.js";
const Person = PersonModule.default || PersonModule;
import BaseDAO from "./baseDAO.js";
import dbSchema from "./dbSchema.js";
import mysql from "mysql2/promise";

/**
 * Student Data Access Object - Complete Version
 * Handles all database operations for Student entity
 */
class StudentDAO extends BaseDAO {
    /**
     * Creates an instance of StudentDAO.
     * @param {mysql.PoolConnection} connection
     * @memberof StudentDAO
     */
    constructor(connection) {
        super(connection, dbSchema.TABLES.STUDENT, dbSchema.STUDENT_COLUMNS.STUDENT_ID);
    }

    // ============ 1. GET ALL WITH FILTERS ============
    /**
     * Get all students with optional filtering
     * @param {Object} [filters={}] - Optional filters
     * @param {number} [filters.grade] - Filter by grade (1-12)
     * @param {number} [filters.parentId] - Filter by parent ID
     * @param {boolean} [filters.activeOnly] - Only active students
     * @return {Promise<Student[]>}
     */
    async getAllStudents(filters = {}) {
        try {
            let whereClause = '1=1';
            const params = [];

            // All filters are optional
            if (filters.grade !== undefined && filters.grade !== null) {
                whereClause += ` AND s.${dbSchema.STUDENT_COLUMNS.STUDENT_GRADE} = ?`;
                params.push(filters.grade);
            }

            if (filters.parentId !== undefined && filters.parentId !== null) {
                whereClause += ` AND s.${dbSchema.STUDENT_COLUMNS.STUDENT_PARENT_ID} = ?`;
                params.push(filters.parentId);
            }

            if (filters.activeOnly === true) {
                whereClause += ` AND p.${dbSchema.PERSON_COLUMNS.PERSON_LIFE_CYCLE_STATUS} = TRUE`;
            }

            const sql = `
                SELECT 
                    s.${dbSchema.STUDENT_COLUMNS.STUDENT_ID},
                    s.${dbSchema.STUDENT_COLUMNS.STUDENT_PARENT_ID},
                    s.${dbSchema.STUDENT_COLUMNS.STUDENT_PERSON_ID},
                    s.${dbSchema.STUDENT_COLUMNS.STUDENT_GRADE},
                    p.${dbSchema.PERSON_COLUMNS.PERSON_NAME} as person_name,
                    p.${dbSchema.PERSON_COLUMNS.PERSON_PHONE} as person_phone,
                    p.${dbSchema.PERSON_COLUMNS.PERSON_GENDER} as person_gender,
                    p.${dbSchema.PERSON_COLUMNS.PERSON_BIRTHDAY} as person_birthday,
                    p.${dbSchema.PERSON_COLUMNS.PERSON_LIFE_CYCLE_STATUS} as person_active,
                    parent_p.${dbSchema.PERSON_COLUMNS.PERSON_NAME} as parent_name
                FROM ${dbSchema.TABLES.STUDENT} s
                INNER JOIN ${dbSchema.TABLES.PERSON} p ON s.${dbSchema.STUDENT_COLUMNS.STUDENT_PERSON_ID} = p.${dbSchema.PERSON_COLUMNS.PERSON_ID}
                LEFT JOIN ${dbSchema.TABLES.PARENT} pr ON s.${dbSchema.STUDENT_COLUMNS.STUDENT_PARENT_ID} = pr.${dbSchema.PARENT_COLUMNS.PARENT_PERSON_ID}
                LEFT JOIN ${dbSchema.TABLES.PERSON} parent_p ON pr.${dbSchema.PARENT_COLUMNS.PARENT_PERSON_ID} = parent_p.${dbSchema.PERSON_COLUMNS.PERSON_ID}
                WHERE ${whereClause}
                ORDER BY s.${dbSchema.STUDENT_COLUMNS.STUDENT_ID}
            `;

            const [results] = await this.connection.execute(sql, params);

            if (!results || results.length === 0) {
                console.info('No students found with provided filters');
                return [];
            }

            return results.map(row => this._mapRowToStudent(row));
        } catch (error) {
            console.error(`Error in getAllStudents: ${error.message}`);
            return [];
        }
    }

    // ============ 2. GET BY ID ============
    /**
     * Get student by ID with full details
     * @param {number} studentId - Student ID
     * @return {Promise<Student|null>}
     */
    async getStudentById(studentId) {
        if (!Number.isInteger(Number(studentId)) || Number(studentId) <= 0) {
            console.warn(`Warning: Invalid studentId: ${studentId}`);
            return new Student({});
        }

        try {
            const sql = `
                SELECT 
                    s.${dbSchema.STUDENT_COLUMNS.STUDENT_ID},
                    s.${dbSchema.STUDENT_COLUMNS.STUDENT_PARENT_ID},
                    s.${dbSchema.STUDENT_COLUMNS.STUDENT_PERSON_ID},
                    s.${dbSchema.STUDENT_COLUMNS.STUDENT_GRADE},
                    p.${dbSchema.PERSON_COLUMNS.PERSON_NAME} as person_name,
                    p.${dbSchema.PERSON_COLUMNS.PERSON_PHONE} as person_phone,
                    p.${dbSchema.PERSON_COLUMNS.PERSON_GENDER} as person_gender,
                    p.${dbSchema.PERSON_COLUMNS.PERSON_BIRTHDAY} as person_birthday,
                    p.${dbSchema.PERSON_COLUMNS.PERSON_LIFE_CYCLE_STATUS} as person_active,
                    parent_p.${dbSchema.PERSON_COLUMNS.PERSON_NAME} as parent_name,
                    parent_p.${dbSchema.PERSON_COLUMNS.PERSON_PHONE} as parent_phone
                FROM ${dbSchema.TABLES.STUDENT} s
                INNER JOIN ${dbSchema.TABLES.PERSON} p ON s.${dbSchema.STUDENT_COLUMNS.STUDENT_PERSON_ID} = p.${dbSchema.PERSON_COLUMNS.PERSON_ID}
                LEFT JOIN ${dbSchema.TABLES.PARENT} pr ON s.${dbSchema.STUDENT_COLUMNS.STUDENT_PARENT_ID} = pr.${dbSchema.PARENT_COLUMNS.PARENT_PERSON_ID}
                LEFT JOIN ${dbSchema.TABLES.PERSON} parent_p ON pr.${dbSchema.PARENT_COLUMNS.PARENT_PERSON_ID} = parent_p.${dbSchema.PERSON_COLUMNS.PERSON_ID}
                WHERE s.${dbSchema.STUDENT_COLUMNS.STUDENT_ID} = ?
            `;

            const [results] = await this.connection.execute(sql, [studentId]);

            if (!results || results.length === 0) {
                console.warn(`Warning: No data found for studentId ${studentId}`);
                return new Student({});
            }

            return this._mapRowToStudent(results[0]);
        } catch (error) {
            console.error(`Error in getStudentById: ${error.message}`);
            return new Student({});
        }
    }

    // ============ 3. CREATE STUDENT ============
    /**
     * Create a new student
     * @param {Student} student - Student object
     * @return {Promise<number>} - Created student ID
     */
    async createStudent(student) {
        if (!(student instanceof Student)) {
            console.warn(`Warning: Invalid student object`);
            return -1;
        }

        // Validate required fields
        if (!student.student_parent_id || !student.student_person_id) {
            console.warn('Warning: student_parent_id and student_person_id are required');
            return -1;
        }

        try {
            const studentData = {
                [dbSchema.STUDENT_COLUMNS.STUDENT_PARENT_ID]: student.student_parent_id,
                [dbSchema.STUDENT_COLUMNS.STUDENT_PERSON_ID]: student.student_person_id,
                [dbSchema.STUDENT_COLUMNS.STUDENT_GRADE]: student.student_grade || null
            };

            const result = await this._protectedCreate(studentData);
            return result;
        } catch (error) {
            console.error(`Error in createStudent: ${error.message}`);
            return -1;
        }
    }

    // ============ 4. UPDATE STUDENT ============
    /**
     * Update student information
     * @param {number} studentId - Student ID
     * @param {Object} updateData - Fields to update
     * @return {Promise<number>} - Number of affected rows
     */
    async updateStudent(studentId, updateData) {
        if (!Number.isInteger(Number(studentId)) || Number(studentId) <= 0) {
            console.warn(`Warning: Invalid studentId: ${studentId}`);
            return -1;
        }

        if (!updateData || typeof updateData !== 'object') {
            console.warn(`Warning: Invalid update data`);
            return -1;
        }

        try {
            // Check student exists first
            const existingStudent = await this.getStudentById(studentId);
            if (!existingStudent || !existingStudent.student_id) {
                console.warn(`Warning: Student not found: ${studentId}`);
                return -1;
            }

            const allowedFields = [
                dbSchema.STUDENT_COLUMNS.STUDENT_GRADE,
                dbSchema.STUDENT_COLUMNS.STUDENT_PARENT_ID
            ];

            const filteredData = {};

            for (const [key, value] of Object.entries(updateData)) {
                if (allowedFields.includes(key)) {
                    // Validate grade if being updated
                    if (key === dbSchema.STUDENT_COLUMNS.STUDENT_GRADE) {
                        if (value !== null && (!Number.isInteger(Number(value)) || Number(value) < 1 || Number(value) > 12)) {
                            console.warn('Warning: Grade must be between 1-12 or null');
                            return -1;
                        }
                    }
                    filteredData[key] = value;
                }
            }

            if (Object.keys(filteredData).length === 0) {
                console.warn('Warning: No valid fields to update');
                return -1;
            }

            const result = await this._protectedUpdateById(studentId, filteredData);
            return result;
        } catch (error) {
            console.error(`Error in updateStudent: ${error.message}`);
            return -1;
        }
    }

    // ============ 5. GET BY PARENT ID ============
    /**
     * Get students by parent ID
     * @param {number} parentId - Parent person ID
     * @return {Promise<Student[]>}
     */
    async getStudentsByParentId(parentId) {
        if (!Number.isInteger(Number(parentId)) || Number(parentId) <= 0) {
            console.warn(`Warning: Invalid parentId: ${parentId}`);
            return [];
        }

        return await this.getAllStudents({ parentId: Number(parentId) });
    }

    // ============ 6. SEARCH BY NAME PATTERN ============
    /**
     * Search students by name (partial match)
     * @param {string} namePattern - Name pattern to search
     * @return {Promise<Student[]>}
     */
    async getStudentsByNamePattern(namePattern) {
        if (!namePattern || typeof namePattern !== 'string' || namePattern.trim() === '') {
            console.warn(`Warning: Invalid name pattern: ${namePattern}`);
            return [];
        }

        try {
            const sql = `
                SELECT 
                    s.${dbSchema.STUDENT_COLUMNS.STUDENT_ID},
                    s.${dbSchema.STUDENT_COLUMNS.STUDENT_PARENT_ID},
                    s.${dbSchema.STUDENT_COLUMNS.STUDENT_PERSON_ID},
                    s.${dbSchema.STUDENT_COLUMNS.STUDENT_GRADE},
                    p.${dbSchema.PERSON_COLUMNS.PERSON_NAME} as person_name,
                    p.${dbSchema.PERSON_COLUMNS.PERSON_PHONE} as person_phone,
                    p.${dbSchema.PERSON_COLUMNS.PERSON_GENDER} as person_gender,
                    p.${dbSchema.PERSON_COLUMNS.PERSON_BIRTHDAY} as person_birthday
                FROM ${dbSchema.TABLES.STUDENT} s
                INNER JOIN ${dbSchema.TABLES.PERSON} p ON s.${dbSchema.STUDENT_COLUMNS.STUDENT_PERSON_ID} = p.${dbSchema.PERSON_COLUMNS.PERSON_ID}
                WHERE p.${dbSchema.PERSON_COLUMNS.PERSON_NAME} LIKE ?
                AND p.${dbSchema.PERSON_COLUMNS.PERSON_LIFE_CYCLE_STATUS} = TRUE
                ORDER BY p.${dbSchema.PERSON_COLUMNS.PERSON_NAME}
            `;

            const [results] = await this.connection.execute(sql, [`%${namePattern.trim()}%`]);

            return results ? results.map(row => this._mapRowToStudent(row)) : [];
        } catch (error) {
            console.error(`Error in getStudentsByNamePattern: ${error.message}`);
            return [];
        }
    }

    // ============ 7. HELPER - MAP ROW TO STUDENT ============
    /**
     * Map database row to a Student object with person info
     * @param {Object} row - Database row
     * @return {Student} - Student object with nested person/parent info
     * @private
     */
    _mapRowToStudent(row) {
        const student = Student.fromDatabase(row);

        // Add person information if available
        if (row.person_name) {
            student.person = {
                person_name: row.person_name,
                person_phone: row.person_phone,
                person_gender: row.person_gender,
                person_birthday: row.person_birthday,
                person_active: row.person_active
            };
        }

        // Add parent information if available
        if (row.parent_name) {
            student.parent = {
                parent_name: row.parent_name,
                parent_phone: row.parent_phone
            };
        }

        return student;
    }

    // ============ 8. GET WITH SCHEDULES ============
    /**
     * Get students with their pickup schedules
     * @param {number} [studentId=null] - Optional specific student ID
     * @return {Promise<Object[]>} - Students with schedule info
     */
    async getStudentsWithSchedules(studentId = null) {
        try {
            let whereClause = 'p.person_life_cycle_status = TRUE';
            const params = [];

            if (studentId) {
                whereClause += ` AND s.${dbSchema.STUDENT_COLUMNS.STUDENT_ID} = ?`;
                params.push(studentId);
            }

            const sql = `
                SELECT 
                    s.${dbSchema.STUDENT_COLUMNS.STUDENT_ID},
                    s.${dbSchema.STUDENT_COLUMNS.STUDENT_GRADE},
                    p.${dbSchema.PERSON_COLUMNS.PERSON_NAME} as student_name,
                    ps.${dbSchema.PICKUP_SCHEDULE_COLUMNS.PICKUP_SCHEDULE_ID},
                    ds.${dbSchema.DETAIL_SCHEDULE_COLUMNS.DETAIL_SCHEDULE_ID},
                    sch.${dbSchema.SCHEDULE_COLUMNS.SCHEDULE_START_DATE},
                    sch.${dbSchema.SCHEDULE_COLUMNS.SCHEDULE_END_DATE},
                    tr.${dbSchema.TIME_ROLE_COLUMNS.TIME_ROLE_START_PICKUP_TIME},
                    tr.${dbSchema.TIME_ROLE_COLUMNS.TIME_ROLE_START_DROP_OFF_TIME}
                FROM ${dbSchema.TABLES.STUDENT} s
                INNER JOIN ${dbSchema.TABLES.PERSON} p ON s.${dbSchema.STUDENT_COLUMNS.STUDENT_PERSON_ID} = p.${dbSchema.PERSON_COLUMNS.PERSON_ID}
                LEFT JOIN ${dbSchema.TABLES.PICKUP_SCHEDULE} ps ON s.${dbSchema.STUDENT_COLUMNS.STUDENT_ID} = ps.${dbSchema.PICKUP_SCHEDULE_COLUMNS.PICKUP_SCHEDULE_STUDENT_ID}
                LEFT JOIN ${dbSchema.TABLES.DETAIL_SCHEDULE} ds ON ps.${dbSchema.PICKUP_SCHEDULE_COLUMNS.PICKUP_SCHEDULE_DETAIL_ID} = ds.${dbSchema.DETAIL_SCHEDULE_COLUMNS.DETAIL_SCHEDULE_ID}
                LEFT JOIN ${dbSchema.TABLES.SCHEDULE} sch ON ds.${dbSchema.DETAIL_SCHEDULE_COLUMNS.SCHEDULE_ID} = sch.${dbSchema.SCHEDULE_COLUMNS.SCHEDULE_ID}
                LEFT JOIN ${dbSchema.TABLES.TIME_ROLE} tr ON ds.${dbSchema.DETAIL_SCHEDULE_COLUMNS.DETAIL_SCHEDULE_TIME_ROLE_ID} = tr.${dbSchema.TIME_ROLE_COLUMNS.TIME_ROLE_ID}
                WHERE ${whereClause}
                ORDER BY s.${dbSchema.STUDENT_COLUMNS.STUDENT_ID}, sch.${dbSchema.SCHEDULE_COLUMNS.SCHEDULE_START_DATE}
            `;

            const [results] = await this.connection.execute(sql, params);
            return results || [];
        } catch (error) {
            console.error(`Error in getStudentsWithSchedules: ${error.message}`);
            return [];
        }
    }

    // ============ 9. GET BY GRADE ============
    /**
     * Get students by grade
     * @param {number} grade - Grade level (1-12)
     * @return {Promise<Student[]>}
     */
    async getStudentsByGrade(grade) {
        if (!Number.isInteger(Number(grade)) || Number(grade) < 1 || Number(grade) > 12) {
            console.warn(`Warning: Invalid grade: ${grade}. Must be between 1-12`);
            return [];
        }

        return await this.getAllStudents({ grade: Number(grade) });
    }

    // ============ 10. GET BY IDS (BULK) ============
    /**
     * Get students by multiple IDs
     * @param {number[]} studentIds - Array of student IDs
     * @return {Promise<Student[]>}
     */
    async getByIds(studentIds) {
        if (!Array.isArray(studentIds) || studentIds.length === 0) {
            console.warn(`Warning: studentIds must be a non-empty array`);
            return [];
        }

        // Validate all IDs are positive integers
        const validIds = studentIds.filter(id => Number.isInteger(Number(id)) && Number(id) > 0);
        if (validIds.length === 0) {
            console.warn('Warning: No valid studentIds provided');
            return [];
        }

        try {
            const placeholders = validIds.map(() => '?').join(', ');
            const sql = `
                SELECT 
                    s.${dbSchema.STUDENT_COLUMNS.STUDENT_ID},
                    s.${dbSchema.STUDENT_COLUMNS.STUDENT_PARENT_ID},
                    s.${dbSchema.STUDENT_COLUMNS.STUDENT_PERSON_ID},
                    s.${dbSchema.STUDENT_COLUMNS.STUDENT_GRADE},
                    p.${dbSchema.PERSON_COLUMNS.PERSON_NAME} as person_name,
                    p.${dbSchema.PERSON_COLUMNS.PERSON_PHONE} as person_phone
                FROM ${dbSchema.TABLES.STUDENT} s
                INNER JOIN ${dbSchema.TABLES.PERSON} p ON s.${dbSchema.STUDENT_COLUMNS.STUDENT_PERSON_ID} = p.${dbSchema.PERSON_COLUMNS.PERSON_ID}
                WHERE s.${dbSchema.STUDENT_COLUMNS.STUDENT_ID} IN (${placeholders})
                AND p.${dbSchema.PERSON_COLUMNS.PERSON_LIFE_CYCLE_STATUS} = TRUE
                ORDER BY s.${dbSchema.STUDENT_COLUMNS.STUDENT_ID}
            `;

            const [results] = await this.connection.execute(sql, validIds);

            return results ? results.map(row => this._mapRowToStudent(row)) : [];
        } catch (error) {
            console.error(`Error in getByIds: ${error.message}`);
            return [];
        }
    }
}

export default StudentDAO;

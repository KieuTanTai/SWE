import Student from "../../models/Student.js";
import { default as BaseDAO } from "./baseDAO.js";
import dbSchema from "./dbSchema.js";
import mySql from "mysql2/promise"

export default class StudentDAO extends BaseDAO {
    
    /**
     * Creates an instance of StudentDAO.
     * @param {mySql.PoolConnection} connection
     * @memberof StudentDAO
     */
    constructor(connection) {
        super(connection, "Student", dbSchema.STUDENT_COLUMNS.STUDENT_ID);
    }

    /**
     * Get all students
     * @return {Promise<Student[]>} 
     * @memberof StudentDAO
     */
    async getAllStudents() {
        try {
            const results = await this._protectedGetAll();
            if (!results || results.length === 0) {
                console.warn(`Warning: No students found`);
                return [];
            }
            return results.map(row => Student.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get student by ID
     * @param {number} studentId
     * @return {Promise<Student>} 
     * @memberof StudentDAO
     */
    async getByStudentId(studentId) {
        if (studentId === null || studentId === undefined || !Number.isInteger(studentId)) {
            console.warn(`Warning: studentId is invalid : ${studentId}`);
            return new Student();
        }

        try {
            if (studentId <= 0) {
                console.warn(`Warning: studentId must be greater than zero : ${studentId}`);
                return new Student();
            }

            const result = await this._protectedGetById(studentId);
            if (!result) {
                console.warn(`Warning: No data found for studentId ${studentId}`);
                return new Student();
            }
            return Student.fromDatabase(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return new Student();
        }
    }

    /**
     * Get students by multiple IDs
     * @param {number[]} studentIds
     * @return {Promise<Student[]>} 
     * @memberof StudentDAO
     */
    async getByStudentIds(studentIds) {
        if (!Array.isArray(studentIds) || studentIds.length === 0) {
            console.warn(`Warning: studentIds must be a non-empty array`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], studentIds,
                `WHERE ${this.primaryKeyName} IN (${studentIds.map(() => '?').join(', ')})`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No students found for provided studentIds`);
                return [];
            }
            return results.map(row => Student.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get student by person ID
     * @param {number} personId
     * @return {Promise<Student>} 
     * @memberof StudentDAO
     */
    async getByPersonId(personId) {
        if (personId === null || personId === undefined || !Number.isInteger(personId)) {
            console.warn(`Warning: personId is invalid : ${personId}`);
            return new Student();
        }

        try {
            if (personId <= 0) {
                console.warn(`Warning: personId must be greater than zero : ${personId}`);
                return new Student();
            }

            const results = await this._protectedGetBySelection(["*"], [personId],
                `WHERE ${dbSchema.STUDENT_COLUMNS.STUDENT_PERSON_ID} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No student found for personId ${personId}`);
                return new Student();
            }
            return results.map(row => Student.fromDatabase(row))[0];
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return new Student();
        }
    }

    /**
     * Get students by parent ID
     * @param {number} parentId
     * @return {Promise<Student[]>} 
     * @memberof StudentDAO
     */
    async getByParentId(parentId) {
        if (parentId === null || parentId === undefined || !Number.isInteger(parentId)) {
            console.warn(`Warning: parentId is invalid : ${parentId}`);
            return [];
        }

        try {
            if (parentId <= 0) {
                console.warn(`Warning: parentId must be greater than zero : ${parentId}`);
                return [];
            }

            const results = await this._protectedGetBySelection(["*"], [parentId],
                `WHERE ${dbSchema.STUDENT_COLUMNS.STUDENT_PARENT_ID} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No students found for parentId ${parentId}`);
                return [];
            }
            return results.map(row => Student.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get students by grade
     * @param {number} grade
     * @return {Promise<Student[]>} 
     * @memberof StudentDAO
     */
    async getByGrade(grade) {
        if (grade === null || grade === undefined || !Number.isInteger(grade)) {
            console.warn(`Warning: grade is invalid : ${grade}`);
            return [];
        }

        try {
            if (grade <= 0) {
                console.warn(`Warning: grade must be greater than zero : ${grade}`);
                return [];
            }

            const results = await this._protectedGetBySelection(["*"], [grade],
                `WHERE ${dbSchema.STUDENT_COLUMNS.STUDENT_GRADE} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No students found for grade ${grade}`);
                return [];
            }
            return results.map(row => Student.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Create new student
     * @param {Student} student
     * @return {Promise<number>} insertId or -1 if failed
     * @memberof StudentDAO
     */
    async createStudent(student) {
        if (!(student instanceof Student)) {
            console.error('Error: student must be an instance of Student');
            return -1;
        }

        try {
            const data = {
                [dbSchema.STUDENT_COLUMNS.STUDENT_PARENT_ID]: student.student_parent_id,
                [dbSchema.STUDENT_COLUMNS.STUDENT_PERSON_ID]: student.student_person_id,
                [dbSchema.STUDENT_COLUMNS.STUDENT_GRADE]: student.student_grade
            };

            const insertId = await this._protectedCreate(data);
            if (insertId <= 0) {
                console.error('Error: Failed to create student');
                return -1;
            }
            return insertId;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update student
     * @param {number} studentId
     * @param {Student} student
     * @return {Promise<number>} affected rows or -1 if failed
     * @memberof StudentDAO
     */
    async updateStudent(studentId, student) {
        if (studentId === null || studentId === undefined || !Number.isInteger(studentId)) {
            console.error('Error: studentId is invalid');
            return -1;
        }

        if (studentId <= 0) {
            console.error('Error: studentId must be greater than zero');
            return -1;
        }

        if (!(student instanceof Student)) {
            console.error('Error: student must be an instance of Student');
            return -1;
        }

        try {
            const data = {
                [dbSchema.STUDENT_COLUMNS.STUDENT_PARENT_ID]: student.student_parent_id,
                [dbSchema.STUDENT_COLUMNS.STUDENT_PERSON_ID]: student.student_person_id,
                [dbSchema.STUDENT_COLUMNS.STUDENT_GRADE]: student.student_grade
            };

            const affectedRows = await this._protectedUpdateById(studentId, data);
            if (affectedRows <= 0) {
                console.warn(`Warning: No student updated for studentId ${studentId}`);
                return -1;
            }
            return affectedRows;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Delete student
     * @param {number} studentId
     * @return {Promise<number>} affected rows or -1 if failed
     * @memberof StudentDAO
     */
    async deleteStudent(studentId) {
        if (studentId === null || studentId === undefined || !Number.isInteger(studentId)) {
            console.error('Error: studentId is invalid');
            return -1;
        }

        if (studentId <= 0) {
            console.error('Error: studentId must be greater than zero');
            return -1;
        }

        try {
            const affectedRows = await this._protectedDeleteById(studentId);
            if (affectedRows <= 0) {
                console.warn(`Warning: No student deleted for studentId ${studentId}`);
                return -1;
            }
            return affectedRows;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Check if person is already a student
     * @param {number} personId
     * @return {Promise<boolean>}
     * @memberof StudentDAO
     */
    async isPersonStudent(personId) {
        if (personId === null || personId === undefined || !Number.isInteger(personId)) {
            return false;
        }

        if (personId <= 0) {
            return false;
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [personId],
                `WHERE ${dbSchema.STUDENT_COLUMNS.STUDENT_PERSON_ID} = ? LIMIT 1`);
            return results && results.length > 0;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return false;
        }
    }
}

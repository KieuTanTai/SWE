import Student from "../../models/Student.js";
import { default as BaseDAO } from "./baseDAO.js";
import dbSchema from "./dbSchema.js";

export default class StudentDAO extends BaseDAO {
    
    constructor(connection) {
        super(connection, "Student", dbSchema.STUDENT_COLUMNS.STUDENT_ID);
    }

    _mapRowToStudent(row) {
        const student = new Student({
            student_id: row.student_id,
            student_person_id: row.student_person_id,
            student_grade: row.student_grade,
            student_parent_id: row.student_parent_id
        });

        if (row.person_name) {
            student.person = {
                person_id: row.student_person_id,
                person_name: row.person_name,
                person_phone: row.person_phone,
                person_gender: row.person_gender,
                person_birthday: row.person_birthday,
                person_life_cycle_status: row.person_life_cycle_status,
                person_email: row.account_email
            };
        }
        return student;
    }

    async getAllStudents() {
        try {
            const query = `
                SELECT 
                    s.*, 
                    p.person_name, p.person_phone, p.person_gender, p.person_birthday, p.person_life_cycle_status,
                    a.account_email
                FROM Student s
                JOIN Person p ON s.student_person_id = p.person_id
                LEFT JOIN Account a ON p.person_account_id = a.account_id
            `;

            // Thêm JSDoc để fix lỗi báo đỏ
            /** @type {[any[], any]} */
            const [rows] = await this.connection.execute(query);

            if (!rows || rows.length === 0) {
                return [];
            }
            
            return rows.map(row => this._mapRowToStudent(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    async getByStudentId(studentId) {
        if (!studentId || !Number.isInteger(studentId)) return new Student();

        try {
            const query = `
                SELECT 
                    s.*, 
                    p.person_name, p.person_phone, p.person_gender, p.person_birthday, p.person_life_cycle_status,
                    a.account_email
                FROM Student s
                JOIN Person p ON s.student_person_id = p.person_id
                LEFT JOIN Account a ON p.person_account_id = a.account_id
                WHERE s.student_id = ?
            `;

            /** @type {[any[], any]} */
            const [rows] = await this.connection.execute(query, [studentId]);

            if (!rows || rows.length === 0) {
                return new Student();
            }
            return this._mapRowToStudent(rows[0]);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return new Student();
        }
    }

    // --- SỬA LỖI GỌI HÀM SUPER KHÔNG TỒN TẠI ---
    // Các hàm getByPersonId, getByParentId... của lớp cha BaseDAO có thể chưa được định nghĩa
    // hoặc định nghĩa khác tên.
    // Tốt nhất là override lại ở đây cho an toàn.

    async getByPersonId(personId) {
        try {
            // Sử dụng hàm _protectedGetBySelection của lớp cha nếu có
            const results = await this._protectedGetBySelection(["*"], [personId],
                `WHERE ${dbSchema.STUDENT_COLUMNS.STUDENT_PERSON_ID} = ?`);
            
            if (!results || results.length === 0) return new Student();
            // Lưu ý: Hàm này trả về data thô chưa JOIN, nếu cần tên thì phải viết query JOIN riêng
            return Student.fromDatabase(results[0]);
        } catch (error) {
            return new Student();
        }
    }

    async getByParentId(parentId) {
        try {
            const results = await this._protectedGetBySelection(["*"], [parentId],
                `WHERE ${dbSchema.STUDENT_COLUMNS.STUDENT_PARENT_ID} = ?`);
            
            if (!results || results.length === 0) return [];
            return results.map(row => Student.fromDatabase(row));
        } catch (error) {
            return [];
        }
    }

    async getByGrade(grade) {
        try {
            const results = await this._protectedGetBySelection(["*"], [grade],
                `WHERE ${dbSchema.STUDENT_COLUMNS.STUDENT_GRADE} = ?`);
            
            if (!results || results.length === 0) return [];
            return results.map(row => Student.fromDatabase(row));
        } catch (error) {
            return [];
        }
    }

    // --- CREATE / UPDATE / DELETE ---
    
    async createStudent(student) {
        if (!(student instanceof Student)) return -1;
        try {
            const data = {
                [dbSchema.STUDENT_COLUMNS.STUDENT_PARENT_ID]: student.student_parent_id,
                [dbSchema.STUDENT_COLUMNS.STUDENT_PERSON_ID]: student.student_person_id,
                [dbSchema.STUDENT_COLUMNS.STUDENT_GRADE]: student.student_grade
            };
            const insertId = await this._protectedCreate(data);
            return insertId > 0 ? insertId : -1;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    async updateStudent(studentId, student) {
        if (!studentId || !(student instanceof Student)) return -1;
        try {
            const data = {
                [dbSchema.STUDENT_COLUMNS.STUDENT_PARENT_ID]: student.student_parent_id,
                [dbSchema.STUDENT_COLUMNS.STUDENT_GRADE]: student.student_grade
            };
            const affectedRows = await this._protectedUpdateById(studentId, data);
            return affectedRows > 0 ? affectedRows : -1;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    async deleteStudent(studentId) {
        if (!studentId) return -1;
        try {
            const affectedRows = await this._protectedDeleteById(studentId);
            return affectedRows > 0 ? affectedRows : -1;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    async isPersonStudent(personId) {
        if (!personId) return false;
        try {
            const results = await this._protectedGetBySelection(["*"], [personId],
                `WHERE ${dbSchema.STUDENT_COLUMNS.STUDENT_PERSON_ID} = ? LIMIT 1`);
            return results && results.length > 0;
        } catch (error) {
            return false;
        }
    }
}
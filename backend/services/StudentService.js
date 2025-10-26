import StudentDAO from '../infrastructure/data/studentDAO.js';
import Connection from '../infrastructure/connection/getConnection.js';
import Student from '../models/Student.js';

const connectionManager = new Connection('./config/appsettings.json', 'DefaultConnection');
let connectionPool;

class StudentService {
    async getAll(filters = {}) {
        try {
            if (!connectionPool) connectionPool = await connectionManager.connect();
            const dao = new StudentDAO(connectionPool);
            return await dao.getAllStudents(filters);
        } catch (error) {
            console.error(`Error in StudentService.getAll: ${error.message}`);
            throw error;
        }
    }

    async getById(id) {
        try {
            if (!connectionPool) connectionPool = await connectionManager.connect();
            const dao = new StudentDAO(connectionPool);
            return await dao.getStudentById(id);
        } catch (error) {
            console.error(`Error in StudentService.getById: ${error.message}`);
            throw error;
        }
    }

    async create(data) {
        try {
            if (!connectionPool) connectionPool = await connectionManager.connect();
            const dao = new StudentDAO(connectionPool);
            const student = new Student(data);
            return await dao.createStudent(student);
        } catch (error) {
            console.error(`Error in StudentService.create: ${error.message}`);
            throw error;
        }
    }

    async update(id, data) {
        try {
            if (!connectionPool) connectionPool = await connectionManager.connect();
            const dao = new StudentDAO(connectionPool);
            return await dao.updateStudent(id, data);
        } catch (error) {
            console.error(`Error in StudentService.update: ${error.message}`);
            throw error;
        }
    }

    async searchByName(namePattern) {
        if (!connectionPool) connectionPool = await connectionManager.connect();
        const dao = new StudentDAO(connectionPool);
        return await dao.getStudentsByNamePattern(namePattern);
    }

    async getByParent(parentId) {
        if (!connectionPool) connectionPool = await connectionManager.connect();
        const dao = new StudentDAO(connectionPool);
        return await dao.getStudentsByParentId(parentId);
    }

    async getByGrade(grade) {
        if (!connectionPool) connectionPool = await connectionManager.connect();
        const dao = new StudentDAO(connectionPool);
        return await dao.getStudentsByGrade(grade);
    }

    async getWithSchedules(studentId = null) {
        if (!connectionPool) connectionPool = await connectionManager.connect();
        const dao = new StudentDAO(connectionPool);
        return await dao.getStudentsWithSchedules(studentId);
    }

    async getBulk(studentIds) {
        if (!connectionPool) connectionPool = await connectionManager.connect();
        const dao = new StudentDAO(connectionPool);
        return await dao.getByIds(studentIds);
    }

    async getStudentsByFilters(filters) {
        if (!connectionPool) connectionPool = await connectionManager.connect();
        const dao = new StudentDAO(connectionPool);

        const validFilters = {};
        if (filters.grade) validFilters.grade = parseInt(filters.grade);
        if (filters.parentId) validFilters.parentId = parseInt(filters.parentId);
        if (filters.activeOnly === 'true' || filters.activeOnly === true) {
            validFilters.activeOnly = true;
        }

        return await dao.getAllStudents(validFilters);
    }
}

export default new StudentService();

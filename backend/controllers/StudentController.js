import express from 'express';
const router = express.Router();
import studentService from '../services/StudentService.js';

// ============ BASIC CRUD ============

// GET /api/students - với filters advanced
router.get('/', async (req, res) => {
    try {
        const filters = {};

        // Parse query parameters từ DAO mới
        if (req.query.grade) filters.grade = req.query.grade;
        if (req.query.parentId) filters.parentId = req.query.parentId;
        if (req.query.activeOnly) filters.activeOnly = req.query.activeOnly;

        const students = await studentService.getStudentsByFilters(filters);

        res.status(200).json({
            success: true,
            data: students,
            count: students.length,
            filters: filters
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// GET /api/students/:id - với person info đầy đủ
router.get('/:id', async (req, res) => {
    try {
        const student = await studentService.getById(req.params.id);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// ============ NEW ADVANCED ENDPOINTS ============

// GET /api/students/search/name?q=pattern - SEARCH BY NAME
router.get('/search/name', async (req, res) => {
    try {
        const { q: namePattern } = req.query;

        if (!namePattern) {
            return res.status(400).json({
                success: false,
                message: 'Query parameter "q" is required'
            });
        }

        const students = await studentService.searchByName(namePattern);

        res.status(200).json({
            success: true,
            data: students,
            count: students.length,
            searchPattern: namePattern
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// GET /api/students/parent/:parentId - BY PARENT
router.get('/parent/:parentId', async (req, res) => {
    try {
        const students = await studentService.getByParent(req.params.parentId);

        res.status(200).json({
            success: true,
            data: students,
            count: students.length,
            parentId: parseInt(req.params.parentId)
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// GET /api/students/grade/:grade - BY GRADE
router.get('/grade/:grade', async (req, res) => {
    try {
        const students = await studentService.getByGrade(req.params.grade);

        res.status(200).json({
            success: true,
            data: students,
            count: students.length,
            grade: parseInt(req.params.grade)
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// GET /api/students/schedules - WITH SCHEDULES
// GET /api/students/schedules?studentId=123
router.get('/schedules', async (req, res) => {
    try {
        const { studentId } = req.query;
        const studentsWithSchedules = await studentService.getWithSchedules(studentId || null);

        res.status(200).json({
            success: true,
            data: studentsWithSchedules,
            count: studentsWithSchedules.length,
            studentId: studentId ? parseInt(studentId) : null
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// POST /api/students/bulk - BULK GET BY IDS
router.post('/bulk', async (req, res) => {
    try {
        const { studentIds } = req.body;

        if (!studentIds) {
            return res.status(400).json({
                success: false,
                message: 'studentIds array is required'
            });
        }

        const students = await studentService.getBulk(studentIds);

        res.status(200).json({
            success: true,
            data: students,
            count: students.length,
            requestedIds: studentIds
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Giữ nguyên POST, PUT, DELETE từ version cũ...

export default router;

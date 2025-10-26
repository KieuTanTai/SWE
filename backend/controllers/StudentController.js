import express from 'express';
import StudentServices from '../services/StudentServices.js';
import Student from '../models/Student.js';

const router = express.Router();

// GET /api/students - Get all students
router.get('/', async (req, res) => {
    try {
        const service = new StudentServices();
        const result = await service.getAllStudents();
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/students/:studentId - Get student by ID
router.get('/:studentId', async (req, res) => {
    try {
        const studentId = parseInt(req.params.studentId);
        const service = new StudentServices();
        const result = await service.getByStudentId(studentId);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/students/batch?ids=1,2,3 - Get students by multiple IDs
router.get('/batch/ids', async (req, res) => {
    try {
        const ids = req.query.ids;
        if (!ids || typeof ids !== 'string') {
            return res.status(400).json({ error: "Query parameter 'ids' is required" });
        }
        
        const studentIds = ids.split(",").map(id => parseInt(id.trim()));
        const service = new StudentServices();
        const result = await service.getByStudentIds(studentIds);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/students/person/:personId - Get student by person ID
router.get('/person/:personId', async (req, res) => {
    try {
        const personId = parseInt(req.params.personId);
        const service = new StudentServices();
        const result = await service.getByPersonId(personId);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/students/parent/:parentId - Get students by parent ID
router.get('/parent/:parentId', async (req, res) => {
    try {
        const parentId = parseInt(req.params.parentId);
        const service = new StudentServices();
        const result = await service.getByParentId(parentId);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/students/grade/:grade - Get students by grade
router.get('/grade/:grade', async (req, res) => {
    try {
        const grade = parseInt(req.params.grade);
        const service = new StudentServices();
        const result = await service.getByGrade(grade);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/students - Create single student
router.post('/', async (req, res) => {
    try {
        const { student_person_id, student_grade, student_parent_id } = req.body;
        if (!student_person_id || !student_grade) {
            return res.status(400).json({ error: "student_person_id and student_grade are required" });
        }

        const student = new Student({ student_person_id, student_grade, student_parent_id });
        const service = new StudentServices();
        const result = await service.createStudent(student);
        result.success ? res.status(201).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/students/:studentId - Update student
router.put('/:studentId', async (req, res) => {
    try {
        const studentId = parseInt(req.params.studentId);
        const { student_grade, student_parent_id } = req.body;
        
        const student = new Student({ 
            student_id: studentId, 
            student_grade, 
            student_parent_id 
        });
        const service = new StudentServices();
        const result = await service.updateStudent(studentId, student);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/students/:studentId - Delete student
router.delete('/:studentId', async (req, res) => {
    try {
        const studentId = parseInt(req.params.studentId);
        const service = new StudentServices();
        const result = await service.deleteStudent(studentId);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/students/check-person/:personId - Check if person is student
router.get('/check-person/:personId', async (req, res) => {
    try {
        const personId = parseInt(req.params.personId);
        const service = new StudentServices();
        const result = await service.isPersonStudent(personId);
        result.success ? res.status(200).json(result.data) : res.status(500).json({ error: result.error });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

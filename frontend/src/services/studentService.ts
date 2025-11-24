import axios from 'axios';
import type { Student } from '@/interfaces/student';

const API_URL = 'http://localhost:8080/api/students';

export class StudentService {
    async getStudentById(studentId: number): Promise<Student> {
        const res = await axios.get(`${API_URL}/${studentId}`);
        return res.data; 
    }

    async getAllStudents(): Promise<Student[]> {
        const res = await axios.get(API_URL);
        return res.data;
    }
}

// src/services/studentService.ts
import axiosClient from "@/utils/axiosClient";

export const studentService = {
  getAllStudents: async () => {
    const response = await axiosClient.get('/students');
    return response.data;
  },

  getStudentById: async (id: number) => {
    const response = await axiosClient.get(`/students/${id}`);
    return response.data;
  },

  createStudent: async (data: {
    person_name: string;
    person_gender: string;
    person_birthday: string;
    person_phone: string;
    student_grade: string;
    student_parent_id: number;
  }) => {
    try {
      const personPayload = {
        person_name: data.person_name,
        person_gender: data.person_gender === 'Male' ? 1 : 0, // SQL lưu 1/0
        person_birthday: data.person_birthday,
        person_phone: data.person_phone,
        person_type: 'student', // Enum
        person_life_cycle_status: 1
      };
      const personRes = await axiosClient.post('/persons', personPayload);
      const newPersonId = personRes.data.person_id || personRes.data.insertId; // Tùy backend trả về

      const studentPayload = {
        student_person_id: newPersonId,
        student_grade: data.student_grade,
        student_parent_id: data.student_parent_id
      };
      const studentRes = await axiosClient.post('/students', studentPayload);
      
      return { success: true, data: studentRes.data };
    } catch (error) {
      throw error;
    }
  },

  updateStudent: async (
    id: number,
    data: {
      student_grade: string;
      student_parent_id: number;
      student_person_id?: number;
      person_name?: string;
    }
  ) => {
    await axiosClient.put(`/students/${id}`, {
        student_grade: data.student_grade,
        student_parent_id: data.student_parent_id
    });
    if (data.student_person_id) {
        const personPayload = {
            person_name: data.person_name,
        };
        await axiosClient.put(`/persons/${data.student_person_id}`, personPayload);
    }

    return { success: true };
  },

  deleteStudent: async (id: number) => {
    const student = await axiosClient.get(`/students/${id}`);
    const personId = student.data.student_person_id;

    if (personId) {
        await axiosClient.delete(`/persons/${personId}`); 
    }
    return { success: true };
  }
};

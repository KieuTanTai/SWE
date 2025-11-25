// src/services/studentService.ts
import axiosClient from "@/utils/axiosClient";
import { Student } from "@/interfaces/student";

export const studentService = {
  // 1. Lấy danh sách (GET /students)
  getAllStudents: async () => {
    const response = await axiosClient.get('/students');
    // Backend trả về mảng object, cần đảm bảo đúng interface
    return response.data;
  },

  // 2. Lấy chi tiết (GET /students/:id)
  getStudentById: async (id: number) => {
    const response = await axiosClient.get(`/students/${id}`);
    // Dữ liệu trả về có thể bao gồm cả object `person` nhờ logic của Backend
    return response.data;
  },

  // 3. Tạo mới (Logic gộp: Tạo Person trước -> Tạo Student sau)
  createStudent: async (data: any) => {
    try {
      // B1: Tạo Person
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

      // B2: Tạo Student gắn với Person vừa tạo
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

  // 4. Cập nhật (Cập nhật cả 2 bảng nếu cần)
  updateStudent: async (id: number, data: any) => {
    // B1: Update thông tin Student (Lớp, Parent)
    await axiosClient.put(`/students/${id}`, {
        student_grade: data.student_grade,
        student_parent_id: data.student_parent_id
    });

    // B2: Nếu có sửa tên/thông tin cá nhân, cần lấy person_id để update bảng Person
    // (Giả sử bạn đã lấy được student_person_id từ hàm getById trước đó)
    // Đây là logic phức tạp, tạm thời ta chỉ update bảng Student hoặc cần Backend hỗ trợ API update gộp.
    // Với code hiện tại, ta sẽ gửi request update Person nếu có person_id
    if (data.student_person_id) {
        const personPayload = {
            person_name: data.person_name,
            // ... các trường khác
        };
        await axiosClient.put(`/persons/${data.student_person_id}`, personPayload);
    }

    return { success: true };
  },

  // 5. Xóa (Soft Delete)
  // Backend SQL có ON DELETE CASCADE, xóa Person là mất Student.
  // Nhưng ở đây ta muốn Soft Delete (Update status)
  deleteStudent: async (id: number) => {
    // Cần lấy student_person_id trước để soft delete bảng Person
    const student = await axiosClient.get(`/students/${id}`);
    const personId = student.data.student_person_id;

    if (personId) {
        // Update trạng thái person thành 0 (Inactive)
        // Lưu ý: Cần backend hỗ trợ route PUT /persons/:id để update status
        // Hoặc dùng DELETE nếu backend đã viết logic soft delete trong đó.
        await axiosClient.delete(`/persons/${personId}`); 
    }
    return { success: true };
  }
};
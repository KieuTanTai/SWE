import { Student } from "@/interfaces/student";

// === MOCK DATA (Dữ liệu giả lập) ===
const MOCK_STUDENTS: Student[] = [
  {
    student_id: 1,
    student_person_id: 101,
    student_grade: 10,
    student_parent_id: 501,
    person: {
      person_full_name: "Nguyen Van A",
      person_email: "studentA@school.com",
      person_gender: "Male",
      person_birthday: "2008-01-01",
      person_life_cycle_status: true,
    },
    parent: {
      parent_full_name: "Nguyen Van Father"
    }
  },
  {
    student_id: 2,
    student_person_id: 102,
    student_grade: 11,
    student_parent_id: 502,
    person: {
      person_full_name: "Tran Thi B",
      person_email: "studentB@school.com",
      person_gender: "Female",
      person_birthday: "2007-05-20",
      person_life_cycle_status: true,

    },
    parent: {
      parent_full_name: "Tran Van Mother"
    }
  },
  {
    student_id: 3,
    student_person_id: 103,
    student_grade: 12,
    student_parent_id: 503,
    person: {
      person_full_name: "Le Van C",
      person_email: "studentC@school.com",
      person_gender: "Male",
      person_birthday: "2006-12-12",
      person_life_cycle_status: true,

    },
    parent: {
      parent_full_name: "Le Van Parent"
    }
  },
];

export const studentService = {
  // 1. Lấy danh sách
  getAllStudents: async () => {
    return new Promise<Student[]>((resolve) => {
      // Giả lập độ trễ mạng 800ms
      setTimeout(() => resolve(MOCK_STUDENTS), 800);
    });
  },

  // 2. Lấy chi tiết theo ID (Dùng cho trang Edit)
  getStudentById: async (id: number) => {
    return new Promise<Student>((resolve, reject) => {
      setTimeout(() => {
        // Log id để tránh warning 'unused variable'
        console.log("Fetching student ID:", id);
        
        const student = MOCK_STUDENTS.find(s => s.student_id === id);
        if (student) resolve(student);
        else reject(new Error("Student not found"));
      }, 500);
    });
  },

  // 3. Tạo mới (Nhận data gộp Person + Student)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createStudent: async (data: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Create Student & Person Mock Data:", data);
        resolve({ success: true });
      }, 1000);
    });
  },

  // 4. Cập nhật
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateStudent: async (id: number, data: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Update Student ID ${id} with data:`, data);
        resolve({ success: true });
      }, 1000);
    });
  },

  
  deleteStudent: async (id: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Soft Deleting (Disabling) Student ID: ${id}`);
        
        // Tìm và đổi trạng thái thành false (Inactive)
        const student = MOCK_STUDENTS.find(s => s.student_id === id);
        if (student && student.person) {
            student.person.person_life_cycle_status = false;
        }
        
        resolve({ success: true });
      }, 500);
    });
  }
};
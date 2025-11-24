import { Student } from "@/interfaces/student";

// === MOCK DATA (Dữ liệu giả lập) ===
const MOCK_STUDENTS: Student[] = [
  {
    student_id: 1,
    student_person_id: 101,
    student_grade: 10,
    student_parent_id: 501,
    person: {
      person_id: 101,
      person_name: "Nguyen Van A",
      person_gender: true,
      person_birthday: new Date("2008-01-01"),
      person_phone: "0900000001",
      person_type: "student",
      person_life_cycle_status: true,
    },
    parent: {
      parent_person_id: 2,
      parent_job: "Unknown",
      parent_type: "mother"
    }
  },
  {
    student_id: 2,
    student_person_id: 102,
    student_grade: 10,
    student_parent_id: 5,
    person: {
      person_id: 102,
      person_name: "Tran Thi B",
      person_gender: false,
      person_birthday: new Date("2007-05-20"),
      person_phone: "0900000002",
      person_type: "student",
      person_life_cycle_status: true,
    },
    parent: {
      parent_person_id: 5,
      parent_job: "Unknown",
      parent_type: "mother"
    }
  },
  {
    student_id: 3,
    student_person_id: 103,
    student_grade: 10,
    student_parent_id: 1,
    person: {
      person_id: 103,
      person_name: "Le Van C",
      person_gender: true,
      person_birthday: new Date("2006-12-12"),
      person_phone: "0900000003",
      person_type: "student",
      person_life_cycle_status: true,
    },
    parent: {
      parent_person_id: 1,
      parent_job: "Engineer",
      parent_type: "father"
    }
  }
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
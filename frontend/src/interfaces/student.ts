
export interface Student {
  student_id?: number; // Optional vì khi tạo mới chưa có ID
  student_person_id: number;
  student_grade: number;
  student_parent_id: number; // Bắt buộc (Required) theo logic validate
  
  // Dữ liệu mở rộng (Expanded Data) từ bảng Person
  // Backend trả về object 'person' lồng bên trong
  person?: {
    person_full_name?: string;
    person_email?: string;
    person_phone?: string;
    person_gender?: string;
    person_birthday?: string;
    person_life_cycle_status?: boolean; // true: Active, false: Inactive
  } | null;
  
  // Dữ liệu mở rộng từ bảng Parent
  parent?: {
    parent_full_name?: string;
  } | null;
}
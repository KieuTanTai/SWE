
export interface Driver {
  driver_person_id: number; // ID chính (cũng là Person ID)
  driver_experience: number;
  driver_experience_type: 'year' | 'month' | 'day';
  driver_late_arrival_count: number;

  // Thông tin mở rộng từ bảng Person
  person?: {
    person_full_name?: string;
    person_email?: string;
    person_phone?: string;
    person_gender?: string;
    person_birthday?: string;
    person_life_cycle_status?: boolean; // true: Active, false: Inactive
  } | null;
}
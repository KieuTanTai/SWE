/**
 * PickupSchedule Model for Frontend
 * Represents pickup schedules for students
 */

import { DetailSchedule } from "./detail-schedule";
import { Student } from "./student";

export interface PickupSchedule {
  pickup_schedule_id: number;
  pickup_schedule_detail_id: number;
  pickup_schedule_student_id: number;

  // Navigation Properties
  detailSchedule?: DetailSchedule | null; // DetailSchedule object
  student?: Student | null; // Student object
}

export interface CreatePickupScheduleDTO {
  pickup_schedule_detail_id: number;
  pickup_schedule_student_id: number;
}

export interface UpdatePickupScheduleDTO {
  pickup_schedule_detail_id?: number;
  pickup_schedule_student_id?: number;
}

export function createDefaultPickupSchedule(
  overrides?: Partial<PickupSchedule>
): PickupSchedule {
  return {
    pickup_schedule_id: 0,
    pickup_schedule_detail_id: 0,
    pickup_schedule_student_id: 0,
    detailSchedule: null,
    student: null,
    ...overrides,
  };
}

export default PickupSchedule;

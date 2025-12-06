/**
 * Schedule Model for Frontend
 * Represents bus schedules managed by managers and assigned to drivers
 */

import { Person } from "./person";
import { Driver } from "./driver";
import { DetailSchedule } from "./detail-schedule";

export interface Schedule {
  schedule_id: number;
  schedule_by_manager_id: number;
  schedule_driver_id: number;
  schedule_start_date: Date | string;
  schedule_end_date: Date | string;
  schedule_status: boolean;

  // Navigation Properties
  manager?: Person | null; // Person object (manager)
  driver?: Driver | null; // Driver object
  detailSchedules?: DetailSchedule[]; // Array of DetailSchedule objects

  // Computed property
  duration_days?: number;
}

export interface CreateScheduleDTO {
  schedule_by_manager_id?: number;
  schedule_driver_id: number;
  schedule_start_date: Date | string;
  schedule_end_date: Date | string;
}

export interface UpdateScheduleDTO {
  schedule_by_manager_id?: number;
  schedule_driver_id?: number;
  schedule_start_date?: Date | string;
  schedule_end_date?: Date | string;
  schedule_status?: boolean;
}

export function createDefaultSchedule(overrides?: Partial<Schedule>): Schedule {
  return {
    schedule_id: 0,
    schedule_by_manager_id: 0,
    schedule_driver_id: 0,
    schedule_start_date: new Date().toISOString(),
    schedule_end_date: new Date().toISOString(),
    schedule_status: false,
    manager: null,
    driver: null,
    detailSchedules: [],
    ...overrides,
  };
}

export default Schedule;

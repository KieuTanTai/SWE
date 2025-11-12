/**
 * TimeRole Model for Frontend
 * Represents time configurations for pickup and drop-off schedules
 */

import { DetailSchedule } from './detail-schedule';

export interface TimeRole {
  time_role_id: number;
  time_role_start_pickup_time: string; // TIME format (HH:mm:ss)
  time_role_start_drop_off_time: string; // TIME format (HH:mm:ss)
  time_role_status: boolean;

  // Navigation Properties
  detailSchedules?: DetailSchedule[]; // Array of DetailSchedule objects
}

export interface CreateTimeRoleDTO {
  time_role_start_pickup_time: string;
  time_role_start_drop_off_time: string;
}

export interface UpdateTimeRoleDTO {
  time_role_start_pickup_time?: string;
  time_role_start_drop_off_time?: string;
  time_role_status?: boolean;
}

export default TimeRole;

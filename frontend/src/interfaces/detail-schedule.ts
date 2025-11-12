/**
 * DetailSchedule Model for Frontend
 * Represents detailed schedule information with bus routes and time roles
 */

import { Schedule } from './schedule';
import { BusRoute } from './bus-route';
import { TimeRole } from './time-role';
import { PickupSchedule } from './pickup-schedule';

export interface DetailSchedule {
  detail_schedule_id: number;
  schedule_id: number;
  detail_schedule_bus_route_id: number;
  detail_schedule_time_role_id: number;

  // Navigation Properties
  schedule?: Schedule | null; // Schedule object
  busRoute?: BusRoute | null; // BusRoute object
  timeRole?: TimeRole | null; // TimeRole object
  pickupSchedules?: PickupSchedule[]; // Array of PickupSchedule objects
}

export interface CreateDetailScheduleDTO {
  schedule_id: number;
  detail_schedule_bus_route_id: number;
  detail_schedule_time_role_id: number;
}

export interface UpdateDetailScheduleDTO {
  schedule_id?: number;
  detail_schedule_bus_route_id?: number;
  detail_schedule_time_role_id?: number;
}

export default DetailSchedule;

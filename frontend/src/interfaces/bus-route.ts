/**
 * BusRoute Model for Frontend
 * Represents the assignment of buses to routes
 */

import { Route } from './route';
import { Bus } from './bus';
import { DetailSchedule } from './detail-schedule';

export interface BusRoute {
  bus_route_id: number;
  route_id: number;
  bus_id: number;
  bus_route_status: boolean;

  // Navigation Properties
  route?: Route | null; // Route object
  bus?: Bus | null; // Bus object
  detailSchedules?: DetailSchedule[]; // Array of DetailSchedule objects
}

export interface CreateBusRouteDTO {
  route_id: number;
  bus_id: number;
}

export interface UpdateBusRouteDTO {
  route_id?: number;
  bus_id?: number;
  bus_route_status?: boolean;
}

export default BusRoute;

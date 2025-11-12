/**
 * Bus Model for Frontend
 * Represents buses in the fleet
 */

import { BusRoute } from './bus-route';

export interface Bus {
  bus_id: number;
  bus_license_plate: string;
  bus_brand: string;
  bus_model: string;
  bus_capacity: number;
  bus_year_manufactured: number;
  bus_has_wifi: boolean;
  bus_has_camera: boolean;
  bus_color: string;
  bus_status: boolean;

  // Navigation Properties
  busRoutes?: BusRoute[]; // Array of BusRoute objects

  // Computed property
  bus_age?: number;
}

export interface CreateBusDTO {
  bus_license_plate: string;
  bus_brand: string;
  bus_model: string;
  bus_capacity: number;
  bus_year_manufactured: number;
  bus_has_wifi?: boolean;
  bus_has_camera?: boolean;
  bus_color: string;
}

export interface UpdateBusDTO {
  bus_license_plate?: string;
  bus_brand?: string;
  bus_model?: string;
  bus_capacity?: number;
  bus_year_manufactured?: number;
  bus_has_wifi?: boolean;
  bus_has_camera?: boolean;
  bus_color?: string;
  bus_status?: boolean;
}

export default Bus;

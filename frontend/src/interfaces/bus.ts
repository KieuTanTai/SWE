/**
 * Bus Model for Frontend
 * Represents buses in the fleet
 */

import { BusRoute } from "./bus-route";

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

export function createDefaultBus(overrides?: Partial<Bus>): Bus {
  return {
    bus_id: 0,
    bus_license_plate: "",
    bus_brand: "",
    bus_model: "",
    bus_capacity: 0,
    bus_year_manufactured: new Date().getFullYear(),
    bus_has_wifi: false,
    bus_has_camera: false,
    bus_color: "",
    bus_status: true,
    busRoutes: [],
    ...overrides,
  };
}

export default Bus;

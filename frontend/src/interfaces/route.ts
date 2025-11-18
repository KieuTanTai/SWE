/**
 * Route Model for Frontend
 * Represents bus routes in the system
 */

import { DetailRoute } from "./detail-route";
import { BusRoute } from "./bus-route";

export interface Route {
  route_id: number;
  route_name: string;
  route_status: boolean;

  // Navigation Properties
  detailRoutes?: DetailRoute[]; // Array of DetailRoute objects
  busRoutes?: BusRoute[]; // Array of BusRoute objects
}

export interface CreateRouteDTO {
  route_name: string;
}

export interface UpdateRouteDTO {
  route_name?: string;
  route_status?: boolean;
}

export function createDefaultRoute(overrides?: Partial<Route>): Route {
  return {
    route_id: 0,
    route_name: "",
    route_status: true,
    detailRoutes: [],
    busRoutes: [],
    ...overrides,
  };
}

export default Route;

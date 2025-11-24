/**
 * DetailRoute Model for Frontend
 * Represents detailed route segments with start and end points
 */

import { Route } from "./route";
import { Address } from "./address";

export interface DetailRoute {
  detail_route_id: number;
  route_id: number;
  detail_route_start_point_id: number;
  detail_route_end_point_id: number;
  detail_route_distance: number;

  // Navigation Properties
  route?: Route | null; // Route object
  startPoint?: Address | null; // Address object for start point
  endPoint?: Address | null; // Address object for end point
}

export interface CreateDetailRouteDTO {
  route_id: number;
  detail_route_start_point_id: number;
  detail_route_end_point_id: number;
  detail_route_distance: number;
}

export interface UpdateDetailRouteDTO {
  route_id?: number;
  detail_route_start_point_id?: number;
  detail_route_end_point_id?: number;
  detail_route_distance?: number;
}

export function createDefaultDetailRoute(
  overrides?: Partial<DetailRoute>
): DetailRoute {
  return {
    detail_route_id: 0,
    route_id: 0,
    detail_route_start_point_id: 0,
    detail_route_end_point_id: 0,
    detail_route_distance: 0,
    route: null,
    startPoint: null,
    endPoint: null,
    ...overrides,
  };
}

export default DetailRoute;

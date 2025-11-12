/**
 * DetailRoute Model for Frontend
 * Represents detailed route segments with start and end points
 */

import { Route } from './route';
import { Address } from './address';

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

export default DetailRoute;

/**
 * Value Object for optimized bus route detail info
 * Used for API responses and FE/BE sharing
 */

export interface DetailRouteInfo {
  detail_route_id: number;
  start_name: string;
  end_name: string;
}

export interface BusRouteDetailInfo {
  bus_route_id: number;
  route_id: number;
  route_name: string;
  detail_routes: DetailRouteInfo[];
}

export function createDefaultDetailRouteInfo(): DetailRouteInfo {
  return {
    detail_route_id: 0,
    start_name: "",
    end_name: "",
  };
}

export function createDefaultBusRouteDetailInfo(): BusRouteDetailInfo {
  return {
    bus_route_id: 0,
    route_id: 0,
    route_name: "",
    detail_routes: [],
  };
}

import axios from "axios";
import type { BusRoute } from "@/interfaces/bus-route";

export async function getBusRoutesByRouteId(
  route_id: number
): Promise<BusRoute[]> {
  const response = await axios.get(
    `http://localhost:5000/api/bus-routes?route_id=${route_id}`
  );
  return response.data as BusRoute[];
}

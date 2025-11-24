import {
  BusRouteDetailInfo,
  DetailRouteInfo,
} from "@/interfaces/bus-route-detail";
import axios from "axios";

export default async function getRouteDetails(
  routeIds: number[]
): Promise<BusRouteDetailInfo[]> {
  try {
    const results = await axios.get(
      "http://localhost:5000/api/detail-routes/details",
      { params: { routeIds: routeIds.join(",") } }
    );
    if (!results || !results.data) {
      console.error("not found");
      return [];
    }
    return results.data as BusRouteDetailInfo[];
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return [];
  }
}

export function getDetailRouteNames(
  result: BusRouteDetailInfo[]
): DetailRouteInfo[][] {
  return result.map((busRoute) => busRoute.detail_routes ?? []);
}

// Test function: gọi thử API với một số routeIds và log ra console
// if (require.main === module) {
//   (async () => {
//     const testRouteIds = [1, 2, 3];
//     const result = await getRouteDetails(testRouteIds);
//     console.log("Test getRouteDetails:", JSON.stringify(result, null, 2));
//     console.log("result detailRoutes:", getDetailRouteNames(result));
//   })();
// }

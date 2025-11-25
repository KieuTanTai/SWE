"use client";
import Layout from "@/components/layout/Layout";
import { useRouter } from "next/navigation";
import useRouteList from "@/hooks/useRouteList";
import type { Route } from "@/interfaces/route";
import getRouteDetails from "@/api/detail-routes-api";
import { getBusRoutesByRouteId } from "@/api/bus-route-api";
import { getSchedulesByRouteId } from "@/api/schedule-api";
import { useEffect, useState } from "react";
import type { BusRoute } from "@/interfaces/bus-route";
import type { Schedule } from "@/interfaces/schedule";


export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "--";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())} ${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
}

export default function RoutePage() {
  const [activeItem, setActiveItem] = useState("route");
  const router = useRouter();

  const handleNavigate = (item: string) => {
    if (item === "route") return;
    if (item === "dashboard") router.push("/");
    else if (item === "student") router.push("/students");
    else if (item === "driver") router.push("/drivers");
    else if (item === "tracking") router.push("/tracking");
    else if (item === "schedule") router.push("/schedules");
    else router.push("/");
  };

  const { routes, loading, error } = useRouteList();
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [routeDetails, setRouteDetails] = useState<{ start_name: string; end_name: string }[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [busRoutes, setBusRoutes] = useState<BusRoute[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [infoLoading, setInfoLoading] = useState(false);

  return (
    <Layout activeItem={activeItem} onNavigate={handleNavigate}>
      <div className="flex h-full w-full justify-between">
        {/* Table routes - chiếm 60% bên trái */}
        <div className="w-[60%] p-6 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Route Management</h2>
          {loading ? (
            <div className="text-gray-400">Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
              <table className="min-w-full text-sm divide-y divide-gray-700">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Tên tuyến</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Trạng thái</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 bg-gray-800">
                  {routes.length > 0 ? routes.map((route) => (
                    <tr key={route.route_id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-white">{route.route_id}</td>
                      <td className="px-6 py-4 text-white">{route.route_name}</td>
                      <td className="px-6 py-4 text-sm">
                        {route.route_status ? (
                          <span className="text-green-400 flex items-center gap-1 text-xs bg-green-900/20 px-2 py-1 rounded-full w-fit border border-green-800">Hoạt động</span>
                        ) : (
                          <span className="text-red-400 flex items-center gap-1 text-xs bg-red-900/20 px-2 py-1 rounded-full w-fit border border-red-800">Ngừng</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <button
                          className="text-teal-400 hover:text-teal-300 flex gap-1 items-center transition-colors px-3 py-1 rounded border border-teal-700 bg-teal-900/20 text-xs font-medium"
                          onClick={async () => {
                            setSelectedRoute(route);
                            setDetailsLoading(true);
                            setInfoLoading(true);
                            // Lấy lộ trình
                            const details = await getRouteDetails([route.route_id]);
                            if (details && details.length > 0) {
                              setRouteDetails(details[0].detail_routes);
                            } else {
                              setRouteDetails([]);
                            }
                            setDetailsLoading(false);
                            // Lấy bus routes
                            const busRouteData = await getBusRoutesByRouteId(route.route_id);
                            setBusRoutes(busRouteData || []);
                            // Lấy schedules
                            const scheduleData = await getSchedulesByRouteId(route.route_id);
                            setSchedules(scheduleData || []);
                            setInfoLoading(false);
                          }}
                        >Xem chi tiết</button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-400">Không có tuyến nào</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="w-[40%] p-6 border-l border-gray-700 flex flex-col items-start justify-start h-full overflow-y-auto">
          {selectedRoute ? (
            <div className="w-full">
              <h3 className="text-lg font-bold text-teal-400 mb-2">Lộ trình tuyến #{selectedRoute.route_id}</h3>
              <div className="mb-2 text-white font-semibold">{selectedRoute.route_name}</div>
              <div className="mb-4">
                {selectedRoute.route_status ? (
                  <span className="text-green-400 bg-green-900/20 px-2 py-1 rounded-full text-xs border border-green-800">Hoạt động</span>
                ) : (
                  <span className="text-red-400 bg-red-900/20 px-2 py-1 rounded-full text-xs border border-red-800">Ngừng</span>
                )}
              </div>
              <div className="mb-2 text-gray-300 text-sm font-bold">Lộ trình đi:</div>
              {detailsLoading ? (
                <div className="text-gray-400">Đang tải lộ trình...</div>
              ) : routeDetails.length > 0 ? (
                <ul className="list-disc ml-6 text-gray-200 text-sm">
                  {routeDetails.map((d, idx) => (
                    <li key={idx}>
                      {`Từ: ${d.start_name} → Đến: ${d.end_name}`}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500 text-sm">Không có dữ liệu lộ trình cho tuyến này.</div>
              )}
              <div className="mt-6 mb-2 text-gray-300 text-sm font-bold">Thông tin liên quan:</div>
              {infoLoading ? (
                <div className="text-gray-400">Đang tải thông tin...</div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-bold text-teal-300 mb-1">Bus Route:</div>
                    {busRoutes.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                        {busRoutes.map((br, idx) => (
                          <div key={idx} className="bg-gray-900 rounded px-2 py-2 text-gray-200 text-xs flex flex-col items-center border border-gray-700">
                            <div className="font-bold text-yellow-300">Bus #{br.bus_id}</div>
                            <div>{br.bus?.bus_license_plate || "No Plate"}</div>
                          </div>
                        ))}
                      </div>
                    ) : <div className="text-gray-500 text-xs">Không có bus route liên quan.</div>}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-teal-300 mb-1">Driver & Schedule:</div>
                    {schedules.length > 0 ? (
                      <div className="space-y-2">
                        {schedules.map((sch, idx) => (
                          <div key={idx} className="bg-gray-900 rounded px-2 py-2 text-gray-200 text-xs border border-gray-700 flex flex-col">
                            <div className="font-bold text-blue-300">Driver: {sch.driver?.person?.person_name || sch.schedule_driver_id}</div>
                            <div>Schedule #{sch.schedule_id}</div>
                            <div className="text-gray-400">{formatDateTime(sch.schedule_start_date)} → {formatDateTime(sch.schedule_end_date)}</div>
                          </div>
                        ))}
                      </div>
                    ) : <div className="text-gray-500 text-xs">Không có lịch trình liên quan.</div>}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-500 text-sm">Chọn tuyến để xem lộ trình...</div>
          )}
        </div>
      </div>
    </Layout>
  );
}

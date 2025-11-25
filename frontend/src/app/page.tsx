"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Đảm bảo đã import useRouter
import Layout from "../components/layout/Layout";
import Maps from "../components/maps/ggmaps";
import DashboardForManager from "../components/admin/DashboardForManager";
import getRouteDetails, { getDetailRouteNames } from "@/api/detail-routes-api";
// Đã chuyển navItems ra Layout, không cần import icon ở đây nữa

interface RouteData {
  routeId: number;
  routeName: string;
  stopPoints: string[]; // Điểm dừng của route này
}

interface TestPoints {
  routes: RouteData[]; // Mỗi route có danh sách điểm dừng riêng
}

const testPoints = async (): Promise<TestPoints | undefined> => {
  const result = await getRouteDetails([1, 2, 3]);
  console.log("Test getRouteDetails in page.tsx:", JSON.stringify(result, null, 2));
  if (result.length > 0) {
    const routes: RouteData[] = [];
    const detailRouteInfos = getDetailRouteNames(result); // DetailRouteInfo[][]

    result.forEach((busRoute, index) => {
      const stopPoints: string[] = [];
      const routeDetails = detailRouteInfos[index] || [];

      routeDetails.forEach((detail) => {
        // Thêm start_name nếu chưa có trong danh sách
        if (detail.start_name && !stopPoints.includes(detail.start_name)) {
          stopPoints.push(detail.start_name);
        }
        // Thêm end_name nếu chưa có trong danh sách
        if (detail.end_name && !stopPoints.includes(detail.end_name)) {
          stopPoints.push(detail.end_name);
        }
      });

      routes.push({
        routeId: busRoute.route_id,
        routeName: busRoute.route_name,
        stopPoints
      });
    });

    console.log("Extracted routes:", routes);
    return { routes };
  }
}

export default function HomePage() {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState("dashboard");
  const [routes, setRoutes] = useState<RouteData[]>([]);

  // Fetch test points on component mount
  useEffect(() => {
    (async () => {
      const points = await testPoints();
      if (points) {
        setRoutes(points.routes);
      }
    })();
  }, []);

  const handleNavigate = (item: string) => {
    // 1. Nếu bấm vào Student -> Chuyển trang
    if (item === "tracking")
      router.push('/tracking');
    else if (item === 'student') {
      router.push('/students');
    }
    else if (item === 'driver') {
      router.push('/drivers');
    }
    else if (item === 'schedule') {
      router.push('/schedules');
    }
    else if (item === 'route') {
      router.push('/route');
    }
    else {
      setActiveItem(item);
    }
  };

  const renderContent = () => {
    switch (activeItem) {
      case "dashboard":
        return <DashboardForManager />;
      case "tracking":
        return <Maps routes={routes} />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
              <p className="text-gray-400">This section is under development</p>
            </div>
          </div>
        );
    }
  };



  return (
    <Layout
      activeItem={activeItem}
      onNavigate={handleNavigate}
    >
      {renderContent()}
    </Layout>
  );
}

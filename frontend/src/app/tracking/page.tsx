"use client";
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import Maps from "@/components/maps/ggmaps";
import getRouteDetails, { getDetailRouteNames } from "@/api/detail-routes-api";
import { useRouter } from "next/navigation"; // Corrected import for useRouter

interface RouteData {
    routeId: number;
    routeName: string;
    stopPoints: string[];
}

export default function TrackingPage() {
    const [routes, setRoutes] = useState<RouteData[]>([]);
    const [activeItem, setActiveItem] = useState("tracking");
    const router = useRouter();
    useEffect(() => {
        (async () => {
            const result = await getRouteDetails([1, 2, 3]);
            if (result.length > 0) {
                const routes: RouteData[] = [];
                const detailRouteInfos = getDetailRouteNames(result);
                result.forEach((busRoute, index) => {
                    const stopPoints: string[] = [];
                    const routeDetails = detailRouteInfos[index] || [];
                    routeDetails.forEach((detail) => {
                        if (detail.start_name && !stopPoints.includes(detail.start_name)) {
                            stopPoints.push(detail.start_name);
                        }
                        if (detail.end_name && !stopPoints.includes(detail.end_name)) {
                            stopPoints.push(detail.end_name);
                        }
                    });
                    routes.push({
                        routeId: busRoute.route_id,
                        routeName: busRoute.route_name,
                        stopPoints,
                    });
                });
                setRoutes(routes);
            }
        })();
    }, []);

    // Navigation giống các trang khác
    const handleNavigate = (item: string) => {
        if (item === "tracking") return;
        if (item === "dashboard") {
            router.push("/");
        } else if (item === "student") {
            router.push("/students");
        } else if (item === "driver") {
            router.push("/drivers");
        } else if (item === "schedule") {
            router.push("/schedules");
        } else if (item === "route") {
            router.push("/routes");
        } else {
            router.push("/");
        }
    };

    return (
        <Layout activeItem={activeItem} onNavigate={handleNavigate}>
            <Maps routes={routes} />
        </Layout>
    );
}

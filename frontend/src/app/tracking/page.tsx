"use client";
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import Maps from "@/components/maps/ggmaps";
import getRouteDetails, { getDetailRouteNames } from "@/api/detail-routes-api";

interface RouteData {
    routeId: number;
    routeName: string;
    stopPoints: string[];
}

export default function TrackingPage() {
    const [routes, setRoutes] = useState<RouteData[]>([]);
    const [activeItem, setActiveItem] = useState("tracking");

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
            window.location.href = "/";
        } else if (item === "student") {
            window.location.href = "/students";
        } else if (item === "driver") {
            window.location.href = "/drivers";
        } else if (item === "schedule") {
            window.location.href = "/schedules";
        } else if (item === "route") {
            window.location.href = "/routes";
        } else {
            window.location.href = "/";
        }
    };

    return (
        <Layout activeItem={activeItem} onNavigate={handleNavigate}>
            <Maps routes={routes} />
        </Layout>
    );
}

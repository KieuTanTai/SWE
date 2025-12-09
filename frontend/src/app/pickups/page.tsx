"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import {
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    Eye,
} from "lucide-react";
import { scheduleService } from "@/services/scheduleService";
import type { Schedule } from "@/interfaces/schedule";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { formatDate } from "@/utils/dateUtils";
import { useAccount } from "@/contexts/AccountContext";

const MySwal = withReactContent(Swal);

export default function DriverSchedulesPage() {
    const router = useRouter();
    const { account } = useAccount();
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeItem, setActiveItem] = useState("pickups"); // ĐỔI: "schedule" -> "pickups"

    // Điều hướng theo menu - CHỈ 2 items cho Driver
    const handleNavigate = (item: string) => {
        if (item === "tracking") {
            router.push('/tracking');
        }
        else if (item === "pickups") {
            // Đã ở trang pickups, chỉ set active item
            setActiveItem("pickups");
            // Có thể reload data nếu cần
            // fetchData();
        }
        // Không xử lý các item khác vì Driver không có quyền
        else {
            console.warn(`Driver không có quyền truy cập: ${item}`);
        }
    };

    // Kiểm tra quyền truy cập
    useEffect(() => {
        if (account) {
            const roleIds = account.roles?.map(role => role.role_id) || [];

            // Chỉ cho phép Driver (role_id = 5) truy cập
            if (!roleIds.includes(5)) {
                MySwal.fire({
                    title: "Access Denied",
                    text: "Only drivers can access this page.",
                    icon: "error",
                    background: "#1f2937",
                    color: "#fff",
                }).then(() => {
                    router.push('/');
                });
                return;
            }

            // Nếu là Driver, fetch data
            fetchData();
        }
    }, [account, router]);

    // Lấy lịch trình gán cho tài xế hiện tại
    const fetchData = useCallback(async () => {
        if (!account?.person?.person_id) {
            console.log("Waiting for account data...");
            return;
        }

        setLoading(true);
        try {
            console.log("Fetching schedules for driver:", account.person.person_id);

            // Lấy tất cả schedules và filter theo driver
            const allSchedules = await scheduleService.getAllSchedules();

            const driverSchedules = allSchedules.filter(
                (schedule: Schedule) => schedule.schedule_driver_id === account?.person?.person_id
            );

            console.log("Driver schedules found:", driverSchedules.length);
            setSchedules(driverSchedules);

        } catch (error) {
            console.error("Failed to load schedules", error);
            MySwal.fire({
                title: "Error!",
                text: "Failed to load your schedules.",
                icon: "error",
                background: "#1f2937",
                color: "#fff",
            });
        } finally {
            setLoading(false);
        }
    }, [account?.person?.person_id]);

    const formatId = (id: number) => `#SCH-${String(id).padStart(5, "0")}`;

    const content = (
        <div className="p-6 w-full text-gray-100">
            {/* Header với tên Driver */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-700 pb-4 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Calendar className="text-blue-500" size={28} />
                            My Schedules
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">
                            Your assigned schedules and route information
                        </p>
                    </div>
                    <div className="text-sm text-gray-400">
                        Driver: <span className="text-blue-300 font-medium">
                            {account?.person?.person_name || "Unknown"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Thông báo nếu không có schedule */}
            {!loading && schedules.length === 0 && (
                <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                    <p className="text-yellow-300">
                        <span className="font-medium">Note:</span> You dont have any assigned schedules yet.
                        Please contact your manager.
                    </p>
                </div>
            )}

            {/* Bảng schedules */}
            {loading ? (
                <div className="text-center py-20 text-gray-400">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="mt-4">Loading your schedules...</p>
                </div>
            ) : (
                <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    Schedule ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    Route
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    Bus
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    Start Date
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    End Date
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700 bg-gray-800">
                            {schedules.length > 0 ? (
                                schedules.map((schedule) => {
                                    const isActive = schedule.schedule_status !== false;

                                    return (
                                        <tr
                                            key={schedule.schedule_id}
                                            className={`hover:bg-gray-750 transition-colors ${
                                                !isActive ? "opacity-50 bg-gray-900" : ""
                                            }`}
                                        >
                                            {/* Schedule ID */}
                                            <td className="px-6 py-4 text-sm font-medium text-white">
                                                {formatId(schedule.schedule_id)}
                                            </td>

                                            {/* Route */}
                                            <td className="px-6 py-4 text-sm text-gray-300">
                                                {schedule.detailSchedules?.[0]?.busRoute?.route?.route_name || "Unassigned"}
                                            </td>

                                            {/* Bus */}
                                            <td className="px-6 py-4 text-sm text-gray-300">
                                                {schedule.detailSchedules?.[0]?.busRoute?.bus?.bus_license_plate || "Unassigned"}
                                            </td>

                                            {/* Start Date */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 text-xs">
                                                    <Clock size={12} className="text-gray-400" />
                                                    <span className="text-gray-300">
                                                            {formatDate(schedule.schedule_start_date)}
                                                        </span>
                                                </div>
                                            </td>

                                            {/* End Date */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 text-xs">
                                                    <Clock size={12} className="text-gray-400" />
                                                    <span className="text-gray-300">
                                                            {formatDate(schedule.schedule_end_date)}
                                                        </span>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4 text-sm">
                                                {isActive ? (
                                                    <span className="text-green-400 flex items-center gap-1 text-xs bg-green-900/20 px-2 py-1 rounded-full w-fit border border-green-800">
                                                            <CheckCircle size={12} /> Active
                                                        </span>
                                                ) : (
                                                    <span className="text-red-400 flex items-center gap-1 text-xs bg-red-900/20 px-2 py-1 rounded-full w-fit border border-red-800">
                                                            <XCircle size={12} /> Inactive
                                                        </span>
                                                )}
                                            </td>

                                            {/* Actions - CHỈ có View Tracking */}
                                            <td className="px-6 py-4 text-sm font-medium">
                                                <div className="flex gap-4 items-center">
                                                    {isActive ? (
                                                        <Link
                                                            href={`/tracking?scheduleId=${schedule.schedule_id}`}
                                                            className="text-teal-400 hover:text-teal-300 flex gap-1 items-center transition-colors px-3 py-1 bg-teal-900/20 rounded-lg hover:bg-teal-900/30"
                                                            title="Go to Live Tracking"
                                                        >
                                                            <Eye size={16} />
                                                            Start Tracking
                                                        </Link>
                                                    ) : (
                                                        <span className="text-gray-500 text-xs italic px-3 py-1">
                                                                Schedule Inactive
                                                            </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <div className="text-gray-500">
                                            <Calendar className="mx-auto mb-3 text-gray-600" size={40} />
                                            <p className="text-lg mb-2">No schedules assigned</p>
                                            <p className="text-sm text-gray-400">
                                                You dont have any schedules yet.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <Layout activeItem={activeItem} onNavigate={handleNavigate}>
            {content}
        </Layout>
    );
}
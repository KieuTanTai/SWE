"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import {
    Calendar, Trash2, Edit, Plus, Search,
    CheckCircle, XCircle, Clock, Eye
} from "lucide-react";
import { scheduleService } from "@/services/scheduleService";
import type { Schedule } from "@/interfaces/schedule";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { formatDate } from "@/utils/dateUtils";
import { useAccount } from "@/contexts/AccountContext";

const MySwal = withReactContent(Swal);

export default function SchedulesPage() {
    const router = useRouter();
    const { account } = useAccount();
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeItem, setActiveItem] = useState("schedule");
    const searchParams = useSearchParams();
    const refreshFlag = searchParams?.get("refresh");

    // Kiểm tra role: Driver = 5, Admin = 1, 2, 3
    const isDriver = account?.roles?.some(role => role.role_id === 5);
    const isAdmin = account?.roles?.some(role => [1, 2, 3].includes(role.role_id));

    // Navigation handler
    const handleNavigate = (item: string) => {
        if (item === "dashboard") router.push("/");
        else if (item === "student") router.push("/students");
        else if (item === "tracking") router.push("/tracking");
        else if (item === "schedule" || item === "pickups") {
            setActiveItem(isDriver ? "pickups" : "schedule");
        }
        else if (item === "route") router.push("/routes");
        else if (item === "driver") router.push("/drivers");
    };

    // Fetch data based on role
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const allSchedules = await scheduleService.getAllSchedules();
            console.log("All schedules:", allSchedules);

            if (isDriver && account?.person?.person_id) {
                // Driver chỉ thấy schedules được gán cho mình
                console.log("Driver mode - person_id:", account.person.person_id);
                const driverSchedules = allSchedules.filter(
                    (schedule: Schedule) => {
                        console.log(`Checking schedule ${schedule.schedule_id}: schedule_driver_id = ${schedule.schedule_driver_id}, person_id = ${account.person?.person_id}`);
                        return schedule.schedule_driver_id === account.person?.person_id;
                    }
                );
                console.log("Driver schedules found:", driverSchedules.length);
                setSchedules(driverSchedules);
            } else {
                // Admin/Manager thấy tất cả schedules
                console.log("Admin mode - showing all schedules:", allSchedules.length);
                setSchedules(allSchedules);
            }
        } catch (error) {
            console.error("Failed to load schedules", error);
            MySwal.fire({
                title: "Error!",
                text: "Failed to load schedules data.",
                icon: "error",
                background: "#1f2937",
                color: "#fff",
            });
        } finally {
            setLoading(false);
        }
    }, [account?.person?.person_id, isDriver]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (refreshFlag === "1") {
            fetchData();
            router.replace("/schedules");
        }
    }, [refreshFlag, fetchData, router]);

    const formatId = (id: number) => `#SCH-${String(id).padStart(5, "0")}`;

    const showDeleteConfirm = async () => {
        return MySwal.fire({
            title: "Delete Schedule?",
            text: "This schedule will be marked as inactive. You can restore it later.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            background: "#1f2937",
            color: "#fff",
            iconColor: "#f87171",
        });
    };

    const handleDeleteSchedule = async (id: number) => {
        const result = await showDeleteConfirm();

        if (result.isConfirmed) {
            try {
                await scheduleService.deleteSchedule(id);
                MySwal.fire({
                    title: "Deleted!",
                    text: "Schedule has been marked as inactive.",
                    icon: "success",
                    background: "#1f2937",
                    color: "#fff",
                    timer: 1500,
                    showConfirmButton: false,
                });
                fetchData();
            } catch (error) {
                console.error(error);
                MySwal.fire({
                    title: "Error!",
                    text: "Failed to delete schedule.",
                    icon: "error",
                    background: "#1f2937",
                    color: "#fff",
                });
            }
        }
    };

    // Filter schedules
    const filteredSchedules = schedules.filter((s) => {
        const term = searchTerm.toLowerCase();
        const id = s.schedule_id.toString();
        const driverName = s.driver?.person?.person_name?.toLowerCase() || "";
        const routeName = s.detailSchedules?.[0]?.busRoute?.route?.route_name?.toLowerCase() || "";
        return id.includes(term) || driverName.includes(term) || routeName.includes(term);
    });

    const content = (
        <div className="p-6 w-full text-gray-100">
            {/* Header - Dynamic based on role */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-700 pb-4 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Calendar className="text-blue-500" size={28} />
                            {isDriver ? "My Schedules" : "Schedules Management"}
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">
                            {isDriver
                                ? "Your assigned schedules and route information"
                                : "Manage all schedules and their information"}
                        </p>
                    </div>
                    {isDriver && (
                        <div className="text-sm text-gray-400">
                            Driver: <span className="text-blue-300 font-medium">
                                {account?.person?.person_name || "Unknown"}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* No schedules message for driver */}
            {isDriver && !loading && schedules.length === 0 && (
                <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                    <p className="text-yellow-300">
                        <span className="font-medium">Note:</span> You don&apos;t have any assigned schedules yet.
                        Please contact your manager.
                    </p>
                </div>
            )}

            {/* Search Bar and Add Button - Only for Admin */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative w-full md:w-auto">
                    <input
                        type="text"
                        placeholder={`Search Schedule ID${isDriver ? "" : ", Route or Driver"}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none w-full md:w-64"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-sm text-gray-400 whitespace-nowrap">
                        Showing {filteredSchedules.length} of {schedules.length} schedules
                    </div>
                    {isAdmin && (
                        <Link
                            href="/schedules/create"
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap"
                        >
                            <Plus size={18} /> Add Schedule
                        </Link>
                    )}
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="text-center py-20 text-gray-400">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="mt-4">Loading schedules...</p>
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
                                {!isDriver && (
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        Driver
                                    </th>
                                )}
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
                            {filteredSchedules.length > 0 ? (
                                filteredSchedules.map((schedule) => {
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

                                            {/* Driver - Only for Admin */}
                                            {!isDriver && (
                                                <td className="px-6 py-4 text-sm text-gray-300">
                                                    {schedule.driver?.person?.person_name || "Unassigned"}
                                                </td>
                                            )}

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

                                            {/* Actions - Different for Driver vs Admin */}
                                            <td className="px-6 py-4 text-sm font-medium">
                                                <div className="flex gap-4 items-center">
                                                    {isDriver ? (
                                                        // Driver actions: View + Tracking
                                                        isActive ? (
                                                            <>
                                                                <Link
                                                                    href={`/schedules/view/${schedule.schedule_id}`}
                                                                    className="text-blue-400 hover:text-blue-300 flex gap-1 items-center transition-colors"
                                                                    title="View Details"
                                                                >
                                                                    <Eye size={16} />
                                                                    View
                                                                </Link>
                                                                <Link
                                                                    href={`/tracking?scheduleId=${schedule.schedule_id}`}
                                                                    className="text-teal-400 hover:text-teal-300 flex gap-1 items-center transition-colors px-3 py-1 bg-teal-900/20 rounded-lg hover:bg-teal-900/30"
                                                                    title="Go to Live Tracking"
                                                                >
                                                                    Start Tracking
                                                                </Link>
                                                            </>
                                                        ) : (
                                                            <span className="text-gray-500 text-xs italic px-3 py-1">
                                                                    Schedule Inactive
                                                                </span>
                                                        )
                                                    ) : (
                                                        // Admin actions: View, Edit, Delete
                                                        isActive ? (
                                                            <>
                                                                <Link
                                                                    href={`/schedules/view/${schedule.schedule_id}`}
                                                                    className="text-teal-400 hover:text-teal-300 flex gap-1 items-center transition-colors"
                                                                    title="View Details"
                                                                >
                                                                    <Eye size={16} />
                                                                    View
                                                                </Link>
                                                                <Link
                                                                    href={`/schedules/edit/${schedule.schedule_id}`}
                                                                    className="text-blue-400 hover:text-blue-300 flex gap-1 items-center transition-colors"
                                                                >
                                                                    <Edit size={16} /> Edit
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDeleteSchedule(schedule.schedule_id)}
                                                                    className="text-red-400 hover:text-red-300 flex gap-1 items-center transition-colors"
                                                                >
                                                                    <Trash2 size={16} /> Delete
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <span className="text-gray-500 text-xs italic">Archived</span>
                                                        )
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={isDriver ? 7 : 8} className="px-6 py-12 text-center">
                                        <div className="text-gray-500">
                                            <Calendar className="mx-auto mb-3 text-gray-600" size={40} />
                                            {searchTerm ? (
                                                <p className="text-lg mb-2">No schedules found matching &quot;{searchTerm}&quot;</p>
                                            ) : isDriver ? (
                                                <>
                                                    <p className="text-lg mb-2">No schedules assigned</p>
                                                    <p className="text-sm text-gray-400">
                                                        You don&apos;t have any schedules yet.
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-lg mb-2">No schedules available</p>
                                                    <p className="text-sm text-gray-400">
                                                        Click &quot;Add Schedule&quot; to create one.
                                                    </p>
                                                </>
                                            )}
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
        <Layout
            activeItem={isDriver ? "pickups" : "schedule"}
            onNavigate={handleNavigate}
        >
            {content}
        </Layout>
    );
}
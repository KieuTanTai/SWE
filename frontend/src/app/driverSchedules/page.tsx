"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "@/components/layout/Layout";
import Link from "next/link";

import {
    Calendar, Trash2, Edit, Plus,
    Search, CheckCircle, XCircle, Clock, Eye
} from "lucide-react";

import { scheduleService } from "@/services/scheduleService";
import { Schedule } from "@/interfaces/schedule";

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { formatDate } from "@/utils/dateUtils";
import { useAccount } from "@/contexts/AccountContext";

const MySwal = withReactContent(Swal);

export default function DriverSchedulesPage() {
    const router = useRouter();
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const account = useAccount().account;

    const handleNavigate = (item: string) => {
        if (item === "dashboard") router.push("/");
        else if (item === "student") router.push("/students");
        else if (item === "tracking") router.push("/tracking");
        else if (item === "schedule") router.push("/driver-schedules");
        else if (item === "route") router.push("/routes");
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const allSchedules = await scheduleService.getAllSchedules();
            // Filter schedules by driver's account_id
            const driverSchedules = allSchedules.filter(
                (schedule: Schedule) => schedule.schedule_driver_id === account?.person?.person_id
            );
            setSchedules(driverSchedules);
        } catch (error) {
            console.error("Failed to load schedules", error);
            MySwal.fire({
                title: 'Error!',
                text: 'Failed to load schedules data.',
                icon: 'error',
                background: '#1f2937',
                color: '#fff'
            });
        } finally {
            setLoading(false);
        }
    }, [account?.account_id]);    

    useEffect(() => {
        fetchData();
    }, []);

    const formatId = (id: number) => `#SCH-${String(id).padStart(5, "0")}`;

    const content = (
        <div className="p-6 w-full text-gray-100">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-700 pb-4 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Calendar className="text-blue-500" size={28} /> 
                            My Schedules
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">
                            View your assigned schedules and route information
                        </p>
                    </div>
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
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        Driver
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        Bus
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        Start Time
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        End Time
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
                                                className={`hover:bg-gray-750 transition-colors ${!isActive ? 'opacity-50 bg-gray-900' : ''}`}
                                            >
                                                {/* Schedule ID */}
                                                <td className="px-6 py-4 text-sm font-medium text-white">
                                                    {formatId(schedule.schedule_id)}
                                                </td>

                                                {/* Route */}
                                                <td className="px-6 py-4 text-sm text-gray-300">
                                                    {schedule.detailSchedules?.[0]?.busRoute?.route?.route_name || "Unassigned"}
                                                </td>

                                                {/* Driver */}
                                                <td className="px-6 py-4 text-sm text-gray-300">
                                                    {schedule.driver?.person?.person_name || "Unassigned"}
                                                </td>

                                                {/* Bus */}
                                                <td className="px-6 py-4 text-sm text-gray-300">
                                                    {schedule.detailSchedules?.[0]?.busRoute?.bus?.bus_license_plate || "Unassigned"}
                                                </td>

                                                {/* Started Date */}
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

                                                {/* Actions */}
                                                <td className="px-6 py-4 text-sm font-medium">
                                                    <div className="flex gap-4 items-center">
                                                        {isActive ? (
                                                            <Link 
                                                                href={`/schedules/view/${account?.account_id}`} 
                                                                className="text-teal-400 hover:text-teal-300 flex gap-1 items-center transition-colors" 
                                                                title="View Details"
                                                            >
                                                                <Eye size={16} />View Details
                                                            </Link>
                                                        ) : (
                                                            <span className="text-gray-500 text-xs italic">Inactive</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                            No schedules assigned to you yet.
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

    return <Layout activeItem="schedule" onNavigate={handleNavigate}>{content}</Layout>;
}
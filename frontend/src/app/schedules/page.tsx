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

const MySwal = withReactContent(Swal);

export default function SchedulesPage() {
    const router = useRouter();
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const searchParams = useSearchParams();
    const refreshFlag = searchParams?.get("refresh");

    const handleNavigate = (item: string) => {
        if (item === "dashboard") router.push("/");
        else if (item === "student") router.push("/students");
        else if (item === "tracking") router.push("/tracking");
        else if (item === "schedule") router.push("/schedules");
        else if (item === "route") router.push("/routes");
        else if (item === "driver") router.push("/drivers");
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const schedules = await scheduleService.getAllSchedules();            
            setSchedules(schedules);
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
    }, []);    

    useEffect(() => {
        fetchData();
    }, []);
    
    useEffect(() => {
        if (refreshFlag === "1") {
            fetchData(); 
            router.replace("/schedules"); 
        }
    }, [refreshFlag, fetchData, router]);

    const formatId = (id: number) => `#SCH-${String(id).padStart(5, "0")}`;


    const showDeleteConfirm = async () => {
        return MySwal.fire({
            title: 'Delete Schedule?',
            text: "This schedule will be marked as inactive. You can restore it later.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            background: '#1f2937',
            color: '#fff',
            iconColor: '#f87171'
        });
    };

    const handleDeleteSchedule = async (id: number) => {
        const result = await showDeleteConfirm();

        if (result.isConfirmed) {
            try {
                console.log(await scheduleService.deleteSchedule(id));
                MySwal.fire({
                    title: 'Deleted!',
                    text: 'Schedule has been marked as inactive.',
                    icon: 'success',
                    background: '#1f2937',
                    color: '#fff',
                    timer: 1500,
                    showConfirmButton: false
                });
                fetchData();
            } catch (error) {
                console.error(error);
                MySwal.fire({
                    title: 'Error!',
                    text: 'Failed to delete schedule.',
                    icon: 'error',
                    background: '#1f2937',
                    color: '#fff'
                });
            }
        }
    };

    const filteredSchedules = schedules.filter(s => {
        const term = searchTerm.toLowerCase();
        const id = s.schedule_id.toString();
        const driverName = s.driver?.person?.person_name?.toLowerCase() || "";
        return id.includes(term) || driverName.includes(term);
    });

    const content = (
        <div className="p-6 w-full text-gray-100">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-700 pb-4 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Calendar className="text-blue-500" size={28} /> 
                            Schedules Management
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">
                            Manage all schedules and their information
                        </p>
                    </div>
                </div>
            </div>

            {/* Search Bar and Add Button */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative w-full md:w-auto">
                    <input 
                        type="text" 
                        placeholder="Search Schedule ID, Route or Driver..." 
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
                    <Link 
                        href="/schedules/create" 
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap"
                    >
                        <Plus size={18} /> Add Schedule
                    </Link>
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
                                {filteredSchedules.length > 0 ? (
                                    filteredSchedules.map((schedule) => {
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
                                                            <>
                                                                <Link 
                                                                    href={`/schedules/view/${schedule.schedule_id}`} 
                                                                    className="text-teal-400 hover:text-teal-300 flex gap-1 items-center transition-colors" 
                                                                    title="View Details"
                                                                >
                                                                    <Eye size={16} />View
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
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                            {searchTerm ? (
                                                <>No schedules found matching &quot;{searchTerm}&quot;</>
                                            ) : (
                                                <>No schedules available. Click &quot;Add Schedule&quot; to create one.</>
                                            )}
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
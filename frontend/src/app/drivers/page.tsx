// src/app/drivers/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout/Layout";
import Link from "next/link";

import {
    User, Trash2, Edit, Plus,
    Bus as BusIcon, Car, Search,
    Wifi, Video, CheckCircle, XCircle, Clock, ScanEye
} from "lucide-react";

import { driverService } from "@/services/driverService";
import { Driver } from "@/interfaces/driver";
import { busService } from "@/services/busService";
import { Bus } from "@/interfaces/bus";

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function DriverAndBusPage() {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<'drivers' | 'buses'>('drivers');
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [buses, setBuses] = useState<Bus[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const handleNavigate = (item: string) => {
        if (item === "dashboard") router.push("/");
        else if (item === "student") router.push("/students");
        else if (item === "tracking") router.push("/tracking");
        else if (item === "schedule") router.push("/schedules");
        else if (item === "route") router.push("/routes");
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            if (activeTab === 'drivers') {
                const data = await driverService.getAllDrivers();
                setDrivers(data);
            } else {
                const data = await busService.getAllBuses();
                setBuses(data);
            }
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchData();
        setSearchTerm("");
    }, [fetchData]);

    const formatId = (id: number, prefix: string) => `#${prefix}-${String(id).padStart(5, "0")}`;

    const showDeleteConfirm = async (title: string, text: string) => {
        return MySwal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, disable it!',
            background: '#1f2937',
            color: '#fff',
            iconColor: '#f87171'
        });
    };

    // --- XÓA MỀM DRIVER ---
    const handleDeleteDriver = async (id: number) => {
        const result = await showDeleteConfirm(
            'Delete Driver?',
            "This driver will be marked as inactive. You can restore them later."
        );

        if (result.isConfirmed) {
            try {
                await driverService.deleteDriver(id);
                MySwal.fire({
                    title: 'Deleted!',
                    text: 'Driver has been marked as inactive.',
                    icon: 'success',
                    background: '#1f2937',
                    color: '#fff',
                    timer: 1500,
                    showConfirmButton: false
                });
                fetchData();
            } catch (error) {
                console.error(error);
                MySwal.fire({ title: 'Error!', text: 'Failed to delete driver.', icon: 'error', background: '#1f2937', color: '#fff' });
            }
        }
    };

    // --- XÓA MỀM BUS ---
    const handleDeleteBus = async (id: number) => {
        const result = await showDeleteConfirm(
            'Delete Bus?',
            "Are you sure you want to delete this bus?"
        );

        if (result.isConfirmed) {
            try {
                await busService.deleteBus(id);
                MySwal.fire({
                    title: 'Deleted!',
                    text: 'Bus has been marked as inactive.',
                    icon: 'success',
                    background: '#1f2937',
                    color: '#fff',
                    timer: 1500,
                    showConfirmButton: false
                });
                fetchData();
            } catch (error) {
                console.error(error);
                MySwal.fire({ title: 'Error!', text: 'Failed to delete bus.', icon: 'error', background: '#1f2937', color: '#fff' });
            }
        }
    };

    const filteredDrivers = drivers.filter(d => {
        const term = searchTerm.toLowerCase();
        const name = d.person?.person_name?.toLowerCase() || "";
        const id = d.driver_person_id.toString();
        return name.includes(term) || id.includes(term);
    });

    const filteredBuses = buses.filter(b => {
        const term = searchTerm.toLowerCase();
        const plate = b.bus_license_plate.toLowerCase();
        const brand = b.bus_brand.toLowerCase();
        return plate.includes(term) || brand.includes(term);
    });

    const content = (
        <div className="p-6 w-full text-gray-100">

            <div className="mb-8">
                <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-700 pb-4 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            {activeTab === 'drivers' ? <Car className="text-blue-500" /> : <BusIcon className="text-yellow-500" />}
                            Drivers and Buses management
                        </h1>
                    </div>

                    <div className="flex bg-gray-800 p-1 rounded-lg">
                        <button onClick={() => setActiveTab('drivers')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'drivers' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}><Car size={16} /> Drivers</button>
                        <button onClick={() => setActiveTab('buses')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'buses' ? 'bg-yellow-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}><BusIcon size={16} /> Buses</button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative w-full md:w-auto">
                    <input type="text" placeholder={activeTab === 'drivers' ? "Search Driver Name or ID..." : "Search License Plate..."} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none w-full md:w-64" />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-sm text-gray-400 whitespace-nowrap">Showing {activeTab === 'drivers' ? filteredDrivers.length : filteredBuses.length} records</div>
                    <Link href={activeTab === 'drivers' ? "/drivers/create" : "/buses/create"} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap">
                        <Plus size={18} /> {activeTab === 'drivers' ? 'Add Driver' : 'Add Bus'}
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-400">Loading data...</div>
            ) : (
                <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">

                        {/* === DRIVERS TABLE (ĐÃ CẬP NHẬT XÓA MỀM) === */}
                        {activeTab === 'drivers' && (
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-900/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Driver ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Full Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Experience</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Late Count</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700 bg-gray-800">
                                    {filteredDrivers.length > 0 ? filteredDrivers.map((driver) => {
                                        const isActive = driver.person?.person_life_cycle_status !== false; // Mặc định true

                                        return (
                                            <tr key={driver.driver_person_id} className={`hover:bg-gray-750 transition-colors ${!isActive ? 'opacity-50 bg-gray-900' : ''}`}>
                                                <td className="px-6 py-4 text-sm font-medium text-white">{formatId(driver.driver_person_id, 'DRV')}</td>
                                                <td className="px-6 py-4"><div className="flex items-center"><div className="h-8 w-8 rounded-full bg-blue-900/30 text-blue-400 flex items-center justify-center mr-3"><User size={16} /></div><div><div className="text-sm font-medium text-white">{driver.person?.person_name || "Unknown"}</div><div className="text-xs text-gray-500">{driver.person?.person_phone}</div></div></div></td>
                                                <td className="px-6 py-4 text-sm text-gray-300">{driver.driver_experience} {driver.driver_experience_type}(s)</td>
                                                <td className="px-6 py-4">{driver.driver_late_arrival_count > 0 ? <span className="bg-red-900/30 text-red-400 px-2 py-1 rounded text-xs border border-red-800 flex items-center gap-1 w-fit"><Clock size={12} /> {driver.driver_late_arrival_count} Late</span> : <span className="text-gray-500 text-sm">Perfect</span>}</td>

                                                {/* STATUS COLUMN (MỚI) */}
                                                <td className="px-6 py-4 text-sm">
                                                    {isActive ?
                                                        <span className="text-green-400 flex items-center gap-1 text-xs bg-green-900/20 px-2 py-1 rounded-full w-fit border border-green-800"><CheckCircle size={12} /> Active</span> :
                                                        <span className="text-red-400 flex items-center gap-1 text-xs bg-red-900/20 px-2 py-1 rounded-full w-fit border border-red-800"><XCircle size={12} /> Inactive</span>
                                                    }
                                                </td>

                                                <td className="px-6 py-4 text-sm font-medium">
                                                    <div className="flex gap-4 items-center">
                                                        {isActive ? (
                                                            <>
                                                                <Link href={`/drivers/view/${driver.driver_person_id}`} className="text-teal-400 hover:text-teal-300 flex gap-1 items-center transition-colors" title="View Profile"><ScanEye size={16} />View</Link>
                                                                <Link href={`/drivers/edit/${driver.driver_person_id}`} className="text-blue-400 hover:text-blue-300 flex gap-1 items-center"><Edit size={16} /> Edit</Link>
                                                                <button onClick={() => handleDeleteDriver(driver.driver_person_id)} className="text-red-400 hover:text-red-300 flex gap-1 items-center"><Trash2 size={16} /> Delete</button>
                                                            </>
                                                        ) : (
                                                            <span className="text-gray-500 text-xs italic">Archived</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }) : (
                                        <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No drivers found matching &quot;{searchTerm}&quot;</td></tr>
                                    )}
                                </tbody>
                            </table>
                        )}

                        {/* === BUSES TABLE (ĐÃ CÓ XÓA MỀM TỪ TRƯỚC) === */}
                        {activeTab === 'buses' && (
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-900/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">License Plate</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Model</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Amenities</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700 bg-gray-800">
                                    {filteredBuses.length > 0 ? filteredBuses.map((bus) => {
                                        const isActive = bus.bus_status;

                                        return (
                                            <tr key={bus.bus_id} className={`hover:bg-gray-750 transition-colors ${!isActive ? 'opacity-50 bg-gray-900' : ''}`}>
                                                <td className="px-6 py-4"><div className={`text-sm font-bold px-2 py-1 rounded w-fit border ${isActive ? 'text-yellow-400 bg-yellow-900/20 border-yellow-700/50' : 'text-gray-500 bg-gray-800 border-gray-700'}`}>{bus.bus_license_plate}</div></td>
                                                <td className="px-6 py-4 text-sm text-white">{bus.bus_brand} - {bus.bus_model}<div className="text-xs text-gray-500">{bus.bus_capacity} seats</div></td>
                                                <td className="px-6 py-4 text-sm"><div className="flex gap-3"><Wifi size={18} className={bus.bus_has_wifi ? "text-green-400" : "text-gray-600"} /><Video size={18} className={bus.bus_has_camera ? "text-blue-400" : "text-gray-600"} /></div></td>

                                                <td className="px-6 py-4 text-sm">
                                                    {isActive ?
                                                        <span className="text-green-400 flex items-center gap-1 text-xs bg-green-900/20 px-2 py-1 rounded-full w-fit border border-green-800"><CheckCircle size={12} /> Active</span> :
                                                        <span className="text-red-400 flex items-center gap-1 text-xs bg-red-900/20 px-2 py-1 rounded-full w-fit border border-red-800"><XCircle size={12} /> Inactive</span>
                                                    }
                                                </td>

                                                <td className="px-6 py-4 text-sm font-medium">
                                                    <div className="flex gap-4 items-center">
                                                        {isActive ? (
                                                            <>
                                                                <Link href={`/buses/view/${bus.bus_id}`} className="text-teal-400 hover:text-teal-300 flex gap-1 items-center transition-colors" title="View Details"><ScanEye size={16} />View</Link>
                                                                <Link href={`/buses/edit/${bus.bus_id}`} className="text-blue-400 hover:text-blue-300 flex gap-1 items-center"><Edit size={16} /> Edit</Link>
                                                                <button onClick={() => handleDeleteBus(bus.bus_id || 0)} className="text-red-400 hover:text-red-300 flex gap-1 items-center"><Trash2 size={16} /> Delete</button>
                                                            </>
                                                        ) : (
                                                            <span className="text-gray-500 text-xs italic">Archived</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }) : (
                                        <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No buses found matching &quot;{searchTerm}&quot;</td></tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    return <Layout activeItem="driver" onNavigate={handleNavigate}>{content}</Layout>;
}


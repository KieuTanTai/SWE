// src/app/buses/view/[id]/page.tsx
"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { busService } from "@/services/busService";
import { ArrowLeft, Edit, ScanEye, Bus as BusIcon, Wifi, Video, CheckCircle, XCircle } from "lucide-react";
import Layout from "@/components/layout/Layout";

export default function ViewBusPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const busId = Number(resolvedParams.id);

  const [loading, setLoading] = useState(true);
  const [busData, setBusData] = useState({
    bus_license_plate: "",
    bus_brand: "",
    bus_model: "",
    bus_capacity: 0,
    bus_has_wifi: false,
    bus_has_camera: false,
    bus_status: true,
    bus_age: 0
  });

  const handleNavigate = (item: string) => {
    if (item === "dashboard") router.push("/");
    else if (item === "student") router.push("/students");
    else if (item === "tracking") router.push("/?tab=tracking");
    else if (item === "driver") router.push("/drivers");
  };

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const data = await busService.getBusById(busId);
        setBusData({
          bus_license_plate: data.bus_license_plate,
          bus_brand: data.bus_brand,
          bus_model: data.bus_model,
          bus_capacity: data.bus_capacity,
          bus_has_wifi: data.bus_has_wifi,
          bus_has_camera: data.bus_has_camera,
          bus_status: data.bus_status,
          bus_age: data.bus_age || 0
        });
      } catch (err) {
        console.error(err);
        alert("Bus not found!");
        router.push("/drivers");
      } finally {
        setLoading(false);
      }
    };
    if (busId) fetchBus();
  }, [busId, router]);

  const content = (
    <div className="p-6 max-w-3xl mx-auto text-gray-100">
      <button onClick={() => router.back()} className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft size={20} className="mr-2" /> Back to List
      </button>

      <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-8">
        <h1 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 border-b border-gray-700 pb-4">
          <ScanEye className="text-yellow-500" size={32} /> 
          <div>
            Vehicle Details
            <span className="block text-gray-500 text-lg font-normal mt-1">ID: #{busId}</span>
          </div>
        </h1>

        {loading ? (
           <div className="text-center py-10 text-gray-400">Loading information...</div>
        ) : (
          <div className="space-y-8">
            
            {/* Technical Specs */}
            <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
                    <BusIcon size={18} /> Technical Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">License Plate</label>
                        <div className="w-full p-3 bg-gray-900/50 border border-yellow-700/30 rounded-lg text-yellow-400 font-bold">
                            {busData.bus_license_plate}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                        <div className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg flex items-center gap-2">
                            {busData.bus_status ? (
                                <span className="text-green-400 flex items-center gap-1"><CheckCircle size={16}/> Active</span>
                            ) : (
                                <span className="text-red-400 flex items-center gap-1"><XCircle size={16}/> Maintenance</span>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Brand & Model</label>
                        <div className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white">
                            {busData.bus_brand} - {busData.bus_model}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Capacity</label>
                        <div className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white">
                            {busData.bus_capacity} Seats
                        </div>
                    </div>
                </div>
            </div>

            {/* Amenities */}
            <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-4">Amenities</h3>
                <div className="flex gap-6">
                    <div className={`flex items-center gap-2 p-3 rounded-lg border ${busData.bus_has_wifi ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-gray-700 bg-gray-800 text-gray-500'}`}>
                        <Wifi size={20} /> 
                        <span>{busData.bus_has_wifi ? "Wi-Fi Available" : "No Wi-Fi"}</span>
                    </div>
                    <div className={`flex items-center gap-2 p-3 rounded-lg border ${busData.bus_has_camera ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' : 'border-gray-700 bg-gray-800 text-gray-500'}`}>
                        <Video size={20} />
                        <span>{busData.bus_has_camera ? "CCTV Installed" : "No Camera"}</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-gray-700 flex justify-end gap-4">
                <button 
                    onClick={() => router.push(`/buses/edit/${busId}`)} 
                    className="flex items-center justify-center px-6 py-2.5 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-lg transition-all"
                >
                    <Edit size={18} className="mr-2" /> Edit Bus
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return <Layout activeItem="driver" onNavigate={handleNavigate}>{content}</Layout>;
}
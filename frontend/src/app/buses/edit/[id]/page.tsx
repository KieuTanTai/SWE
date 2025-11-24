// src/app/buses/edit/[id]/page.tsx
"use client";

import { useEffect, useState, use } from "react"; // Import use cho Next.js 15
import { useRouter } from "next/navigation";
import { busService } from "@/services/busService";
import { ArrowLeft, Save, Bus as BusIcon, Wifi, Video } from "lucide-react";
import Layout from "@/components/layout/Layout";

export default function EditBusPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  // Trong Next.js 15, params là Promise, cần unwrap
  const resolvedParams = use(params);
  const busId = Number(resolvedParams.id);

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    bus_license_plate: "",
    bus_brand: "",
    bus_model: "", 
    bus_capacity: 0,
    bus_has_wifi: false,
    bus_has_camera: false,
  });

  // Load dữ liệu cũ lên form
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await busService.getBusById(busId);
        setFormData({
          bus_license_plate: data.bus_license_plate,
          bus_brand: data.bus_brand,
          bus_model: data.bus_model,
          bus_capacity: data.bus_capacity,
          bus_has_wifi: data.bus_has_wifi,
          bus_has_camera: data.bus_has_camera,
        });
      } catch (err) {
        console.error(err);
        alert("Bus not found");
        router.push("/drivers");
      } finally {
        setLoading(false);
      }
    };
    if(busId) loadData();
  }, [busId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await busService.updateBus(busId, {
        ...formData,
        bus_capacity: Number(formData.bus_capacity)
      });
      alert("Bus updated successfully!");
      router.push("/drivers");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const handleNavigate = (item: string) => {
    if (item === "dashboard") router.push("/");
    else if (item === "student") router.push("/students");
    else if (item === "driver") router.push("/drivers");
  };

  const content = (
    <div className="p-6 max-w-3xl mx-auto text-gray-100">
      <button onClick={() => router.back()} className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft size={20} className="mr-2" /> Back to List
      </button>

      <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-8">
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 pb-4 border-b border-gray-700">
          <BusIcon className="text-yellow-500" /> Edit Bus <span className="text-gray-500 text-lg font-normal">#{busId}</span>
        </h1>

        {loading ? (
            <div className="text-center py-10 text-gray-400">Loading bus info...</div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* License Plate */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">License Plate</label>
                        <input type="text" name="bus_license_plate" value={formData.bus_license_plate} onChange={handleChange} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none" />
                    </div>
                    {/* Capacity */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Capacity</label>
                        <input type="number" name="bus_capacity" value={formData.bus_capacity} onChange={handleChange} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Brand */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Brand</label>
                        <input type="text" name="bus_brand" value={formData.bus_brand} onChange={handleChange} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none" />
                    </div>
                    {/* Model */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
                        <input type="text" name="bus_model" value={formData.bus_model} onChange={handleChange} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none" />
                    </div>
                </div>

                {/* Amenities Toggles */}
                <div className="flex gap-8 py-2">
                    <label className="flex items-center cursor-pointer gap-3 p-4 bg-gray-700/50 rounded-lg border border-gray-600 w-full hover:bg-gray-700 transition-colors">
                        <input type="checkbox" name="bus_has_wifi" checked={formData.bus_has_wifi} onChange={handleChange} className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-500 accent-yellow-500" />
                        <span className="flex items-center gap-2 text-white"><Wifi size={18} className="text-green-400"/> Has Wifi</span>
                    </label>
                    <label className="flex items-center cursor-pointer gap-3 p-4 bg-gray-700/50 rounded-lg border border-gray-600 w-full hover:bg-gray-700 transition-colors">
                        <input type="checkbox" name="bus_has_camera" checked={formData.bus_has_camera} onChange={handleChange} className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-500 accent-yellow-500" />
                        <span className="flex items-center gap-2 text-white"><Video size={18} className="text-blue-400"/> Has Camera</span>
                    </label>
                </div>

                <div className="pt-4 flex justify-end">
                    <button type="submit" className="flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-lg transition-all">
                        <Save size={20} className="mr-2" /> Save Changes
                    </button>
                </div>
            </form>
        )}
      </div>
    </div>
  );

  return <Layout activeItem="driver" onNavigate={handleNavigate}>{content}</Layout>;
}
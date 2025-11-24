// src/app/buses/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { busService } from "@/services/busService";
import { ArrowLeft, Save, Bus as BusIcon, Wifi, Video } from "lucide-react";
import Layout from "@/components/layout/Layout";

export default function CreateBusPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // State form
  const [formData, setFormData] = useState({
    bus_license_plate: "",
    bus_brand: "",
    bus_model: "",
    bus_capacity: 29, // Mặc định
    bus_has_wifi: false,
    bus_has_camera: false,
    bus_status: true, // Mặc định Active
  });

  // Xử lý thay đổi input (bao gồm cả checkbox)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        // Validate đơn giản
        if(!formData.bus_license_plate) throw new Error("License Plate is required");
        
        // Gọi Service
        await busService.createBus({
            ...formData,
            bus_capacity: Number(formData.bus_capacity),
            bus_year_manufactured: new Date().getFullYear(), // Mock năm sản xuất
            bus_color: "White" 
        });

        alert("Bus created successfully!");
        // Quan trọng: Quay về trang danh sách (đang nằm ở /drivers tab 2)
        router.push("/drivers"); 
    } catch (error) {
        console.error(error);
        alert("Failed to create bus");
    } finally {
        setLoading(false);
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
          <BusIcon className="text-yellow-500" /> Add New Bus
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* License Plate */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">License Plate *</label>
                    <input type="text" name="bus_license_plate" value={formData.bus_license_plate} onChange={handleChange} required placeholder="e.g., 59A-123.45" className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none" />
                </div>
                {/* Capacity */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Capacity (Seats) *</label>
                    <input type="number" name="bus_capacity" value={formData.bus_capacity} onChange={handleChange} required min="4" className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Brand */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Brand</label>
                    <input type="text" name="bus_brand" value={formData.bus_brand} onChange={handleChange} placeholder="Hyundai, Ford..." className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none" />
                </div>
                {/* Model */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
                    <input type="text" name="bus_model" value={formData.bus_model} onChange={handleChange} placeholder="County, Transit..." className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none" />
                </div>
            </div>

            {/* Tiện ích (Checkbox Toggles) */}
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
                <button type="submit" disabled={loading} className="flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-lg transition-all disabled:opacity-50">
                    {loading ? "Saving..." : <><Save size={20} className="mr-2" /> Save Bus</>}
                </button>
            </div>
        </form>
      </div>
    </div>
  );

  return <Layout activeItem="driver" onNavigate={handleNavigate}>{content}</Layout>;
}
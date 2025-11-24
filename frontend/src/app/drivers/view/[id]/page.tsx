// src/app/drivers/view/[id]/page.tsx
"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { driverService } from "@/services/driverService";
import { ArrowLeft, Edit, ScanEye, User, Car, Clock } from "lucide-react";
import Layout from "@/components/layout/Layout";

export default function ViewDriverPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const driverId = Number(resolvedParams.id);

  const [loading, setLoading] = useState(true);
  
  // State dữ liệu hiển thị
  const [driverData, setDriverData] = useState({
    person_name: "",
    person_phone: "",
    person_gender: false,
    person_birthday: Date.now(),
    driver_experience: 0,
    driver_experience_type: "",
    driver_late_arrival_count: 0,
  });

  const handleNavigate = (item: string) => {
    if (item === "dashboard") router.push("/");
    else if (item === "student") router.push("/students");
    else if (item === "tracking") router.push("/?tab=tracking");
    else if (item === "driver") router.push("/drivers");
  };

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const data = await driverService.getDriverById(driverId);
        setDriverData({
          person_name: data.person?.person_name || "N/A",
          person_phone: data.person?.person_phone || "N/A",
          person_gender: data.person?.person_gender || false,
          person_birthday: typeof data.person?.person_birthday === "object"
            ? (data.person.person_birthday as Date).getTime()
            : data.person?.person_birthday || Date.now(),
          driver_experience: data.driver_experience,
          driver_experience_type: data.driver_experience_type,
          driver_late_arrival_count: data.driver_late_arrival_count,
        });
      } catch (err) {
        console.error(err);
        alert("Driver not found!");
        router.push("/drivers");
      } finally {
        setLoading(false);
      }
    };
    if (driverId) fetchDriver();
  }, [driverId, router]);

  const content = (
    <div className="p-6 max-w-3xl mx-auto text-gray-100">
      <button onClick={() => router.back()} className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft size={20} className="mr-2" /> Back to List
      </button>

      <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-8">
        <h1 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 border-b border-gray-700 pb-4">
          <ScanEye className="text-blue-500" size={32} /> 
          <div>
            Driver Profile
            <span className="block text-gray-500 text-lg font-normal mt-1">ID: #{driverId}</span>
          </div>
        </h1>

        {loading ? (
           <div className="text-center py-10 text-gray-400">Loading information...</div>
        ) : (
          <div className="space-y-8">
            
            {/* Personal Info */}
            <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                    <User size={18} /> Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                        <div className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white font-medium">
                            {driverData.person_name}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                        <div className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white">
                            {driverData.person_phone}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Gender</label>
                        <div className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white">
                            {driverData.person_gender}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Date of Birth</label>
                        <div className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white">
                            {driverData.person_birthday}
                        </div>
                    </div>
                </div>
            </div>

            {/* Professional Info */}
            <div>
                <h3 className="text-lg font-semibold text-yellow-500 mb-4 flex items-center gap-2">
                    <Car size={18} /> Professional Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Experience</label>
                        <div className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white">
                            {driverData.driver_experience} {driverData.driver_experience_type}(s)
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Late Arrival Count</label>
                        <div className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white flex items-center gap-2">
                            <Clock size={16} className={driverData.driver_late_arrival_count > 0 ? "text-red-400" : "text-green-400"}/>
                            {driverData.driver_late_arrival_count} times
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions - Vẫn giữ nút Edit */}
            <div className="pt-6 border-t border-gray-700 flex justify-end gap-4">
                <button 
                    onClick={() => router.push(`/drivers/edit/${driverId}`)} 
                    className="flex items-center justify-center px-6 py-2.5 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-lg transition-all"
                >
                    <Edit size={18} className="mr-2" /> Edit Driver
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return <Layout activeItem="driver" onNavigate={handleNavigate}>{content}</Layout>;
}
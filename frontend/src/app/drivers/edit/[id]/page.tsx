// src/app/drivers/edit/[id]/page.tsx
"use client";

import { useEffect, useState, use } from "react"; // Import 'use' cho Next.js 15
import { useRouter } from "next/navigation";
import { driverService } from "@/services/driverService";
import { ArrowLeft, Save, User, Car } from "lucide-react";
import Layout from "@/components/layout/Layout";

export default function EditDriverPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  // Unwrap params (Bắt buộc trong Next.js 15)
  const resolvedParams = use(params);
  const driverId = Number(resolvedParams.id);

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    person_name: "",
    person_phone: "",
    person_gender: false,
    person_birthday: Date.now(),
    driver_experience: 0,
    driver_experience_type: "year",
  });

  // Load dữ liệu cũ
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await driverService.getDriverById(driverId);
        setFormData({
          person_name: data.person?.person_name || "",
          person_phone: data.person?.person_phone || "",
          person_gender: data.person?.person_gender || false,
          person_birthday: typeof data.person?.person_birthday === "object"
            ? (data.person.person_birthday as Date).getTime()
            : data.person?.person_birthday || Date.now(),
          driver_experience: data.driver_experience,
          driver_experience_type: data.driver_experience_type,
        });
      } catch (err) {
        console.error(err);
        alert("Driver not found");
        router.push("/drivers");
      } finally {
        setLoading(false);
      }
    };
    if(driverId) loadData();
  }, [driverId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await driverService.updateDriver(driverId, {
        ...formData,
        driver_experience: Number(formData.driver_experience)
      });
      alert("Driver updated successfully!");
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
          <Car className="text-blue-500" /> Edit Driver <span className="text-gray-500 text-lg font-normal">#{driverId}</span>
        </h1>

        {loading ? (
            <div className="text-center py-10 text-gray-400">Loading info...</div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* SECTION 1: PERSONAL INFO */}
                <div>
                    <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                        <User size={18} /> Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                            <input type="text" name="person_name" value={formData.person_name} onChange={handleChange} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                            <input type="tel" name="person_phone" value={formData.person_phone} onChange={handleChange} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                            <select
                                name="person_gender"
                                value={formData.person_gender ? "Male" : "Female"}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        person_gender: e.target.value === "Male"
                                    }))
                                }
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
                            <input type="date" name="person_birthday" value={formData.person_birthday} onChange={handleChange} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                        </div>
                    </div>
                </div>

                {/* SECTION 2: PROFESSIONAL INFO */}
                <div>
                    <h3 className="text-lg font-semibold text-yellow-500 mb-4 flex items-center gap-2">
                        <Car size={18} /> Professional Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Experience Amount</label>
                            <input type="number" name="driver_experience" value={formData.driver_experience} onChange={handleChange} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Experience Type</label>
                            <select name="driver_experience_type" value={formData.driver_experience_type} onChange={handleChange} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                <option value="year">Years</option>
                                <option value="month">Months</option>
                                <option value="day">Days</option>
                            </select>
                        </div>
                    </div>
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
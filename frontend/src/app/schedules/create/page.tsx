"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { scheduleService } from "@/services/scheduleService";
import { driverService } from "@/services/driverService";
import { ArrowLeft, Save, Calendar, User } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Driver } from "@/interfaces/driver";
import { Account, CreateScheduleDTO } from "@/interfaces";
import { useAccount } from "@/contexts/AccountContext";

export default function CreateSchedulePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(true);

  const account = useAccount().account;
  console.log(account);

  // State for Schedule Form
  const [formData, setFormData] = useState({
    schedule_driver_id: 0,
    schedule_start_date: "",
    schedule_end_date: "",
  });

  // Load danh sách drivers khi component mount
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const data = await driverService.getAllDrivers();
        // Chỉ lấy drivers đang active
        const activeDrivers = data.filter((driver: Driver) => driver.person?.person_life_cycle_status !== false);
        setDrivers(activeDrivers);
      } catch (error) {
        console.error("Failed to load drivers", error);
      } finally {
        setLoadingDrivers(false);
      }
    };

    fetchDrivers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate
      if (!formData.schedule_start_date || !formData.schedule_end_date) {
        throw new Error("Start date and end date are required");
      }

      if (formData.schedule_driver_id === 0) {
        throw new Error("Please select a driver");
      }

      // Validate: End date phải sau Start date
      const startDate = new Date(formData.schedule_start_date);
      const endDate = new Date(formData.schedule_end_date);
      
      if (endDate < startDate) {
        throw new Error("End date must be after start date");
      }

      // Convert data types
      const scheduleData: CreateScheduleDTO = {
        schedule_by_manager_id: Number(account?.person?.person_id),
        schedule_driver_id: Number(formData.schedule_driver_id),
        schedule_start_date: formData.schedule_start_date,
        schedule_end_date: formData.schedule_end_date,
      };

      // Call API
      const created = await scheduleService.createSchedule(scheduleData);

      alert("Schedule created successfully!");
      router.push("/schedules/?refresh=1");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to create schedule");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (item: string) => {
    if (item === "dashboard") router.push("/");
    else if (item === "student") router.push("/students");
    else if (item === "schedule") router.push("/schedules");
    else if (item === "driver") router.push("/drivers");
  };

  const content = (
    <div className="p-6 max-w-3xl mx-auto text-gray-100">
      <button 
        onClick={() => router.back()} 
        className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" /> Back to List
      </button>

      <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-8">
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 pb-4 border-b border-gray-700">
          <Calendar className="text-blue-500" /> Add New Schedule
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1: DRIVER SELECTION */}
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
              <User size={18} /> Driver Assignment
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Driver *
                </label>
                {loadingDrivers ? (
                  <div className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400">
                    Loading drivers...
                  </div>
                ) : (
                  <select 
                    name="schedule_driver_id" 
                    value={formData.schedule_driver_id} 
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="0">-- Select a driver --</option>
                    {drivers.map((driver) => (
                      <option key={driver.driver_person_id} value={driver.driver_person_id}>
                        {driver.person?.person_name || "Unknown"} 
                        {" "}({driver.driver_experience} {driver.driver_experience_type}(s) exp)
                      </option>
                    ))}
                  </select>
                )}
                {drivers.length === 0 && !loadingDrivers && (
                  <p className="text-xs text-yellow-500 mt-1">
                    No active drivers available. Please create a driver first.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: SCHEDULE DATES */}
          <div>
            <h3 className="text-lg font-semibold text-yellow-500 mb-4 flex items-center gap-2">
              <Calendar size={18} /> Schedule Period
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date *
                </label>
                <input 
                  type="date" 
                  name="schedule_start_date" 
                  value={formData.schedule_start_date} 
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]} // Không cho chọn ngày quá khứ
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Date *
                </label>
                <input 
                  type="date" 
                  name="schedule_end_date" 
                  value={formData.schedule_end_date} 
                  onChange={handleChange}
                  required
                  min={formData.schedule_start_date || new Date().toISOString().split('T')[0]}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                />
              </div>
            </div>

            {/* Duration Preview */}
            {formData.schedule_start_date && formData.schedule_end_date && (
              <div className="mt-4 p-4 bg-gray-700/50 border border-gray-600 rounded-lg">
                <p className="text-sm text-gray-300">
                  <span className="font-medium text-blue-400">Duration:</span>{" "}
                  {Math.ceil(
                    (new Date(formData.schedule_end_date).getTime() - 
                     new Date(formData.schedule_start_date).getTime()) / 
                    (1000 * 60 * 60 * 24)
                  )} day(s)
                </p>
              </div>
            )}
          </div>


          {/* Submit Button */}
          <div className="pt-4 flex justify-end gap-4">
            <button 
              type="button"
              className="px-6 py-3 rounded-lg font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading || drivers.length === 0}
              className="flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                "Saving..."
              ) : (
                <>
                  <Save size={20} className="mr-2" /> Create Schedule
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return <Layout activeItem="schedule" onNavigate={handleNavigate}>{content}</Layout>;
}
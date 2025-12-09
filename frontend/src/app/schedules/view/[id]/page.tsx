"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { scheduleService } from "@/services/scheduleService";
import { ArrowLeft, Calendar, User, ListPlus, Clock, Bus } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { DetailSchedule, PickupSchedule, Schedule } from "@/interfaces";
import { DetailScheduleService } from "@/services/detailScheduleService";

export default function ViewSchedulePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const scheduleId = Number(params?.id);

  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [detailSchedule, setDetailSchedule] = useState<DetailSchedule | null>(null);
  const [pickupSchedules, setPickupSchedules] = useState<PickupSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSchedule = async () => {
    if (!scheduleId) {
      router.back();
      return;
    }

    try {
      setLoading(true);
      const scheduleData = await scheduleService.getByScheduleId(scheduleId);
      setSchedule(scheduleData);

      // Load detail schedule if exists
      if (scheduleData.detailSchedules && scheduleData.detailSchedules.length > 0) {
        const detailSchedules = await DetailScheduleService.getByScheduleId(scheduleId);
        const loadedDetailSchedule = detailSchedules[0];
        setDetailSchedule(loadedDetailSchedule);

        // Load pickup schedules from detail schedule
        if (loadedDetailSchedule.pickupSchedules && loadedDetailSchedule.pickupSchedules.length > 0) {
          setPickupSchedules(loadedDetailSchedule.pickupSchedules);
        }
      }
    } catch (error) {
      console.error("Failed to load schedule", error);
      alert("Failed to load schedule data");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string | Date | undefined) => {
    if (!d) return "N/A";
    const date = d instanceof Date ? d : new Date(d);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const handleNavigate = (item: string) => {
    if (item === "dashboard") router.push("/");
    else if (item === "student") router.push("/students");
    else if (item === "schedule") router.push("/schedules");
    else if (item === "driver") router.push("/drivers");
    else if (item === "tracking") router.push("/tracking");
    else if (item === "route") router.push("/routes");
  };

  const content = (
      <div className="p-6 max-w-5xl mx-auto text-gray-100">
        <button
            onClick={() => router.back()}
            className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to List
        </button>

        <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-8">
          <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 pb-4 border-b border-gray-700">
            <Calendar className="text-blue-500" /> View Schedule Details
          </h1>

          {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-400">Loading schedule details...</p>
              </div>
          ) : !schedule ? (
              <div className="text-center py-8">
                <p className="text-red-400">Schedule not found</p>
              </div>
          ) : (
              <div className="space-y-8">

                {/* SECTION 1: DRIVER & DATES */}
                <div className="flex flex-col gap-8 border border-gray-700 rounded-lg">
                  {/* Driver Assignment */}
                  <div className="p-4 bg-gray-700/30">
                    <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                      <User size={18} /> Driver Assignment
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Driver
                      </label>
                      <div className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white">
                        {schedule.driver?.person?.person_name || "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* Schedule Period */}
                  <div className="p-4 bg-gray-700/30">
                    <h3 className="text-lg font-semibold text-yellow-500 mb-4 flex items-center gap-2">
                      <Calendar size={18} /> Schedule Period
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Start Date
                        </label>
                        <div className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white">
                          {formatDate(schedule.schedule_start_date)}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          End Date
                        </label>
                        <div className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white">
                          {formatDate(schedule.schedule_end_date)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bus Route */}
                  <div className="p-4 bg-gray-700/30">
                    <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                      <Bus size={18} /> Bus Route Assignment
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Bus Route
                      </label>
                      <div className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white">
                        {detailSchedule?.busRoute?.bus?.bus_license_plate || "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* Time Role */}
                  <div className="p-4 bg-gray-700/30">
                    <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
                      <Clock size={18} /> Time Role Assignment
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Time Role
                      </label>
                      <div className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white">
                        {detailSchedule?.timeRole ?
                            `${detailSchedule.timeRole.time_role_start_pickup_time} - ${detailSchedule.timeRole.time_role_start_drop_off_time}`
                            : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-700 my-8"/>

                {/* PICKUP SCHEDULE DETAILS */}
                <div>
                  <div className="flex flex-row justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-green-400 flex items-center gap-2">
                      <ListPlus /> Pickup Schedule Detail
                    </h2>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-4">
                    Students in this schedule ({pickupSchedules.length})
                  </h3>

                  {pickupSchedules.length === 0 ? (
                      <p className="text-gray-400 italic p-4 border border-dashed border-gray-700 rounded-lg">
                        No students in this schedule.
                      </p>
                  ) : (
                      <div className="overflow-x-auto bg-gray-700/50 rounded-lg border border-gray-700">
                        <table className="min-w-full divide-y divide-gray-700">
                          <thead className="bg-gray-700">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Grade</th>
                          </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-700">
                          {pickupSchedules.map((pickup, index) => (
                              <tr key={pickup.pickup_schedule_id || `temp-${index}`} className="hover:bg-gray-700 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-300">
                                  {pickup.student?.student_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-300">
                                  {pickup.student?.person?.person_name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                  {pickup.student?.student_grade || '-'}
                                </td>
                              </tr>
                          ))}
                          </tbody>
                        </table>
                      </div>
                  )}
                </div>

                <hr className="border-gray-700 my-8"/>

                {/* Back Button */}
                <div className="pt-4 flex justify-end">
                  <button
                      type="button"
                      onClick={() => router.back()}
                      className="flex items-center px-6 py-3 rounded-lg font-medium text-white bg-gray-700 hover:bg-gray-600 transition-all"
                  >
                    <ArrowLeft size={20} className="mr-2" /> Back to List
                  </button>
                </div>
              </div>
          )}
        </div>
      </div>
  );

  return (
      <Layout
          activeItem="schedule"
          onNavigate={handleNavigate}
      >
        {content}
      </Layout>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { scheduleService } from "@/services/scheduleService";
import { driverService } from "@/services/driverService";
import { ArrowLeft, Save, Calendar, User, ListPlus, Trash2, Clock, MapPin, School, Bus, ArrowUpFromLine, ArrowDownToLine } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Driver } from "@/interfaces/driver";
import { BusRoute, CreatePickupScheduleDTO, DetailSchedule, PickupSchedule, Schedule, Student, TimeRole } from "@/interfaces";
import { studentService } from "@/services/studentService";
import { busRouteService } from "@/services/busRouteService";
import { timeRoleService } from "@/services/timeRoleService";
import { DetailScheduleService } from "@/services/detailScheduleService";
import { pickupScheduleService } from "@/services/pickupScheduleService";

export default function EditSchedulePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  //drivers
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  //bus routes
  const[busRoutes, setBusRoutes] = useState<BusRoute[]>([]);
  const[loadingBusRoutes, setLoadingBusRoutes] = useState(true);
  //time roles
  const[timeRoles, setTimeRoles] = useState<TimeRole[]>([]);
  const[loadingTimeRoles, setLoadingTimeRoles] = useState(true);
  //students
  const[students, setStudents] = useState<Student[]>([]);
  const[loadingStudents, setLoadingStudents] = useState(true);

  //toggle pickup detail form
  const [isAddDetail, setIsAddDetail] = useState(false);

  //schedule
  const params = useParams<{ id: string }>();
  const scheduleId = Number(params?.id);

  const [schedule, setSchedule] = useState<Schedule | null>(null);

  // --- State for Schedule Form ---
  const [formData, setFormData] = useState({
    schedule_driver_id: schedule?.schedule_driver_id || 0,
    schedule_start_date: "",
    schedule_end_date: "",
    detail_schedule_bus_route_id: 0,
    detail_schedule_time_role_id: 0,
  });
  
  // --- State for pickup schedule ---
  const [pickupSchedules, setPickupSchedules] = useState<PickupSchedule[]>([]);
  const [detailFormData, setDetailFormData] = useState<CreatePickupScheduleDTO>({
    pickup_schedule_student_id: 0,
    pickup_schedule_detail_id: 0,
  });

  const [detailSchedule, setDetailSchedule] = useState<DetailSchedule | null>(null);

const fetchDrivers = async () => {
  try {
    const data = await driverService.getAllDrivers();
    const activeDrivers = data.filter(
      (driver: Driver) => driver.person?.person_life_cycle_status !== false
    );
    setDrivers(activeDrivers);
  } catch (error) {
    console.error("Failed to load drivers", error);
  } finally {
    setLoadingDrivers(false);
  }
};

const fetchTimeRoles = async () => {
  try {
    const data = await timeRoleService.getAllTimeRoles();
    const activeTimeRoles = data.filter(
      (role: TimeRole) => role.time_role_status !== false
    );
    setTimeRoles(activeTimeRoles);
  } catch (error) {
    console.error("Failed to load time roles", error);
  } finally {
    setLoadingTimeRoles(false);
  }
};

const fetchBusRoutes = async () => {
  try {
    const data = await busRouteService.getAllBusRoutes();
    const activeRoutes = data.filter(
      (route: BusRoute) => route.bus_route_status !== false
    );
    setBusRoutes(activeRoutes);
  } catch (error) {
    console.error("Failed to load bus routes", error);
  } finally {
    setLoadingBusRoutes(false);
  }
};

const fetchStudents = async () => {
  try {
    const data = await studentService.getAllStudents();
    const activeStudents = data.filter(
      (student: Student) => student.person?.person_life_cycle_status !== false
    );
    setStudents(activeStudents);
  } catch (error) {
    console.error("Failed to load students", error);
  } finally {
    setLoadingStudents(false);
  }
};

const fetchSchedule = async () => {
  if (!scheduleId) {
    router.back();
    return;
  }
  
  try {
    const schedule = await scheduleService.getByScheduleId(scheduleId);
    setSchedule(schedule);

    // Load detail schedule if exists
    let loadedDetailSchedule = null;
    
    // Check if schedule has detailSchedules property from backend
    if (schedule.detailSchedules && schedule.detailSchedules.length > 0) {
      const detailSchedules = await DetailScheduleService.getByScheduleId(schedule.schedule_id);
      loadedDetailSchedule = detailSchedules[0];
      setDetailSchedule(loadedDetailSchedule);
      console.log("Loaded from schedule.detailSchedules:", loadedDetailSchedule);
      
      // Load pickup schedules from detail schedule
      if (loadedDetailSchedule.pickupSchedules && loadedDetailSchedule.pickupSchedules.length > 0) {
        setPickupSchedules(loadedDetailSchedule.pickupSchedules);
      }
    } 
    console.log("Loaded from schedule.detailSchedules:", loadedDetailSchedule);
    
    // Populate form data from schedule and detail schedule
    setFormData({
      schedule_driver_id: schedule.schedule_driver_id || 0,
      schedule_start_date: formatDate(schedule.schedule_start_date),
      schedule_end_date: formatDate(schedule.schedule_end_date),
      detail_schedule_bus_route_id: loadedDetailSchedule?.detail_schedule_bus_route_id || 0,
      detail_schedule_time_role_id: loadedDetailSchedule?.detail_schedule_time_role_id || 0,
    });
  } catch (error) {
    console.error("Failed to load schedule", error);
    alert("Failed to load schedule data");
  }
}

  const formatDate = (d?: string | Date) => {
    if (!d) return "";
    return d instanceof Date ? d.toISOString().slice(0,10) : d.slice(0,10);
  };

  // Load danh sách drivers khi component mount
  useEffect(() => {
    fetchDrivers();
    fetchTimeRoles();
    fetchBusRoutes();
    fetchStudents();
    fetchSchedule();
  }, []);

  // --- Handlers cho Schedule Form ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Handlers cho Toggle Schedule Detail Form ---
  const handleToggleDetail = async () => {
    try {
      //  Validate form data - check all fields have values
      if (!formData.schedule_driver_id || formData.schedule_driver_id === 0) {
        alert("Please select a driver first");
        return;
      }
      if (!formData.schedule_start_date) {
        alert("Please enter start date");
        return;
      }
      if (!formData.schedule_end_date) {
        alert("Please enter end date");
        return;
      }
      if (!formData.detail_schedule_bus_route_id || formData.detail_schedule_bus_route_id === 0) {
        alert("Please select a bus route");
        return;
      }
      if (!formData.detail_schedule_time_role_id || formData.detail_schedule_time_role_id === 0) {
        alert("Please select a time role");
        return;
      }

      // Check if schedule exists
      if (!scheduleId) {
        alert("Schedule ID not found");
        return;
      }

      // If detail schedule doesn't exist, create it
      if (!detailSchedule) {
        // Create new detail schedule
        await DetailScheduleService.createDetailSchedule({
          schedule_id: scheduleId,
          detail_schedule_bus_route_id: formData.detail_schedule_bus_route_id,
          detail_schedule_time_role_id: formData.detail_schedule_time_role_id,
        });
        
        // Fetch the newly created detail schedule
        const newDetailSchedules = await DetailScheduleService.getByScheduleId(scheduleId);
        if (newDetailSchedules && newDetailSchedules.length > 0) {
          const newDetailSchedule = newDetailSchedules[0];
          setDetailSchedule(newDetailSchedule);
          setDetailFormData({
            pickup_schedule_student_id: 0,
            pickup_schedule_detail_id: newDetailSchedule.detail_schedule_id,
          });
          console.log("Created new detail schedule:", newDetailSchedule);
        }
      } else {
        // Detail schedule already exists, just set the form data
        setDetailFormData({
          pickup_schedule_student_id: 0,
          pickup_schedule_detail_id: detailSchedule.detail_schedule_id,
        });
      }

      // Show form to add students
      setIsAddDetail(true);
    } catch (error: any) {
      console.error("Failed to prepare detail form", error);
      alert(error.message || "Failed to prepare detail form");
    }
  };

  // --- Handlers cho Detail Schedule Form ---
  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDetailFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddDetail = async (e: React.FormEvent) => {
    if(!detailSchedule) {
      alert("Detail schedule not found. Please click 'Add Detail' first.");
      return;
    }
    
    if (detailFormData.pickup_schedule_student_id === 0) {
      alert("Please select a student");
      return;
    }

    try {
      // Create pickup schedule in backend
      const newPickupSchedule = await pickupScheduleService.createPickupSchedule({
        pickup_schedule_student_id: detailFormData.pickup_schedule_student_id,
        pickup_schedule_detail_id: detailSchedule.detail_schedule_id,
      });

      // Find student details for display
      const selectedStudent = students.find(s => s.student_id === Number(detailFormData.pickup_schedule_student_id));
      
      // Add to local state with student info
      const pickupWithStudent: PickupSchedule = {
        ...newPickupSchedule,
        student: selectedStudent,
      };

      setPickupSchedules((prev) => [...prev, pickupWithStudent]);
      
      // Reset form
      setDetailFormData({
        pickup_schedule_student_id: 0,
        pickup_schedule_detail_id: detailSchedule.detail_schedule_id,
      });

      alert("Student added successfully!");
    } catch (error: any) {
      console.error("Failed to add student", error);
      alert(error.message || "Failed to add student to pickup schedule");
    }
  };

  const handleRemoveDetail = async (pickupScheduleId: number, studentId?: number) => {
    if (!pickupScheduleId || pickupScheduleId === 0) {
      alert("Invalid pickup schedule");
      return;
    }

    try {
      // Delete from backend
      await pickupScheduleService.deletePickupSchedule(pickupScheduleId);
      
      // Remove from local state
      setPickupSchedules((prev) => prev.filter(detail => detail.pickup_schedule_id !== pickupScheduleId));
      
      alert("Student removed successfully!");
    } catch (error: any) {
      console.error("Failed to remove student", error);
      alert(error.message || "Failed to remove student from pickup schedule");
    }
  };
  
  // --- Submit chung cho cả Schedule và Details ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      
      if (!scheduleId) {
        throw new Error("Schedule ID not found");
      }

      if (!formData.schedule_start_date || !formData.schedule_end_date) {
        throw new Error("Start date and end date are required");
      }

      if (formData.schedule_driver_id === 0) {
        throw new Error("Please select a driver");
      }

      if (formData.detail_schedule_bus_route_id === 0) {
        throw new Error("Please select a bus route");
      }

      if (formData.detail_schedule_time_role_id === 0) {
        throw new Error("Please select a time role");
      }

      const startDate = new Date(formData.schedule_start_date);
      const endDate = new Date(formData.schedule_end_date);
      
      if (endDate < startDate) {
        throw new Error("End date must be after start date");
      }

      if (!detailSchedule) {
        throw new Error("Detail schedule not created. Please click 'Add Detail' button first.");
      }

      if (pickupSchedules.length === 0) {
        throw new Error("Please add at least one student to the pickup schedule");
      }

      // Update schedule
      const updateData = {
        schedule_driver_id: Number(formData.schedule_driver_id),
        schedule_start_date: formData.schedule_start_date,
        schedule_end_date: formData.schedule_end_date,
      };
      
      await scheduleService.updateSchedule(scheduleId, updateData);
      
      // Update detail schedule
      await DetailScheduleService.updateDetailSchedule(detailSchedule.detail_schedule_id, {
        detail_schedule_bus_route_id: formData.detail_schedule_bus_route_id,
        detail_schedule_time_role_id: formData.detail_schedule_time_role_id,
      });

      alert("Schedule updated successfully!");
      router.push("/schedules/?refresh=1");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to update schedule");
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
    <div className="p-6 max-w-5xl mx-auto text-gray-100">
      <button 
        onClick={() => router.back()} 
        className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" /> Back to List
      </button>

      <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-8">
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 pb-4 border-b border-gray-700">
          <Calendar className="text-blue-500" /> Edit Schedule
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1: DRIVER SELECTION & DATES */}
          <div className="flex flex-col gap-8 border border-gray-700 rounded-lg">
            {/* Driver Assignment */}
            <div className="p-4  bg-gray-700/30">
              <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                <User size={18} /> Driver Assignment
              </h3>
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

            {/* Schedule Period */}
            <div className="p-4 bg-gray-700/30">
              <h3 className="text-lg font-semibold text-yellow-500 mb-4 flex items-center gap-2">
                <Calendar size={18} /> Schedule Period
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Date *
                  </label>
                  <input 
                    type="date" 
                    name="schedule_start_date" 
                    value={formatDate(formData.schedule_start_date)} 
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]} 
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
                    value={formatDate(formData.schedule_end_date)} 
                    onChange={handleChange}
                    required
                    min={formData.schedule_start_date || new Date().toISOString().split('T')[0]}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  />
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
                  Select Bus Route *
                </label>
                {loadingBusRoutes ? (
                  <div className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400">
                    Loading Bus Routes...
                  </div>
                ) : (
                  <select 
                    name="detail_schedule_bus_route_id" 
                    value={formData.detail_schedule_bus_route_id} 
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="0">-- Select a Bus Route --</option>
                    {busRoutes.map((br) => (
                      <option key={br.bus_route_id} value={br.bus_route_id}>
                        {br.bus?.bus_license_plate || "Unknown"} 
                      </option>
                    ))}
                  </select>
                )}
                {busRoutes.length === 0 && !loadingBusRoutes && (
                  <p className="text-xs text-yellow-500 mt-1">
                    No active bus routes available. 
                  </p>
                )}
              </div>
            </div>

            {/* Time Role */}
            <div className="p-4 bg-gray-700/30">
              <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
                <Clock size={18} /> Time Role Assignment
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Time Role *
                </label>
                {loadingTimeRoles ? (
                  <div className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400">
                    Loading Time Role...
                  </div>
                ) : (
                  <select 
                    name="detail_schedule_time_role_id" 
                    value={formData.detail_schedule_time_role_id} 
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="0">-- Select a Time Role --</option>
                    {timeRoles.map((tr) => (
                      <option key={tr.time_role_id} value={tr.time_role_id}>
                        {tr.time_role_start_pickup_time} - {tr.time_role_start_drop_off_time}
                      </option>
                    ))}
                  </select>
                )}
                {timeRoles.length === 0 && !loadingTimeRoles && (
                  <p className="text-xs text-yellow-500 mt-1">
                    No active time role available. Please create one first.
                  </p>
                )}
            </div>

          </div>

        </div>
          
          <hr className="border-gray-700 my-8"/>

          {/*  DETAIL SCHEDULE MANAGEMENT  */}
          <div>
            <div className="flex flex-row justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-green-400 mb-6 flex items-center gap-2">
                <ListPlus /> Pickup Schedule Detail
                </h2>
              </div>

              <div className="flex justify-end pt-2">
                  <button 
                    type="button" 
                    onClick={handleToggleDetail}
                    className="flex items-center px-4 py-2 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition-all"
                  >
                    <ListPlus size={18} className="mr-2" /> Add Detail
                  </button>
              </div>
            </div>

            {/* Form Tạo Pickup Schedule */}
            {isAddDetail && (
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Add New Detail</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Student Selection */}
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Select Student *
                      </label>
                      {loadingStudents ? (
                        <div className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400">
                          Loading students...
                        </div>
                      ) : (
                        <select 
                          name="pickup_schedule_student_id" 
                          value={detailFormData.pickup_schedule_student_id} 
                          onChange={handleDetailChange}
                          required
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                          <option value="0">-- Select a student --</option>
                          {students.map((student) => (
                            <option key={student.student_id} value={student.student_id}>
                              {student.person?.person_name || "Unknown"} 
                              {" "}(Grade {student.student_grade})
                            </option>
                          ))}
                        </select>
                      )}
                      {students.length === 0 && !loadingStudents && (
                        <p className="text-xs text-yellow-500 mt-1">
                          No active students available.
                        </p>
                      )}
                    </div>

                    {/* Nút Thêm học sinh */}
                    <div className="flex items-end">
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddDetail(e);
                        }}
                        disabled={loadingStudents}
                        className="w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ListPlus size={18} className="mr-2" /> Add Student
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Table Hiển thị học sinh đã thêm */}
            <h3 className="text-lg font-semibold text-white mb-4">Added students ({pickupSchedules.length})</h3>
            
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
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
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
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => handleRemoveDetail(pickup.pickup_schedule_id, pickup.pickup_schedule_student_id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1 rounded hover:bg-red-900/50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
          </div>

          <hr className="border-gray-700 my-8"/>

          {/* Submit Button */}
          <div className="pt-4 flex justify-end gap-4">
            <button 
              type="button"
              onClick={() => router.back()}
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
                "Updating..."
              ) : (
                <>
                  <Save size={20} className="mr-2" /> Update Schedule
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
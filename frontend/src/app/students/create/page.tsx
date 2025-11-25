// src/app/students/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { studentService } from "@/services/studentService";
import { ArrowLeft, Save, User, GraduationCap } from "lucide-react";
import Layout from "@/components/layout/Layout";

export default function CreateStudentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // State gộp (Person + Student)
  const [formData, setFormData] = useState({
    // Person Info
    person_name: "",
    person_gender: "Male",
    person_birthday: "",
    person_phone: "", 
    
    // Student Info
    student_grade: 10,
    student_parent_id: "", // ID phụ huynh
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        // Validate cơ bản
        if(!formData.person_name) throw new Error("Student Name is required");
        if(!formData.student_parent_id) throw new Error("Parent ID is required");

        // Chuẩn bị dữ liệu gửi lên (Mock)
        const payload = {
            ...formData,
            student_grade: String(formData.student_grade),
            student_parent_id: Number(formData.student_parent_id),
            person_type: 'student'
        };

        await studentService.createStudent(payload);

        alert("Student added successfully!");
        router.push("/students");
    } catch (error) {
        console.error(error);
        alert("Failed to create student");
    } finally {
        setLoading(false);
    }
  };

  // Logic điều hướng Sidebar
  const handleNavigate = (item: string) => {
    if (item === "dashboard") router.push("/");
    else if (item === "driver") router.push("/drivers");
    else if (item === "student") router.push("/students");
    else if (item === "tracking") router.push("/tracking");
  };

  const content = (
    <div className="p-6 max-w-3xl mx-auto text-gray-100">
      {/* Nút quay lại */}
      <button 
        onClick={() => router.back()} 
        className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" /> Back to List
      </button>

      <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-8">
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 pb-4 border-b border-gray-700">
          <GraduationCap className="text-green-500" /> Add New Student
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* SECTION 1: PERSONAL DETAILS (Thông tin cá nhân) */}
            <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                    <User size={18} /> Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                        <input 
                            type="text" 
                            name="person_name" 
                            value={formData.person_name} 
                            onChange={handleChange} 
                            required 
                            placeholder="Nguyen Van A" 
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:outline-none placeholder-gray-500" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                        <select 
                            name="person_gender" 
                            value={formData.person_gender} 
                            onChange={handleChange} 
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
                        <input 
                            type="date" 
                            name="person_birthday" 
                            value={formData.person_birthday} 
                            onChange={handleChange} 
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:outline-none" 
                        />
                    </div>
                </div>
            </div>

            {/* SECTION 2: SCHOOL INFORMATION (Thông tin trường học) */}
            <div>
                <h3 className="text-lg font-semibold text-green-500 mb-4 flex items-center gap-2">
                    <GraduationCap size={18} /> School Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Grade (Class) *</label>
                        <input 
                            type="number" 
                            name="student_grade" 
                            value={formData.student_grade} 
                            onChange={handleChange} 
                            min="1" 
                            max="12" 
                            required 
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:outline-none" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Parent ID *</label>
                        <input 
                            type="number" 
                            name="student_parent_id" 
                            value={formData.student_parent_id} 
                            onChange={handleChange} 
                            placeholder="Enter Parent ID" 
                            required 
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:outline-none placeholder-gray-500" 
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter the ID of the registered parent.</p>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
                <button 
                    type="submit" 
                    disabled={loading} 
                    className="flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Saving..." : (
                        <>
                            <Save size={20} className="mr-2" /> Create Student
                        </>
                    )}
                </button>
            </div>
        </form>
      </div>
    </div>
  );

  return <Layout activeItem="student" onNavigate={handleNavigate}>{content}</Layout>;
}
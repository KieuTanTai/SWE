// src/app/students/view/[id]/page.tsx
"use client";

import { useEffect, useState, use } from "react"; // Next.js 15 uses 'use' for params
import { useRouter } from "next/navigation";
import { studentService } from "@/services/studentService";
import { ArrowLeft, Edit, ScanEye, User, GraduationCap } from "lucide-react"; // Dùng icon ScanEye
import Layout from "@/components/layout/Layout";

export default function ViewStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const studentId = Number(resolvedParams.id);

  const [loading, setLoading] = useState(true);
  
  // State lưu dữ liệu để hiển thị
  const [studentData, setStudentData] = useState({
    person_name: "",
    person_gender: false,
    person_birthday: Date.now(),
    // person_email: "", // Removed because not present in Person type
    student_grade: 0,
    student_parent_id: "",
  });

  const handleNavigate = (item: string) => {
    if (item === "dashboard") router.push("/");
    else if (item === "driver") router.push("/drivers");
    else if (item === "student") router.push("/students");
    else if (item === "tracking") router.push("/?tab=tracking");
  };

  // Load dữ liệu
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await studentService.getStudentById(studentId);
        setStudentData({
          person_name: data.person?.person_name || "N/A",
          person_gender: data.person?.person_gender || false,
          person_birthday: data.person?.person_birthday
            ? typeof data.person.person_birthday === "string"
              ? Date.parse(data.person.person_birthday)
              : data.person.person_birthday instanceof Date
                ? data.person.person_birthday.getTime()
                : Date.now()
            : Date.now(),
          // person_email: data.person?.person_email || "N/A", // Removed because not present in Person type
          student_grade: data.student_grade ?? 0,
          student_parent_id: data.student_parent_id ? data.student_parent_id.toString() : "N/A",
        });
      } catch (err) {
        console.error(err);
        alert("Student not found!");
        router.push("/students");
      } finally {
        setLoading(false);
      }
    };
    if (studentId) fetchStudent();
  }, [studentId, router]);

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
        {/* Header với icon ScanEye */}
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 border-b border-gray-700 pb-4">
          <ScanEye className="text-teal-400" size={28} /> 
          Student Details <span className="text-gray-500 text-lg font-normal">#{studentId}</span>
        </h1>

        {loading ? (
           <div className="text-center py-10 text-gray-400">Loading information...</div>
        ) : (
          <div className="space-y-8">
            
            {/* SECTION 1: PERSONAL DETAILS */}
            <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                    <User size={18} /> Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                        <div className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white">
                            {studentData.person_name}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Gender</label>
                        <div className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white">
                            {studentData.person_gender}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Date of Birth</label>
                        <div className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white">
                            {studentData.person_birthday}
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 2: SCHOOL INFORMATION */}
            <div>
                <h3 className="text-lg font-semibold text-green-500 mb-4 flex items-center gap-2">
                    <GraduationCap size={18} /> School Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Grade (Class)</label>
                        <div className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white">
                            Grade {studentData.student_grade}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Parent ID</label>
                        <div className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white">
                            {studentData.student_parent_id}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-6 border-t border-gray-700 flex justify-end gap-4">
                <button 
                    onClick={() => router.push(`/students/edit/${studentId}`)} 
                    className="flex items-center justify-center px-6 py-2.5 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-lg transition-all"
                >
                    <Edit size={18} className="mr-2" /> Edit This Student
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return <Layout activeItem="student" onNavigate={handleNavigate}>{content}</Layout>;
}
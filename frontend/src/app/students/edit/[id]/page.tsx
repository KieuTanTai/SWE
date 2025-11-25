// src/app/students/edit/[id]/page.tsx
"use client";

import { useEffect, useState, use } from "react"; // Next.js 15 uses 'use'
import { useRouter } from "next/navigation";
import { studentService } from "@/services/studentService";
import { ArrowLeft, Save, GraduationCap, User, AlertCircle } from "lucide-react";
import Layout from "@/components/layout/Layout";

export default function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  // Unwrap params (Chuẩn Next.js 15)
  const resolvedParams = use(params);
  const studentId = Number(resolvedParams.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    person_name: "", 
    student_grade: 0,
    student_parent_id: "",
  });

  const handleNavigate = (item: string) => {
    if (item === "dashboard") router.push("/");
    else if (item === "tracking") router.push("/tracking");
    else if (item === "driver") router.push("/drivers");
    else if (item === "student") router.push("/students");
  };

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await studentService.getStudentById(studentId);
        setFormData({
          person_name: data.person?.person_name || "", 
          student_grade: data.student_grade ?? 0,
          student_parent_id: data.student_parent_id ? data.student_parent_id.toString() : "",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const grade = parseInt(formData.student_grade.toString());
    if (isNaN(grade) || grade < 1 || grade > 12) {
      setError("Grade must be between 1 and 12.");
      setSaving(false);
      return;
    }

    if (!formData.person_name) {
        setError("Full Name is required.");
        setSaving(false);
        return;
    }

    try {
      const payload = {
        person_name: formData.person_name,
        student_grade: grade,
        student_parent_id: parseInt(formData.student_parent_id),
      };

      // --- SỬA LỖI 1: Xóa "as any" ---
      // Vì trong service ta đã định nghĩa hàm updateStudent nhận (id, data: any)
      // nên ta truyền thẳng object payload vào là được, không cần ép kiểu.
      await studentService.updateStudent(studentId, payload);
      
      alert("Update successful!");
      router.push("/students");
    // --- SỬA LỖI 2: Xóa ": any" ---
    // TypeScript cho phép bỏ qua kiểu trong catch, hoặc dùng unknown
    } catch (err) { 
      console.error(err);
      setError("Failed to update student. Please try again.");
    } finally {
      setSaving(false);
    }
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
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 border-b border-gray-700 pb-4">
          <GraduationCap className="text-blue-500"/> Edit Student <span className="text-gray-500 text-lg font-normal">#{studentId}</span>
        </h1>

        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-400 p-4 rounded mb-6 flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {loading ? (
           <div className="text-center py-10 text-gray-400">Loading student info...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Person Name */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-500" size={18} />
                    <input
                        type="text"
                        name="person_name"
                        value={formData.person_name}
                        onChange={handleChange}
                        className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Student Full Name"
                        required
                    />
                </div>
            </div>

            {/* Grade */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Grade <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="student_grade"
                value={formData.student_grade}
                onChange={handleChange}
                min="1"
                max="12"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Parent ID */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Parent ID <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="student_parent_id"
                value={formData.student_parent_id}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className={`
                  flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white transition-all
                  ${saving 
                    ? "bg-blue-800 cursor-wait" 
                    : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30"}
                `}
              >
                {saving ? "Saving..." : (
                  <>
                    <Save size={20} className="mr-2" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  return (
    <Layout activeItem="student" onNavigate={handleNavigate}>
      {content}
    </Layout>
  );
}
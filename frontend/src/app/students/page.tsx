// src/app/students/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { studentService } from "@/services/studentService";
import { Student } from "@/interfaces/student";
import { Trash2, Plus, Edit, User, Search, CheckCircle, XCircle, ScanEye } from "lucide-react";
import Layout from "@/components/layout/Layout";

// --- IMPORT SWEETALERT2 ---
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function StudentPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const handleNavigate = (item: string) => {
    if (item === "dashboard") router.push("/");
    else if (item === "tracking") router.push("/tracking"); // Hoặc /?tab=tracking
    else if (item === "driver") router.push("/drivers");
    else if (item === "schedule") router.push("/schedules");
    else if (item === "route") router.push("/routes");
  };

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await studentService.getAllStudents();
      if (Array.isArray(data)) {
        setStudents(data);
      } else {
        const response = data as unknown as { data: Student[] };
        setStudents(response.data || []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const showDeleteConfirm = async (title: string, text: string) => {
    return MySwal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, disable it!',
      background: '#1f2937',
      color: '#fff',
      iconColor: '#f87171'
    });
  };

  const handleDelete = async (id: number) => {
    const result = await showDeleteConfirm(
      'Disable Student?', 
      "This student will be marked as inactive."
    );

    if (result.isConfirmed) {
      try {
        await studentService.deleteStudent(id);
        
        MySwal.fire({
          title: 'Disabled!',
          text: 'Student has been marked as inactive.',
          icon: 'success',
          background: '#1f2937',
          color: '#fff',
          timer: 1500,
          showConfirmButton: false
        });
        
        fetchStudents(); 
      } catch (err) {
        MySwal.fire({ title: 'Error!', text: 'Failed to disable student.', icon: 'error', background: '#1f2937', color: '#fff' });
      }
    }
  };

  const formatId = (id: number | undefined) => {
    if (!id) return "#STU-???";
    return `#STU-${String(id).padStart(5, "0")}`;
  };

  const filteredStudents = students.filter((student) => {
    const term = searchTerm.toLowerCase();
    const name = student.person?.person_name?.toLowerCase() || "";
    const id = student.student_id?.toString() || "";
    return name.includes(term) || id.includes(term);
  });

  const content = (
    <div className="p-6 w-full text-gray-100">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Student Records</h1>
          <p className="text-gray-400 text-sm mt-1">Manage all student data and information</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
                <input
                type="text"
                placeholder="Search by Name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-64"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>

            <div className="flex gap-3">
                <Link 
                    href="/students/create" 
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap"
                >
                    <Plus size={18} /> 
                    Add Student
                </Link>
            </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading records...</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Student ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Grade</th> 
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Parent Info</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase" style={{ minWidth: '240px' }}>Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-700 bg-gray-800">
                {filteredStudents.length > 0 ? filteredStudents.map((student) => {
                  
                  // --- SỬA LOGIC STATUS Ở ĐÂY ---
                  const rawStatus = student.person?.person_life_cycle_status;
                  // Chỉ Active khi status = 1 hoặc true
                  const isActive = rawStatus === 1 || rawStatus === true;

                  return (
                    <tr key={student.student_id} className={`hover:bg-gray-750 transition-colors group ${!isActive ? 'opacity-50 bg-gray-900' : ''}`}>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {formatId(student.student_id)}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-blue-400 mr-3">
                            <User size={16} />
                          </div>
                          <div className="text-sm font-medium text-white">
                              {student.person?.person_name || "Unknown Name"}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                         <span className="bg-gray-700 px-2 py-1 rounded text-xs text-gray-300 border border-gray-600">
                            Grade {student.student_grade}
                         </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {(student.parent as any)?.person?.person_name || `ID: ${student.student_parent_id}`}
                      </td>

                      {/* CỘT STATUS */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isActive ? (
                            <span className="flex items-center gap-1 text-green-400 text-xs bg-green-900/20 px-2 py-1 rounded-full w-fit border border-green-800">
                                <CheckCircle size={12} /> Active
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-red-400 text-xs bg-red-900/20 px-2 py-1 rounded-full w-fit border border-red-800">
                                <XCircle size={12} /> Inactive
                            </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex justify-start items-center gap-3">
                          {isActive ? (
                            <>
                              <Link 
                                href={`/students/view/${student.student_id}`} 
                                className="flex items-center gap-1 px-2 py-1 rounded bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 transition-colors"
                              >
                                <ScanEye size={16} /> View
                              </Link>
                              <Link 
                                href={`/students/edit/${student.student_id}`} 
                                className="flex items-center gap-1 px-2 py-1 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                              >
                                <Edit size={16} /> Edit
                              </Link>
                              <button 
                                onClick={() => student.student_id && handleDelete(student.student_id)}
                                className="flex items-center gap-1 px-2 py-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                              >
                                <Trash2 size={16} /> Delete
                              </button>
                            </>
                          ) : (
                            <span className="text-gray-500 italic text-xs cursor-not-allowed px-2">Archived</span>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                }) : (
                    <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                            No students found matching &quot;{searchTerm}&quot;
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Layout activeItem="student" onNavigate={handleNavigate}>
      {content}
    </Layout>
  );
}
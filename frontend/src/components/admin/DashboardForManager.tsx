"use client";

import { Bus, Users, Route, Plus, Edit, Trash2 } from "lucide-react";

interface Student {
  id: string;
  name: string;
  bus: string;
  route: string;
}

export default function DashboardForManager() {
  const students: Student[] = [
    { id: "#STU-00123", name: "Johnathan Doe", bus: "B-42", route: "Maple Street Express" },
    { id: "#STU-00124", name: "Emily Smith", bus: "B-17", route: "Oak Avenue Line" },
  ];

  const stats = [
    { title: "Total Students", value: "1,250", icon: Users, color: "text-blue-500" },
    { title: "Total Buses", value: "84", icon: Bus, color: "text-green-500" },
    { title: "Active Routes", value: "45", icon: Route, color: "text-purple-500" },
  ];

  return (
    <div className="w-full h-full bg-gray-900 text-gray-100">
      {/* Dashboard cards */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.title}</p>
                    <h2 className="text-3xl font-bold mt-2">{stat.value}</h2>
                  </div>
                  <Icon className={`w-12 h-12 ${stat.color}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Student Table */}
        <div className="bg-gray-800 rounded-lg shadow-lg">
          <div className="flex justify-between items-center p-6 border-b border-gray-700">
            <h5 className="text-xl font-semibold">Student Records</h5>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                <Plus className="w-4 h-4" />
                Create New Route
              </button>
              <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                <Plus className="w-4 h-4" />
                Add New Student
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Bus No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {students.map((student, index) => (
                  <tr key={index} className="hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{student.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{student.bus}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{student.route}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors">
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors">
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

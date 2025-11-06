import React, { useState } from 'react';
import "./components/layout/Layout.css";

import Layout from './components/layout/Layout';

import { Users } from 'lucide-react';

const DashboardPage: React.FC = () => (
    <div>
        {/* Tạm thời dùng class Tailwind cho nội dung trang */}
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Welcome to SSB 1.0</p>
    </div>
);

const StudentManagementPage: React.FC = () => (
    <div>
        {/* Header của trang */}
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Student Management</h1>
                <p className="text-gray-400">Manage and track all students in the system</p>
            </div>
            <button className="bg-blue-500 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2">
                <Users size={18} />
                Add Student
            </button>
        </div>

        {/* Box nội dung chính */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-xl min-h-[400px]">
            <p className="text-gray-300">
                Nội dung quản lý học sinh (Filters, Table...) sẽ ở đây.
            </p>
        </div>
    </div>
);

const DriverManagementPage: React.FC = () => (
    <div>
        <h1 className="text-3xl font-bold text-white">Driver Management</h1>
        <p className="text-gray-400">Manage all drivers.</p>
    </div>
);
const ScheduleManagementPage: React.FC = () => (
    <div>
        <h1 className="text-3xl font-bold text-white">Schedule Management</h1>
        <p className="text-gray-400">Manage all schedules.</p>
    </div>
);
const RouteManagementPage: React.FC = () => (
    <div>
        <h1 className="text-3xl font-bold text-white">Route Management</h1>
        <p className="text-gray-400">Manage all routes.</p>
    </div>
);

//-------------------------------------------------
// COMPONENT APP (GỐC) - Giữ nguyên logic này
//-------------------------------------------------
export default function App() {
    const [currentPage, setCurrentPage] = useState('student'); // Active 'student'

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <DashboardPage />;
            case 'student':
                return <StudentManagementPage />;
            case 'driver':
                return <DriverManagementPage />;
            case 'schedule':
                return <ScheduleManagementPage />;
            case 'route':
                return <RouteManagementPage />;
            default:
                return <DashboardPage />;
        }
    };

    return (
        <>
            {/* Component Layout này sẽ load phiên bản CSS thuần */}
            <Layout activeItem={currentPage} onNavigate={setCurrentPage}>
                {renderPage()}
            </Layout>
        </>
    );
}
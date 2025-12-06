import TodaySchedule from './TodaySchedule';
import BusStatusCard from './BusStatusCard';
import { Student } from '../../interfaces/student';
import { BusRoute, PickupSchedule } from '@/interfaces';

interface ParentDashboardProps {
  student?: Student;
  busRoute?: BusRoute;
  todaySchedule?: PickupSchedule;
}

export default function ParentDashboard({ student, busRoute, todaySchedule }: ParentDashboardProps) {

  return (
    <div className=" max-w-6xl mx-auto">
      {/* Student Info Card */}
      <div className="flex flex-row items-center gap-4 mb-6
      bg-gray-900 shadow-lg p-4">
        <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl font-bold flex-shrink-0">
          ?
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold truncate">{student?.student_id}</h2>
          <p className="text-gray-400 text-sm">Grade {student?.student_grade}</p>
          <p className="text-xs text-gray-500">Student ID: {student?.student_id}</p>          </div>
      </div>

      {/* Bus Status Card */}
      <BusStatusCard studentId={student?.student_id} />   

      {/* Today's Schedule */}
      <TodaySchedule studentId={student?.student_id} />
    </div>
  );
}

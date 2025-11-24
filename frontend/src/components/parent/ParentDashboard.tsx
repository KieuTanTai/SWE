import React, { useEffect, useState } from 'react';
import ContentCard from '../ContentCard';
import TodaySchedule from './TodaySchedule';
import BusStatusCard from './BusStatusCard';
import { Student } from '../../interfaces/student';

interface ParentDashboardProps {
  studentId?: number;
}

export default function ParentDashboard({ studentId }: ParentDashboardProps) {
  const [student, setStudent] = useState<Student | null>(null);

  // create fallback ID
  const studentId_val = studentId || 5;

  useEffect(() => {
    setStudent({
      student_id: studentId_val,
      student_parent_id: 1,
      student_person_id: 1,
      student_grade: 5,
    });
  }, [studentId]);

  return (
    <div className=" max-w-6xl mx-auto">
      {/* Student Info Card */}
      <div className="flex flex-row items-center gap-4 mb-6
      bg-gray-900 shadow-lg p-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl font-bold flex-shrink-0">
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

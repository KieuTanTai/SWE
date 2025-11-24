"use client";
import React, { ReactElement, useEffect, useState } from 'react';
import { ArrowDownFromLine, ArrowUpFromLine, Clock, MapPin } from 'lucide-react';
import ContentCard from '../ContentCard';

/**
 * Schedule Item Interface
 */
interface ScheduleItem {
  id: number;
  type: 'pickup' | 'dropoff';
  label: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  time: string;
  location: string;
}

/**
 * TodaySchedule Component
 * Displays today's pickup and dropoff schedule for a student
 */
const TodaySchedule: React.FC<{ studentId?: number }> = ({ studentId }) => {
  const [todaySchedule, setTodaySchedule] = useState<ScheduleItem[]>([]);

  /**
   * Fetch today's schedule from API
   */
  useEffect(() => {
        setTodaySchedule([
          {
            id: 1,
            type: 'pickup',
            label: 'Morning Pickup',
            status: 'Scheduled',
            time: '07:00 AM',
            location: '123 Nguyen Van Linh St.'
          },
          {
            id: 2,
            type: 'dropoff',
            label: 'Afternoon Dropoff',
            status: 'Scheduled',
            time: '04:30 PM',
            location: '123 Nguyen Van Linh St.'
          }
        ]);
  }, [studentId]);

  /**
   * Get status badge color based on status
   */
  const getStatusBadgeColor = (status: string): string => {
    const statusColors: Record<string, string> = {
      'Scheduled': 'bg-blue-500/20 text-blue-400',
      'In Progress': 'bg-yellow-500/20 text-yellow-400',
      'Completed': 'bg-green-500/20 text-green-400',
      'Cancelled': 'bg-red-500/20 text-red-400'
    };
    return statusColors[status] || 'bg-blue-500/20 text-blue-400';
  };

  /**
   * Get icon based on schedule type
   */
  const getTypeIcon = (type: 'pickup' | 'dropoff'): ReactElement => {
    return type === 'pickup' ? <ArrowUpFromLine /> : <ArrowDownFromLine />;
  };

  if (todaySchedule.length === 0) {
    return (
      <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
        <h3 className="text-xl font-semibold mb-6">Today's Schedule</h3>
        <div className="text-center py-8">
          <p className="text-gray-400">No schedule for today</p>
        </div>
      </div>
    );
  }

  return (
    <ContentCard title="Today's Schedule" 
    className="bg-slate-900 rounded-lg p-6 border border-slate-800"
    >
      <div className="space-y-4">
        {todaySchedule.map(item => (
          <div
            key={item.id}
            className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
          >
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">{getTypeIcon(item.type)}</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center justify-between mb-2 gap-2">
                <h4 className="font-semibold text-white truncate">{item.label}</h4>
                <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${getStatusBadgeColor(item.status)}`}>
                  {item.status}
                </span>
              </div>

              {/* Details */}
              <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span>{item.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ContentCard>
  );
};

export default TodaySchedule;
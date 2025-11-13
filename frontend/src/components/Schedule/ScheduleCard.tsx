
import React from "react";
import { Clock, Bus, User } from 'lucide-react';
import { formatTime } from "@/utils/dateUtils";

export interface DetailSchedule {
  detail_schedule_id: number;
  busRoute?: {
    route_name: string;
    driver_name: string;
  };
  timeRole?: {
    start_time: string;
    end_time: string;
  };
}

interface ScheduleCardProps {
  schedule: DetailSchedule;
  className?: string;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ schedule, className = '' }) => {
  const { busRoute, timeRole } = schedule;
  const startTime = formatTime(timeRole?.start_time);
  const endTime = formatTime(timeRole?.end_time);
  
  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-blue-100">
          <Bus className="w-5 h-5 text-blue-600" />
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <h3 className="text-gray-900 font-semibold mb-2">
            {busRoute?.route_name || 'Bus Route'}
          </h3>
          
          {/* Time Range */}
          {timeRole && (
            <div className="flex items-center gap-2 text-gray-700 mb-1.5">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">
                {startTime} - {endTime}
              </span>
            </div>
          )}
          
          {/* Driver Name */}
          {busRoute?.driver_name && (
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{busRoute.driver_name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;
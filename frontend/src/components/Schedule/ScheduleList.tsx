"use client";

import React, { useState } from 'react';
import { ChevronLeft, Calendar, Clock, Bus, User } from 'lucide-react';
import { formatTime } from '@/utils/dateUtils';
import RequestAbsenceForm from './RequestAbsenceForm';
import ContentCard from '../ContentCard';


interface DetailSchedule {
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

const ScheduleCard: React.FC<{ schedule: DetailSchedule; className?: string }> = ({ 
  schedule, 
  className = '' 
}) => {
  const { busRoute, timeRole } = schedule;
  const startTime = formatTime(timeRole?.start_time);
  const endTime = formatTime(timeRole?.end_time);
  
  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-blue-100">
          <Bus className="w-5 h-5 text-blue-600" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-gray-900 font-semibold mb-2">
            {busRoute?.route_name || 'Bus Route'}
          </h3>
          
          {timeRole && (
            <div className="flex items-center gap-2 text-gray-700 mb-1.5">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">
                {startTime} - {endTime}
              </span>
            </div>
          )}
          
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

const ScheduleList = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [reason, setReason] = useState('');

  const scheduleData = [
    {
      day: 'Wed',
      fullDay: 'Wednesday',
      schedules: [
        {
          detail_schedule_id: 1,
          busRoute: {
            route_name: 'Route A - District 7',
            driver_name: 'Nguyen Van A'
          },
          timeRole: {
            start_time: '07:00:00',
            end_time: '07:30:00'
          }
        },
        {
          detail_schedule_id: 2,
          busRoute: {
            route_name: 'Route A - District 7',
            driver_name: 'Nguyen Van A'
          },
          timeRole: {
            start_time: '16:30:00',
            end_time: '17:00:00'
          }
        }
      ]
    },
    {
      day: 'Thu',
      fullDay: 'Thursday',
      schedules: [
        {
          detail_schedule_id: 3,
          busRoute: {
            route_name: 'Route A - District 7',
            driver_name: 'Nguyen Van A'
          },
          timeRole: {
            start_time: '07:00:00',
            end_time: '07:30:00'
          }
        },
        {
          detail_schedule_id: 4,
          busRoute: {
            route_name: 'Route A - District 7',
            driver_name: 'Nguyen Van A'
          },
          timeRole: {
            start_time: '16:30:00',
            end_time: '17:00:00'
          }
        }
      ]
    },
    {
      day: 'Fri',
      fullDay: 'Friday',
      schedules: [
        {
          detail_schedule_id: 5,
          busRoute: {
            route_name: 'Route B - District 1',
            driver_name: 'Tran Van B'
          },
          timeRole: {
            start_time: '07:15:00',
            end_time: '07:45:00'
          }
        },
        {
          detail_schedule_id: 6,
          busRoute: {
            route_name: 'Route B - District 1',
            driver_name: 'Tran Van B'
          },
          timeRole: {
            start_time: '16:45:00',
            end_time: '17:15:00'
          }
        }
      ]
    }
  ];

  return (
      <div className="max-w-3xl mx-auto">
        {/* Schedule List */}
        <ContentCard title="Weekly Schedule">
          {scheduleData.map((day, index) => (
            <div key={index} className="space-y-1">
              {/* Day Header */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center justify-center w-12 h-8 bg-blue-600 text-white rounded-lg font-semibold shadow-sm">
                  <span className="text-xs">{day.day}</span>
                </div>
                <h2 className="text-lg font-bold text-gray-700">{day.fullDay}</h2>
              </div>

              {/* Schedule Cards */}
              <div className="space-y-1 ml-15">
                {day.schedules.map((schedule) => (
                  <ScheduleCard
                    key={schedule.detail_schedule_id}
                    schedule={schedule}
                  />
                ))}
              </div>
            </div>
          ))}
        </ContentCard>
        <RequestAbsenceForm />
      </div>
)};

export default ScheduleList;
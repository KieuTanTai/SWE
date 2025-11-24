"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Calendar, Clock, Bus, User } from 'lucide-react';
import { formatTime } from '@/utils/dateUtils';
import RequestAbsenceForm from './RequestAbsenceForm';
import ContentCard from '../ContentCard';
import ScheduleCard from './ScheduleCard';


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

const ScheduleList = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {}, []);
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
      <div className="w-full h-full bg-gray-900 text-gray-100">
        {/* Schedule List */}
        <ContentCard title="Weekly Schedule" >
          {scheduleData.map((day, index) => (
            <div key={index} className="space-y-1">
              {/* Day Header */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center justify-center w-12 h-8 bg-blue-600 text-white rounded-lg font-semibold shadow-sm">
                  <span className="text-xs">{day.day}</span>
                </div>
                <h2 className="text-lg font-bold text-gray-400">{day.fullDay}</h2>
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
      </div>
)};

export default ScheduleList;
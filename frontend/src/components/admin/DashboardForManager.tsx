"use client";
import React from "react";
import { Users, Bus, MapPin, LayoutDashboard, AlertCircle, Sun, Wrench, Calendar } from "lucide-react";
import AlertButton from "../AlertButton";

interface Stat {
  label: string;
  value: number;
  icon: React.ReactElement;
}

interface QuickInfoCard {
  title: string;
  desc: string;
  icon: React.ReactElement;
}

export default function Dashboard(): React.ReactElement {
  const handleSendAlert = (recipient: string, message: string) => {
    console.log(`Sending alert to ${recipient}: ${message}`);
    alert(`Alert sent to ${recipient}: ${message}`);
    // TODO: Implement API call to send alert
  };

  // Mock data UI
  const stats: Stat[] = [
    { label: "Tổng số học sinh", value: 1250, icon: <Users size={32} className="text-blue-500" /> },
    { label: "Tổng số tài xế", value: 85, icon: <LayoutDashboard size={32} className="text-green-500" /> },
    { label: "Tổng số xe bus", value: 42, icon: <Bus size={32} className="text-yellow-500" /> },
    { label: "Tổng số tuyến đường", value: 28, icon: <MapPin size={32} className="text-red-500" /> },
  ];

  const quickInfoCards: QuickInfoCard[] = [
    { title: "Tình trạng xe", desc: "Tất cả xe bus đang hoạt động bình thường.", icon: <Bus size={24} className="text-green-500" /> },
    { title: "Thời tiết hôm nay", desc: "Trời nắng nhẹ, phù hợp cho lịch trình đưa đón.", icon: <Sun size={24} className="text-yellow-500" /> },
    { title: "Thông tin bảo trì", desc: "3 xe bus sẽ bảo trì vào cuối tuần.", icon: <Wrench size={24} className="text-blue-500" /> },
    { title: "Sự kiện sắp tới", desc: "Họp phụ huynh vào ngày 10/12.", icon: <Calendar size={24} className="text-purple-500" /> },
  ];

  return (
    <div className="py-4 px-6">
      {/* TITLE */}
      <h2 className="font-bold text-2xl mb-4">Dashboard</h2>

      {/* STATISTICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {stats.map((item: Stat, index: number) => (
          <div key={index} className="bg-black rounded-lg shadow flex flex-col items-center p-4">
            {item.icon}
            <h6 className="text-gray-500 mt-2">{item.label}</h6>
            <h2 className="font-bold text-xl mt-1">{item.value}</h2>
          </div>
        ))}
      </div>

      {/* IMPORTANT ANNOUNCEMENT */}
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 shadow flex items-center mb-4">
        <AlertCircle size={24} className="mr-2 text-red-500" />
        <span className="font-bold mr-2">Thông báo quan trọng:</span>
        Tuyến đường SSB System sẽ thay đổi lịch trình trong tuần này do nâng cấp đường.
      </div>

      {/* GENERAL INFORMATION CARDS */}
      <h5 className="font-bold text-lg mt-4 mb-3">Thông tin chung</h5>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {quickInfoCards.map((info: QuickInfoCard, index: number) => (
          <div key={index} className="bg-black rounded-lg shadow p-4 flex items-center">
            {info.icon}
            <div className="ml-3">
              <div className="font-bold">{info.title}</div>
              <div className="text-gray-600">{info.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ALERT BUTTONS - Fixed position at bottom right */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        <AlertButton
          type="parent"
          onSendAlert={(message) => handleSendAlert('parent', message)}
          id="parent-alert"
        />
        <AlertButton
          type="driver"
          onSendAlert={(message) => handleSendAlert('driver', message)}
          id="driver-alert"
        />
      </div>
    </div>
  );
}

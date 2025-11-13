"use client";

import React from "react";
import Sidebar, { SidebarItem } from "./Sidebar";
import { Home, Bell, Settings, LogOut, User, Map, Calendar } from "lucide-react";

const items: SidebarItem[] = [
  { label: "Home", icon: Home, path: "/parent" },
  { label: "Map", icon: Map, path: "/parent/map" },
  { label: "Schedule", icon: Calendar, path: "/parent/schedule" },
  { label: "Notifications", icon: Bell, path: "/parent/notifications" },
  { label: "Profile", icon: User, path: "/parent/profile" },
];

const ParentLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar title="Phụ huynh" items={items} />

      {/* Main content */}
      <main className="flex-1 md:ml-64 p-6 pb-20 md:pb-6 transition-all">
        {children}
      </main>
    </div>
  );
};

export default ParentLayout;

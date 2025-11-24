"use client";
import Maps from "@/components/maps/ggmaps";
import Layout from "@/components/layout/Layout";
import { Home, User, Bell, Calendar, Map } from "lucide-react";
import { useState } from "react";
import ParentDashboard from "@/components/parent/ParentDashboard";
import SchedulePage from "@/components/Schedule/SchedulePage";


const navItems = [
  { id: "dashboard", text: "Home", icon: Home },
  { id: "map", text: "Map", icon: Map },
  { id: "schedule", text: "Schedule", icon: Calendar },
  { id: "notifications", text: "Notifications", icon: Bell },
  { id: "profile", text: "Profile", icon: User },
];

export default function ParentPage() {
  const [activeItem, setActiveItem] = useState("dashboard");
  
    const handleNavigate = (item: string) => {
      setActiveItem(item);
    };

  const renderContent = () => {
      switch (activeItem) {
        case "dashboard":
          return <ParentDashboard />;
        case "tracking":
          return <Maps />;
        case "schedule":
          return <SchedulePage />;
        default:
          return (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
                <p className="text-gray-400">This section is under development</p>
              </div>
            </div>
          );
      }
    };
  return (
    <Layout
          activeItem={activeItem}
          onNavigate={handleNavigate}
          navItems={navItems}
        >
          {renderContent()}
        </Layout>
  );
}

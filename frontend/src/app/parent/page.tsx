"use client";
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import ParentDashboard from "@/components/parent/ParentDashboard";
import SchedulePage from "@/components/Schedule/SchedulePage";
import { LayoutDashboard, Navigation, User, Calendar, Bell } from "lucide-react";
import { Student } from "@/interfaces";

const navItems = [
      { id: 'dashboard', text: 'Dashboard', icon: LayoutDashboard },
      { id: 'tracking', text: 'Live Tracking', icon: Navigation },
      { id: 'schedule', text: 'Schedule', icon: Calendar },
      { id: 'notifications', text: 'Notifications', icon: Bell },
      { id: 'profile', text: 'Profile', icon: User },
  ];

export default function ParentPage() {
  const student : Student = {
  student_id: 1,
  student_grade: 5,
  student_parent_id: 10,
  student_person_id: 10,
  person: {
    person_id: 5,
    person_account_id: 5,
    person_phone: '0123456789',
    person_name: 'John Doe',
    person_gender: true, // true = male, false = female
    person_birthday: new Date('2010-01-01'),
    person_type: "student",
    person_life_cycle_status: true
  }
};
  const [activeItem, setActiveItem] = useState("dashboard");

  const handleNavigate = (item: string) => {
    setActiveItem(item);
  };

  const renderContent = () => {
    switch (activeItem) {
      case "dashboard":
        return <ParentDashboard student={student} />;
      // case "tracking":
      //   return <Maps />;
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

"use client";
import { useState } from "react";
import Layout from "../components/layout/Layout";
import Maps from "../components/maps/ggmaps";
import DashboardForManager from "../components/admin/DashboardForManager";

export default function HomePage() {
  const [activeItem, setActiveItem] = useState("dashboard");

  const handleNavigate = (item: string) => {
    setActiveItem(item);
  };

  const renderContent = () => {
    switch (activeItem) {
      case "dashboard":
        return <DashboardForManager />;
      case "tracking":
        return <Maps />;
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
    >
      {renderContent()}
    </Layout>
  );
}
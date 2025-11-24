"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Đảm bảo đã import useRouter
import Layout from "../components/layout/Layout";
import Maps from "../components/maps/ggmaps";
import DashboardForManager from "../components/admin/DashboardForManager";

export default function HomePage() {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState("dashboard");

  const handleNavigate = (item: string) => {
    // 1. Nếu bấm vào Student -> Chuyển trang
    if (item === 'student') {
      router.push('/students');
    } 
    // 2. THÊM DÒNG NÀY: Nếu bấm vào Driver -> Chuyển sang trang /drivers
    else if (item === 'driver') {
      router.push('/drivers');
    }
    // 3. Các mục Dashboard/Tracking thì đổi state để hiển thị ngay tại đây
    else {
      setActiveItem(item);
    }
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
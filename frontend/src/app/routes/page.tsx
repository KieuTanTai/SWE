"use client";
import Layout from "@/components/layout/Layout";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoutePage() {
  const [activeItem, setActiveItem] = useState("route");
  const router = useRouter();

  const handleNavigate = (item: string) => {
    if (item === "route") return;
    if (item === "dashboard") router.push("/");
    else if (item === "student") router.push("/students");
    else if (item === "driver") router.push("/drivers");
    else if (item === "tracking") router.push("/tracking");
    else if (item === "schedule") router.push("/schedules");
    else router.push("/");
  };

  return (
    <Layout activeItem={activeItem} onNavigate={handleNavigate}>
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Route Management</h2>
          <p className="text-gray-400">This section is under development</p>
        </div>
      </div>
    </Layout>
  );
}

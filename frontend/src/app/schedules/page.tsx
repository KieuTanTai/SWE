"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Layout from "../../components/layout/Layout";
import Schedules from "../../components/Schedule/SchedulePage";

export default function SchedulesPage() {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState("schedule");

  const handleNavigate = (item: string) => {
    if (item === "dashboard") router.push("/");
    else if (item === "tracking") router.push("/tracking");
    else if (item === "student") router.push("/students");
    else if (item === "driver") router.push("/drivers");
    else if (item === "schedule") setActiveItem("schedule");
    else if (item === "route") router.push("/routes");
    else setActiveItem(item);
  };

  return (
    <Layout activeItem={activeItem} onNavigate={handleNavigate}>
      <Schedules />
    </Layout>
  );
}

"use client";
import { useState } from "react";
import Layout from "../../components/layout/Layout";
import Schedules from "../../components/Schedule/SchedulePage";

export default function SchedulesPage() {
  const [activeItem, setActiveItem] = useState("schedules");

  const handleNavigate = (item: string) => {
    setActiveItem(item);
  };

  return (
    <Layout activeItem={activeItem} onNavigate={handleNavigate}>
      <Schedules />
    </Layout>
  );
}

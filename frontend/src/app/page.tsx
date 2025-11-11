"use client";
import { useState } from "react";
import Layout from "../components/layout/Layout";
import Maps from "../components/maps/ggmaps";

export default function HomePage() {
  const [activeItem, setActiveItem] = useState("dashboard");

  const handleNavigate = (item: string) => {
    setActiveItem(item);
  };

  return (
    <Layout
      activeItem={activeItem}
      onNavigate={handleNavigate}
    >
      <Maps />
    </Layout>
  );
}
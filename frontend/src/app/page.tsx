"use client";

import { useState } from "react"; // Xóa useMemo
import Layout from "../components/layout/Layout";
import "../components/layout/Layout.css";

// XÓA DỮ LIỆU GIẢ (DEMO DATA)

export default function HomePage() {
  const [activeItem, setActiveItem] = useState("dashboard");

  // XÓA STATE searchTerm

  const handleNavigate = (item: string) => {
    setActiveItem(item);
  };

  // XÓA LOGIC LỌC (filteredResults)

  return (
    // XÓA PROPS TÌM KIẾM KHỎI LAYOUT
    <Layout
      activeItem={activeItem}
      onNavigate={handleNavigate}
    >

      {/* QUAY LẠI HIỂN THỊ NỘI DUNG TRANG BÌNH THƯỜNG */}
      <>
        {/* <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Bạn đang ở mục: <strong>{activeItem}</strong>
        </p>
        <div className="content-box">
          Đây là nội dung chính của trang.
        </div> */}
      </>

    </Layout>
  );
}
"use client";

import React, { useState } from "react";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface SidebarItem {
  label: string;
  icon?: LucideIcon;
  path: string;
}

interface SidebarProps {
  title?: string;
  items: SidebarItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ title = "Parent Portal", items }) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* --- Sidebar cho màn hình lớn --- */}
      <aside
        className={`
          hidden md:flex
          bg-blue-800 text-white h-screen w-64 flex-col justify-between 
          fixed top-0 left-0 z-50 transition-all duration-300
        `}
      >\

        {/* Danh sách menu */}
        <nav className="flex-1 mt-8 px-4 space-y-2 overflow-y-auto">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.path}
                className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-blue-700 transition"
              >
                {Icon && <Icon size={20} />}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 text-xs text-gray-300 border-t border-blue-700 text-center">
          © 2025 Parent Portal
        </div>
      </aside>

      {/* --- Thanh dưới cho mobile --- */}
      <nav
        className="
          fixed bottom-0 left-0 right-0 z-50 bg-blue-800 text-white 
          flex justify-around items-center h-16 md:hidden shadow-lg
        "
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.label}
              href={item.path}
              className={`flex flex-col items-center justify-center hover:text-blue-300 text-xs
              ${isActive ? "bg-blue-700 font-semibold" : "hover:bg-blue-700"}`}
            >
              {Icon && <Icon size={20} />}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default Sidebar;

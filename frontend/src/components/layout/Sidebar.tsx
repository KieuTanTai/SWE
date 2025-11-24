'use client';

import {
    LayoutDashboard,
    Users,
    Bus,
    Clock,
    MapPin,
    Navigation,
} from 'lucide-react';

export interface SidebarProps {
    activeItem: string;
    onNavigate: (item: string) => void;
    navItems: {
        id: string;
        text: string;
        icon: React.ComponentType<{ size?: number; className?: string }>;
    }[];
}

export default function Sidebar({ activeItem, onNavigate, navItems }: SidebarProps) {
    return (
        <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-xl">
            {/* Logo */}
            <div className="px-6 py-8 border-b border-gray-800">
                <h1 className="text-2xl font-bold text-blue-400">SSB 1.0</h1>
            </div>

            {/* Danh sách điều hướng */}
            <nav className="flex-1 py-4">
                <ul className="space-y-2 px-3">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeItem === item.id;

                        return (
                            <li
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
                                    transition-all duration-200
                                    ${isActive
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }
                                `}
                            >
                                <Icon size={20} className="flex-shrink-0" />
                                <span className="font-medium">{item.text}</span>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}
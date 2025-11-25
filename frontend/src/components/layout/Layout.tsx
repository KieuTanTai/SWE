
import Header from './Header';
import Sidebar from './Sidebar';
import { LayoutDashboard, Navigation, Users, Bus, Clock, MapPin } from "lucide-react";

export const navItems = [
    { id: 'dashboard', text: 'Dashboard', icon: LayoutDashboard },
    { id: 'tracking', text: 'Live Tracking', icon: Navigation },
    { id: 'student', text: 'Student Management', icon: Users },
    { id: 'driver', text: 'Driver Management', icon: Bus },
    { id: 'schedule', text: 'Schedule Management', icon: Clock },
    { id: 'route', text: 'Route Management', icon: MapPin },
];

interface LayoutProps {
    children: React.ReactNode;
    activeItem: string;
    onNavigate: (item: string) => void;
    navItems?: {
        id: string;
        text: string;
        icon: React.ComponentType<{ size?: number; className?: string }>;
    }[];
}

export default function Layout({
    children,
    activeItem,
    onNavigate,
    navItems,
}: LayoutProps) {
    const items = navItems ?? navItemsDefault;
    return (
        <div className="flex h-screen bg-gray-900 overflow-hidden">
            {/* Sidebar cố định */}
            <Sidebar activeItem={activeItem} onNavigate={onNavigate} navItems={items} />

            {/* Khu vực nội dung chính */}
            <div className="flex-1 flex flex-col overflow-hidden ml-2">
                <Header />

                {/* Nội dung trang (cuộn được) */}
                <main className="flex-1 overflow-y-auto p-6  w-full bg-gray-800 text-gray-100">
                    {children}
                </main>
            </div>
        </div>
    );
}

const navItemsDefault = navItems;
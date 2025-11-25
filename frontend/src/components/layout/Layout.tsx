"use client";

import Header from './Header';
import Sidebar from './Sidebar';
import { LayoutDashboard, Navigation, Users, Bus, Clock, MapPin, Users2 } from "lucide-react";
import { useAccount } from "../../contexts/AccountContext"; // Import AccountContext
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Corrected import for useRouter

export const navItems = [
    { id: 'dashboard', text: 'Dashboard', icon: LayoutDashboard },
    { id: 'tracking', text: 'Live Tracking', icon: Navigation },
    { id: 'student', text: 'Student Management', icon: Users },
    { id: 'driver', text: 'Driver Management', icon: Bus },
    { id: 'schedule', text: 'Schedule Management', icon: Clock },
    { id: 'route', text: 'Route Management', icon: MapPin },
    { id: 'pickups', text: 'Pickup Management', icon: Users2 },
];

interface NavigationItem {
    id: string;
    text: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
}

const navItemsDefault: NavigationItem[] = navItems; // Đảm bảo `navItemsDefault` được định nghĩa đúng cách

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
    const { account } = useAccount();
    const router = useRouter(); // Moved inside the component

    useEffect(() => {
        if (!account || !account.account_email) {
            router.push("/");
        } else {
            const roleIds = account.roles?.map((role) => role.role_id) || [];
            if (roleIds.includes(4) || roleIds.includes(5) || roleIds.includes(6)) {
                router.push("/tracking");
            }
        }
        // No return statement needed for useEffect
    }, [account, router]);

    const filteredNavItems = (navItems ?? navItemsDefault).filter((item: NavigationItem) => {
        const roleIds = account?.roles?.map((role) => role.role_id) || [];

        if (!account || !account.account_email) {
            return false;
        }

        if (roleIds.includes(4)) {
            return item.id === "tracking";
        } else if (roleIds.includes(5)) {
            return ["tracking", "schedule", "pickups"].includes(item.id);
        } else if (roleIds.includes(6)) {
            return item.id === "tracking";
        }
        return true;
    });

    return (
        <div className="flex h-screen bg-gray-900 overflow-hidden">
            <Sidebar activeItem={activeItem} onNavigate={onNavigate} navItems={filteredNavItems} />

            <div className="flex-1 flex flex-col overflow-hidden ml-2">
                <Header />

                <main className="flex-1 overflow-y-auto p-6 w-full bg-gray-800 text-gray-100">
                    {children}
                </main>
            </div>
        </div>
    );
}
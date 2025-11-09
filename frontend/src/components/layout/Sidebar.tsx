import React from 'react';
import {
    LayoutDashboard,
    Users,
    Bus,
    Clock,
    MapPin,
} from 'lucide-react';

interface SidebarProps {
    activeItem: string;
    onNavigate: (item: string) => void;
}

const navItems = [
    { id: 'dashboard', text: 'Dashboard', icon: LayoutDashboard },
    { id: 'student', text: 'Student Management', icon: Users },
    { id: 'driver', text: 'Driver Management', icon: Bus },
    { id: 'schedule', text: 'Schedule Management', icon: Clock },
    { id: 'route', text: 'Route Management', icon: MapPin },
];

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onNavigate }) => {
    return (
        <aside className="sidebar-container">
            {/* Logo */}
            <div className="sidebar-logo-container">
                <span className="sidebar-logo">SSB 1.0</span>
            </div>

            {/* Danh sách điều hướng */}
            <nav>
                <ul className="sidebar-nav">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeItem === item.id;

                        // Sử dụng logic để thêm class 'active'
                        const itemClassName = `nav-item ${isActive ? 'active' : ''}`;

                        return (
                            <li
                                key={item.id}
                                className={itemClassName}
                                onClick={() => onNavigate(item.id)}
                            >
                                <Icon size={20} className="nav-icon" />
                                <span className="nav-text">{item.text}</span>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
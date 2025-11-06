import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
// import './Layout.css'; 

interface LayoutProps {
    children: React.ReactNode;
    activeItem: string;
    onNavigate: (item: string) => void;
}

const Layout: React.FC<LayoutProps> = ({
    children,
    activeItem,
    onNavigate,
}) => {
    return (
        <div className="layout-container">
            {/* Sidebar cố định */}
            <Sidebar activeItem={activeItem} onNavigate={onNavigate} />

            {/* Khu vực nội dung chính */}
            <div className="main-content">

                <Header />

                {/* Nội dung trang (cuộn được) */}
                <main className="page-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
    activeItem: string;
    onNavigate: (item: string) => void;
}

export default function Layout({
    children,
    activeItem,
    onNavigate,
}: LayoutProps) {
    return (
        <div className="flex h-screen bg-gray-900 overflow-hidden">
            {/* Sidebar cố định */}
            <Sidebar activeItem={activeItem} onNavigate={onNavigate} />

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
import { Bell, UserCircle } from 'lucide-react';

export default function Header() {
    return (
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-end shadow-sm">
            {/* Các biểu tượng bên phải */}
            <div className="flex items-center gap-4">
                <button id='message-btn' className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
                    <Bell size={24} className="text-gray-300" />
                </button>
                <button id='account-btn' className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
                    <UserCircle size={24} className="text-gray-300" />
                </button>
            </div>
        </header>
    );
}
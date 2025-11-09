import React from 'react';
import { Bell, UserCircle } from 'lucide-react';

const Header: React.FC = () => {
    return (
        <header className="header-container" style={{ justifyContent: 'flex-end' }}>
            {/* Các biểu tượng bên phải */}
            <div className="header-icons">
                <button className="icon-button">
                    <Bell size={25} />
                </button>
                <button className="icon-button">
                    <UserCircle size={25} />
                </button>
            </div>
        </header>
    );
};

export default Header;
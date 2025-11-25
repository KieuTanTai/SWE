import { Bell, UserCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useMessageModalProvider } from '@/hooks/useMessageModalContext';
import LoginModal from '@/modal/components/account/LoginModal';
import SignupModal from '@/modal/components/account/SignupModal';
import { Account } from '@/interfaces';

export default function Header() {
    const [showMenu, setShowMenu] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [account, setAccount] = useState<Account | null>(null);

    // Lấy account từ localStorage khi mount
    useEffect(() => {
        const stored = localStorage.getItem("account");
        if (stored) setAccount(JSON.parse(stored));
    }, []);

    // Helper chuyển modal
    const openLogin = () => {
        setShowSignup(false);
        setShowLogin(true);
    };
    const openSignup = () => {
        setShowLogin(false);
        setShowSignup(true);
    };
    const { showMessage } = useMessageModalProvider();
    const handleLoginSuccess = (account: Account) => {
        showMessage("Đăng nhập thành công!", "success");
        setShowLogin(false);
        setAccount(account);
        localStorage.setItem("account", JSON.stringify(account));
    };
    return (
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-end shadow-sm relative">
            <div className="flex items-center gap-4">
                <button id='message-btn' className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
                    <Bell size={24} className="text-gray-300" />
                </button>
                <div className="relative">
                    {account ? (
                        <div onMouseEnter={() => setShowMenu(true)} onMouseLeave={() => setShowMenu(false)} className="relative">
                            <button
                                id="account-btn"
                                className="p-2 rounded-lg bg-green-700 text-white flex items-center gap-2"
                                title={account.account_email}
                            >
                                <UserCircle size={24} />
                                <span className="hidden sm:inline">{account.account_email}</span>
                            </button>
                            {/* Pseudo zone rộng bằng menu */}
                            {showMenu && (
                                <>
                                    <div
                                        className="absolute right-0 top-full w-32 h-4"
                                        style={{ pointerEvents: 'auto' }}
                                        onMouseEnter={() => setShowMenu(true)}
                                        onMouseLeave={() => setShowMenu(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg z-50"
                                        onMouseEnter={() => setShowMenu(true)}
                                        onMouseLeave={() => setShowMenu(false)}
                                    >
                                        <button
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                                            onClick={() => {
                                                localStorage.removeItem("account");
                                                setAccount(null);
                                                setShowMenu(false);
                                                showMessage("Đã đăng xuất!", "success");
                                            }}
                                        >Đăng xuất</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="relative" onMouseEnter={() => setShowMenu(true)} onMouseLeave={() => setShowMenu(false)}>
                            <button
                                id='account-btn'
                                className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <UserCircle size={24} className="text-gray-300" />
                            </button>
                            {/* Pseudo zone rộng bằng menu */}
                            {showMenu && (
                                <>
                                    <div
                                        className="absolute right-0 top-full w-32 h-4"
                                        style={{ pointerEvents: 'auto' }}
                                        onMouseEnter={() => setShowMenu(true)}
                                        onMouseLeave={() => setShowMenu(false)}
                                    />
                                    <div
                                        className="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg z-50"
                                        onMouseEnter={() => setShowMenu(true)}
                                        onMouseLeave={() => setShowMenu(false)}
                                    >
                                        <button
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                            onClick={() => { openLogin(); setShowMenu(false); }}
                                        >Đăng nhập</button>
                                        <button
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                            onClick={() => { openSignup(); setShowMenu(false); }}
                                        >Đăng ký</button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {/* Modal login/signup */}
            {showLogin && (
                <LoginModal
                    isOpen={showLogin}
                    onRequestClose={() => setShowLogin(false)}
                    onSuccess={handleLoginSuccess}
                    dictLinksClick={{ signup: openSignup, forgotPassword: () => { } }}
                />
            )}
            {showSignup && (
                <SignupModal
                    isOpen={showSignup}
                    onRequestClose={() => setShowSignup(false)}
                    onSuccess={() => { }}
                    dictLinksClick={{ login: openLogin }}
                />
            )}
        </header>
    );
}
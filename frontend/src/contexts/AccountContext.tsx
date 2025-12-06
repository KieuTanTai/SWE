"use client"
import { Account } from '@/interfaces';
import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

interface NavigationItem {
    name: string;
    path: string;
}

interface AccountContextType {
    account: Account | null;
    setAccount: (account: Account) => void;
    navigation: NavigationItem[];
    logout: () => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [account, setAccount] = useState<Account | null>(null);

    const logout = () => {
        setAccount(null);
    };

    const navigation: NavigationItem[] = useMemo(() => {
        if (!account) return [];

        switch (account.roles?.[0]?.role_id) {
            case 4:
                return [
                    { name: 'Tracking', path: '/tracking' },
                ];
            case 5:
                return [
                    { name: 'Tracking', path: '/tracking' },
                    { name: 'Schedules', path: '/schedules' }
                ];
            default:
                return [];
        }
    }, [account]);

    return (
        <AccountContext.Provider value={{ account, setAccount, navigation, logout }}>
            {children}
        </AccountContext.Provider>
    );
};

export const useAccount = (): AccountContextType => {
    const context = useContext(AccountContext);
    if (!context) {
        throw new Error('useAccount must be used within an AccountProvider');
    }
    return context;
};
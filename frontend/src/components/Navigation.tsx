import React from 'react';
import { useAccount } from '../contexts/AccountContext';
import Link from 'next/link';

const Navigation: React.FC = () => {
    const { account, navigation } = useAccount();

    return (
        <nav>
            <ul>
                {navigation.map((item) => (
                    <li key={item.path} style={{ display: account?.roles?.some(role => role.role_id === 4) && item.name !== 'Live Tracking' ? 'none' : 'block' }}>
                        <Link href={item.path}>{item.name}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navigation;
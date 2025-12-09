"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Bell, X } from 'lucide-react';
import { useAccount } from '@/contexts/AccountContext';

interface AlertMessage {
    message: string;
    timestamp: string;
    from: string;
    id: string;
}

const AlertReceiver: React.FC = () => {
    const { account } = useAccount();
    const [alerts, setAlerts] = useState<AlertMessage[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!account || !account.roles || account.roles.length === 0) {
            return; // Don't connect if no account or roles
        }

        const roleId = account.roles[0].role_id;
        let userRole: string | null = null;

        // Map role_id to role name for WebSocket
        if (roleId === 4) {
            userRole = 'parent';
        } else if (roleId === 5) {
            userRole = 'driver';
        }

        // Only connect if user is parent or driver
        if (!userRole) {
            return;
        }

        // Connect to WebSocket server
        const ws = new WebSocket('ws://localhost:8050');

        ws.onopen = () => {
            console.log(`WebSocket connected as ${userRole}`);
            setIsConnected(true);

            // Register with role
            ws.send(JSON.stringify({
                type: 'register',
                role: userRole,
                userId: account.account_id.toString()
            }));
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === 'alert') {
                    const newAlert: AlertMessage = {
                        message: data.message,
                        timestamp: data.timestamp,
                        from: data.from,
                        id: Date.now().toString() + Math.random()
                    };

                    setAlerts(prev => [newAlert, ...prev]);

                    // Show browser notification if permitted
                    if ('Notification' in window && Notification.permission === 'granted') {
                        new Notification('New Alert', {
                            body: data.message,
                            icon: '/favicon.ico'
                        });
                    }

                    console.log('Received alert:', newAlert);
                }
            } catch (e) {
                console.error('Error parsing WebSocket message:', e);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            setIsConnected(false);
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
        };

        wsRef.current = ws;

        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        return () => {
            ws.close();
        };
    }, [account]);

    const removeAlert = (id: string) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    const clearAllAlerts = () => {
        setAlerts([]);
    };

    // Don't render if not parent or driver
    if (!account || !account.roles || account.roles.length === 0) {
        return null;
    }

    const roleId = account.roles[0].role_id;
    if (roleId !== 4 && roleId !== 5) {
        return null;
    }

    return (
        <>
            {/* Bell Icon with Badge */}
            <div className="relative">
                <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    title="Alerts"
                >
                    <Bell className="w-5 h-5 text-gray-300" />
                    {alerts.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {alerts.length > 9 ? '9+' : alerts.length}
                        </span>
                    )}
                    {isConnected && (
                        <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
                    )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-9999 max-h-96 overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="p-3 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="text-white font-semibold">Notifications</h3>
                            {alerts.length > 0 && (
                                <button
                                    onClick={clearAllAlerts}
                                    className="text-xs text-blue-400 hover:text-blue-300"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>

                        {/* Alert List */}
                        <div className="overflow-y-auto max-h-80">
                            {alerts.length === 0 ? (
                                <div className="p-4 text-center text-gray-400">
                                    No new alerts
                                </div>
                            ) : (
                                alerts.map((alert) => (
                                    <div
                                        key={alert.id}
                                        className="p-3 border-b border-gray-700 hover:bg-gray-750 transition-colors"
                                    >
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex-1">
                                                <p className="text-white text-sm mb-1">
                                                    {alert.message}
                                                </p>
                                                <p className="text-gray-400 text-xs">
                                                    {new Date(alert.timestamp).toLocaleString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => removeAlert(alert.id)}
                                                className="text-gray-400 hover:text-white"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Connection Status */}
                        <div className="p-2 border-t border-gray-700 text-center">
                            <span className={`text-xs ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                                {isConnected ? '● Connected' : '● Disconnected'}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default AlertReceiver;

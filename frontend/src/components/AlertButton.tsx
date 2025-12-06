import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';

interface AlertButtonProps {
    type: 'parent' | 'driver';
    onSendAlert: (message: string) => void;
    id?: string;
}

const AlertButton: React.FC<AlertButtonProps> = ({ type, onSendAlert, id }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        // Connect to WebSocket server
        const ws = new WebSocket('ws://localhost:9050');

        ws.onopen = () => {
            console.log('WebSocket connected (Admin)');
            // Register as admin
            ws.send(JSON.stringify({
                type: 'register',
                role: 'admin',
                userId: 'admin-' + Date.now()
            }));
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'alert_sent') {
                    if (data.success) {
                        console.log(`Alert sent to ${data.recipientCount} ${data.recipientRole}(s)`);
                    } else {
                        console.warn(data.message);
                        alert(data.message);
                    }
                }
            } catch (e) {
                console.error('Error parsing WebSocket message:', e);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
        };

        wsRef.current = ws;

        return () => {
            ws.close();
        };
    }, []);

    useEffect(() => {
        // Listen for close-menu events from other AlertButtons
        const handleCloseMenu = (event: Event) => {
            const customEvent = event as CustomEvent;
            if (customEvent.detail.senderId !== id) {
                setShowMenu(false);
            }
        };

        window.addEventListener('alert-button-opened', handleCloseMenu);

        return () => {
            window.removeEventListener('alert-button-opened', handleCloseMenu);
        };
    }, [id]);

    const alertOptions = {
        parent: [
            { value: 'pickup_delay', label: 'Bus arrival delayed for pickup/drop-off' },
            { value: 'bus_issue', label: 'Bus encountered an issue' }
        ],
        driver: [
            { value: 'wrong_route', label: 'Wrong route' },
            { value: 'route_issue', label: 'Route encountered an issue' }
        ]
    };

    const handleSendAlert = () => {
        if (!selectedOption) {
            alert('Please select an alert option');
            return;
        }
        const option = alertOptions[type].find(opt => opt.value === selectedOption);
        if (option && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            const alertMessage = {
                type: 'alert',
                recipient: type,
                message: option.label,
                timestamp: new Date().toISOString()
            };

            wsRef.current.send(JSON.stringify(alertMessage));
            onSendAlert(option.label);
            setShowMenu(false);
            setSelectedOption('');
        } else if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            alert('WebSocket connection not available. Please try again.');
        }
    };

    const handleToggleMenu = () => {
        if (!showMenu) {
            // Dispatch event to close other menus
            const event = new CustomEvent('alert-button-opened', {
                detail: { senderId: id }
            });
            window.dispatchEvent(event);
        }
        setShowMenu(!showMenu);
    };

    return (
        <div className="relative inline-block">
            <button
                onClick={handleToggleMenu}
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
                <Bell className="w-4 h-4" />
                Send Alert to {type === 'parent' ? 'Parent' : 'Driver'}
            </button>

            {showMenu && (
                <div className="absolute right-0 bottom-full mb-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 p-4">
                    <h3 className="text-white font-semibold mb-3">
                        Select Alert Message for {type === 'parent' ? 'Parent' : 'Driver'}
                    </h3>

                    <div className="space-y-2 mb-4">
                        {alertOptions[type].map((option) => (
                            <label
                                key={option.value}
                                className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer"
                            >
                                <input
                                    type="radio"
                                    name={`alert-${type}`}
                                    value={option.value}
                                    checked={selectedOption === option.value}
                                    onChange={(e) => setSelectedOption(e.target.value)}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm">{option.label}</span>
                            </label>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleSendAlert}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
                        >
                            Send
                        </button>
                        <button
                            onClick={() => {
                                setShowMenu(false);
                                setSelectedOption('');
                            }}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlertButton;

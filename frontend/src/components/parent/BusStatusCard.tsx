import React, { useEffect, useState } from 'react';
import { Bus, Clock, MapPin, Phone, Navigation } from 'lucide-react';
import ContentCard from '../ContentCard';

/**
 * Bus Status Interface
 */
interface BusStatus {
  route: string;
  time: 'Morning' | 'Afternoon' | 'Evening';
  status: 'On Route' | 'Delayed' | 'Arrived' | 'Cancelled';
  message: string;
  eta: string;
  pickup: string;
  bus: string;
  driver: string;
  latitude?: number;
  longitude?: number;
}

/**
 * BusStatusCard Component
 * Displays real-time bus status and location information
 */
interface BusStatusCardProps {
  studentId?: number;
  onTrackBus?: () => void;
}

const BusStatusCard: React.FC<BusStatusCardProps> = ({ studentId, onTrackBus }) => {
  const [busStatus, setBusStatus] = useState<BusStatus | null>(null);

  /**
   * Fetch current bus status from API
   */
  useEffect(() => {
    setBusStatus({
          route: 'Route 12A',
          time: 'Morning',
          status: 'On Route',
          message: 'Bus is on the way to pickup point',
          eta: '5 minutes',
          pickup: '123 Nguyen Van Linh St.',
          bus: '51B-12345',
          driver: 'Mr. Tran Van A',
          latitude: 10.7769,
          longitude: 106.7009
        });
  }, [studentId]);

  /**
   * Get status badge color based on status
   */
  const getStatusColor = (status: string): { bg: string; border: string; text: string } => {
    const colors: Record<string, { bg: string; border: string; text: string }> = {
      'On Route': { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400' },
      'Delayed': { bg: 'bg-yellow-500/20', border: 'border-yellow-500', text: 'text-yellow-400' },
      'Arrived': { bg: 'bg-green-500/20', border: 'border-green-500', text: 'text-green-400' },
      'Cancelled': { bg: 'bg-gray-500/20', border: 'border-gray-500', text: 'text-gray-400' }
    };
    return colors[status] || colors['On Route'];
  };

  /**
   * Handle track bus button click
   */
  const handleTrackBus = () => {
    if (onTrackBus) {
      onTrackBus();
    } else if (busStatus?.latitude && busStatus?.longitude) {
      // Default: Open map with coordinates
      const mapUrl = `https://maps.google.com/?q=${busStatus.latitude},${busStatus.longitude}`;
      window.open(mapUrl, '_blank');
    }
  };

  if (!busStatus) {
    return (
      <ContentCard title="Bus Status">
        <div className="text-center py-8">
          <p className="text-gray-400">No bus status available</p>
        </div>
      </ContentCard>
    );
  }

  const statusColor = getStatusColor(busStatus.status);

  return (
    <ContentCard title="Bus Status">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Bus className="w-6 h-6 text-blue-400 flex-shrink-0" />
          <div>
            <p className="text-gray-400 text-sm">
              {busStatus.route} - {busStatus.time}
            </p>
          </div>
        </div>
        <span
          className={`${statusColor.bg} border ${statusColor.border} ${statusColor.text} px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0`}
        >
          {busStatus.status}
        </span>
      </div>

      {/* Message */}
      <p className="text-gray-300 mb-6 text-sm">{busStatus.message}</p>

      {/* Details */}
      <div className="space-y-3 mb-6">
        {/* ETA */}
        <div className="flex items-center gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
          <Clock className="w-5 h-5 text-orange-400 flex-shrink-0" />
          <span className="text-orange-400 font-semibold">ETA: {busStatus.eta}</span>
        </div>

        {/* Pickup Location */}
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <span className="text-gray-300 text-sm">{busStatus.pickup}</span>
        </div>

        {/* Bus Info */}
        <div className="flex items-center gap-3">
          <Bus className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <span className="text-gray-300 text-sm">{busStatus.bus}</span>
        </div>

        {/* Driver Info */}
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <span className="text-gray-300 text-sm">{busStatus.driver}</span>
        </div>
      </div>

      {/* Track Bus Button */}
      <button
        onClick={handleTrackBus}
        className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
      >
        <Navigation className="w-5 h-5" />
        Track Bus
      </button>
    </ContentCard>
  );
};

export default BusStatusCard;
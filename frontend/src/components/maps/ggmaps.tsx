"use client";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import type { LatLngExpression } from "leaflet";
import { Play, Square, MapPin, Bus } from "lucide-react";

// Dynamic imports as default functions
const MapContainer = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer),
    { ssr: false }
);

const TileLayer = dynamic(
    () => import("react-leaflet").then((mod) => mod.TileLayer),
    { ssr: false }
);

const Marker = dynamic(
    () => import("react-leaflet").then((mod) => mod.Marker),
    { ssr: false }
);

const Popup = dynamic(
    () => import("react-leaflet").then((mod) => mod.Popup),
    { ssr: false }
);

const Polyline = dynamic(
    () => import("react-leaflet").then((mod) => mod.Polyline),
    { ssr: false }
);

const Circle = dynamic(
    () => import("react-leaflet").then((mod) => mod.Circle),
    { ssr: false }
);

interface LocationData {
    lat: number;
    lng: number;
    display_name: string;
}

interface CurrentPosition {
    lat: number;
    lng: number;
    accuracy: number;
    timestamp: number;
    speed: number | null;
}

const geocodeAddress = async (address: string): Promise<LocationData | null> => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
            {
                headers: {
                    'User-Agent': 'SchoolBusSystem/1.0'
                }
            }
        );
        const data = await response.json();
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                display_name: data[0].display_name
            };
        }
        return null;
    } catch (error) {
        console.error("Geocoding error:", error);
        return null;
    }
};

// Helper function - Get route using OSRM
const getRoute = async (start: LocationData, end: LocationData): Promise<LatLngExpression[]> => {
    try {
        const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`
        );
        const data = await response.json();
        if (data.code === "Ok" && data.routes && data.routes.length > 0) {
            const coordinates = data.routes[0].geometry.coordinates;
            return coordinates.map((coord: number[]) => [coord[1], coord[0]] as LatLngExpression);
        }
        return [];
    } catch (error) {
        console.error("Routing error:", error);
        return [];
    }
};

export default function Maps() {
    const [isClient, setIsClient] = useState(false);
    const [startPoint, setStartPoint] = useState<LocationData | null>(null);
    const [endPoint, setEndPoint] = useState<LocationData | null>(null);
    const [route, setRoute] = useState<LatLngExpression[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPosition, setCurrentPosition] = useState<CurrentPosition | null>(null);
    const [tracking, setTracking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const watchIdRef = useRef<number | null>(null);

    useEffect(() => {
        setIsClient(true);

        // Fix Leaflet default icon issue in Next.js
        import("leaflet").then((L) => {
            // @ts-expect-error - Leaflet icon fix for Next.js
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            });
        });

        // Geocode addresses and get route
        const initRoute = async () => {
            const start = await geocodeAddress("273 An Dương Vương, Quận 5, TP.HCM");
            const end = await geocodeAddress("Đại Học Bách Khoa TP.HCM");

            if (start && end) {
                setStartPoint(start);
                setEndPoint(end);
                const routeCoords = await getRoute(start, end);
                setRoute(routeCoords);
            }
            setLoading(false);
        };

        initRoute();
    }, []);

    // Start/Stop tracking
    const toggleTracking = () => {
        if (!tracking) {
            // Start tracking
            if ("geolocation" in navigator) {
                setError(null);
                setTracking(true);

                // Watch position continuously
                const watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        setCurrentPosition({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            accuracy: position.coords.accuracy,
                            timestamp: position.timestamp,
                            speed: position.coords.speed
                        });
                    },
                    (error) => {
                        setError(`Lỗi: ${error.message}`);
                        setTracking(false);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0
                    }
                );
                watchIdRef.current = watchId;
            } else {
                setError("Trình duyệt không hỗ trợ Geolocation");
            }
        } else {
            // Stop tracking
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;
            }
            setTracking(false);
            setCurrentPosition(null);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
        };
    }, []);

    if (!isClient || loading) {
        return (
            <div className="h-full w-full bg-gray-700 flex items-center justify-center">
                <p className="text-gray-300">Đang tải bản đồ và tuyến đường...</p>
            </div>
        );
    }

    const center: LatLngExpression = currentPosition
        ? [currentPosition.lat, currentPosition.lng]
        : startPoint ? [startPoint.lat, startPoint.lng]
            : [10.762622, 106.660172];

    return (
        <div className="w-full h-full">
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

            <div className="relative h-full w-full rounded-lg overflow-hidden shadow-lg">
                {/* Control Panel */}
                <div className="absolute top-4 right-4 z-[1000] bg-white p-4 rounded-lg shadow-md">
                    <button
                        onClick={toggleTracking}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-white font-bold mb-2.5 cursor-pointer border-none transition-colors ${tracking
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-green-600 hover:bg-green-700'
                            }`}
                    >
                        {tracking ? (
                            <>
                                <Square size={16} fill="white" />
                                <span>Dừng theo dõi</span>
                            </>
                        ) : (
                            <>
                                <Play size={16} fill="white" />
                                <span>Bật theo dõi</span>
                            </>
                        )}
                    </button>

                    {error && (
                        <div className="text-red-600 text-xs mt-1">
                            {error}
                        </div>
                    )}

                    {currentPosition && (
                        <div className="text-xs mt-2.5 space-y-1 text-black">
                            <div className="font-bold flex items-center gap-1">
                                <MapPin size={14} className="text-blue-600" />
                                <span>Vị trí hiện tại:</span>
                            </div>
                            <div>Lat: {currentPosition.lat.toFixed(6)}</div>
                            <div>Lng: {currentPosition.lng.toFixed(6)}</div>
                            <div>Độ chính xác: {currentPosition.accuracy.toFixed(0)}m</div>
                            {currentPosition.speed && (
                                <div>Tốc độ: {(currentPosition.speed * 3.6).toFixed(1)} km/h</div>
                            )}
                            <div className="text-[10px] text-gray-600 mt-1">
                                {new Date(currentPosition.timestamp).toLocaleTimeString()}
                            </div>
                        </div>
                    )}
                </div>

                <MapContainer
                    center={center}
                    zoom={currentPosition ? 16 : 13}
                    className="h-full w-full"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Start Point Marker */}
                    {startPoint && (
                        <Marker position={[startPoint.lat, startPoint.lng]}>
                            <Popup>
                                <strong>Điểm đón:</strong><br />
                                273 An Dương Vương, Quận 5
                            </Popup>
                        </Marker>
                    )}

                    {/* End Point Marker */}
                    {endPoint && (
                        <Marker position={[endPoint.lat, endPoint.lng]}>
                            <Popup>
                                <strong>Điểm đến:</strong><br />
                                Đại Học Bách Khoa TP.HCM
                            </Popup>
                        </Marker>
                    )}

                    {/* Route Polyline */}
                    {route.length > 0 && (
                        <Polyline
                            positions={route}
                            color="blue"
                            weight={4}
                            opacity={0.7}
                        />
                    )}

                    {/* Current Position - Live Tracking */}
                    {currentPosition && (
                        <>
                            <Circle
                                center={[currentPosition.lat, currentPosition.lng]}
                                radius={currentPosition.accuracy}
                                pathOptions={{
                                    fillColor: "#3388ff",
                                    fillOpacity: 0.15,
                                    color: "#3388ff",
                                    weight: 2
                                }}
                            />
                            <Marker position={[currentPosition.lat, currentPosition.lng]}>
                                <Popup>
                                    <div className="flex items-start gap-2">
                                        <Bus size={20} className="text-blue-600 mt-0.5" />
                                        <div>
                                            <strong>Xe Bus (Vị trí thời gian thực)</strong><br />
                                            Độ chính xác: {currentPosition.accuracy.toFixed(0)}m<br />
                                            {currentPosition.speed && `Tốc độ: ${(currentPosition.speed * 3.6).toFixed(1)} km/h`}
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        </>
                    )}
                </MapContainer>
            </div>
        </div>
    );
}
"use client";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import type { LatLngExpression } from "leaflet";
import { Play, Square, MapPin, Bus } from "lucide-react";
import type { LocationData, RouteData } from "./types";
import axios from "axios";
import { decode } from "@here/flexpolyline";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then((mod) => mod.Polyline), { ssr: false });
const Circle = dynamic(() => import("react-leaflet").then((mod) => mod.Circle), { ssr: false });

interface MapsProps {
    routes: RouteData[];
}
interface CurrentPosition {
    lat: number;
    lng: number;
    accuracy: number;
    timestamp: number;
    speed: number | null;
}

export const hereGeocodeAddressViaApi = async (address: string): Promise<LocationData | null> => {
    try {
        console.log("Gọi API geocode cho địa chỉ:", address);
        const url = `http://localhost:5000/api/detail-routes/geocode-here?address=${encodeURIComponent(address)}`;
        const resp = await axios.get(url);
        const data = resp.data;
        console.log("Kết quả geocode:", data);
        if (data && data.position) {
            console.log("Tọa độ đầu ra:", data.position, data.title);
            return {
                lat: data.position.lat,
                lng: data.position.lng,
                display_name: data.title || address
            };
        }
        console.log("Không tìm thấy vị trí:", address);
        return null;
    } catch (err) {
        console.log("Lỗi khi geocode:", err);
        return null;
    }
};

const manyHereGeocodeAddressesViaApi = async (addresses: string[]): Promise<LocationData[]> => {
    console.log("Nhiều địa chỉ cần geocode:", addresses);
    const locations: LocationData[] = [];
    for (const address of addresses) {
        const loc = await hereGeocodeAddressViaApi(address);
        console.log("Từng kết quả:", address, loc);
        if (loc) locations.push(loc);
    }
    console.log("Hoàn tất geocode, kết quả:", locations);
    return locations;
};

export const getHereRouteViaApi = async (
    stops: LocationData[]
): Promise<LatLngExpression[][]> => {
    if (stops.length < 2) {
        console.log("Phải truyền vào ít nhất 2 điểm dừng (stops):", stops);
        return [];
    }
    try {
        console.log("Bắt đầu gọi API route-here tới", "http://localhost:5000/api/detail-routes/route-here", "cho các điểm:", stops.map(x => x.display_name));
        const resp = await axios.post("http://localhost:5000/api/detail-routes/route-here", { stops });
        const data = resp.data;
        console.log("Kết quả HERE route API trả về:", data);

        const allPaths: LatLngExpression[][] = [];

        if (Array.isArray(data.routes) && data.routes.length > 0) {
            const route = data.routes[0];
            if (Array.isArray(route.sections) && route.sections.length > 0) {
                route.sections.forEach((section, idx) => {
                    console.log(`Section ${idx}:`, section);
                    if (typeof section.polyline === "string") {
                        const decoded = decode(section.polyline);
                        const polyline = decoded.polyline.map((point: [number, number]) => [point[0], point[1]]);
                        allPaths.push(polyline);
                        console.log(`Đã decode polyline cho đoạn ${idx}:`, polyline.length, polyline);
                    } else {
                        if (stops[idx] && stops[idx + 1]) {
                            allPaths.push([
                                [stops[idx].lat, stops[idx].lng],
                                [stops[idx + 1].lat, stops[idx + 1].lng]
                            ]);
                            console.log(`Đoạn này không có polyline, vẽ đoạn thẳng giữa ${stops[idx].display_name} và ${stops[idx + 1].display_name}`);
                        }
                    }
                });
            } else {
                for (let i = 0; i < stops.length - 1; ++i) {
                    allPaths.push([
                        [stops[i].lat, stops[i].lng],
                        [stops[i + 1].lat, stops[i + 1].lng]
                    ]);
                    console.log(`Không có section nào, vẽ nối thẳng giữa ${stops[i].display_name} và ${stops[i + 1].display_name}`);
                }
            }
        } else {
            for (let i = 0; i < stops.length - 1; ++i) {
                allPaths.push([
                    [stops[i].lat, stops[i].lng],
                    [stops[i + 1].lat, stops[i + 1].lng]
                ]);
                console.log(`Fallback: nối thẳng giữa ${stops[i].display_name} và ${stops[i + 1].display_name}`);
            }
        }
        console.log("Dữ liệu paths cuối cùng để vẽ polyline:", allPaths);
        return allPaths;
    } catch (err) {
        console.log("Lỗi khi gọi route-here, fallback nối thẳng:", err);
        const fallbackPaths: LatLngExpression[][] = [];
        for (let i = 0; i < stops.length - 1; ++i) {
            fallbackPaths.push([
                [stops[i].lat, stops[i].lng],
                [stops[i + 1].lat, stops[i + 1].lng]
            ]);
        }
        return fallbackPaths;
    }
};

export default function Maps({ routes }: MapsProps) {
    const [isClient, setIsClient] = useState<boolean>(false);
    const [routeStops, setRouteStops] = useState<LocationData[][]>([]);
    const [routePaths, setRoutePaths] = useState<LatLngExpression[][][]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPosition, setCurrentPosition] = useState<CurrentPosition | null>(null);
    const [tracking, setTracking] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const watchIdRef = useRef<number | null>(null);

    useEffect(() => {
        setIsClient(true);

        import("leaflet").then((L) => {
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            });
        });

        const initRoute = async () => {
            setLoading(true);
            console.log("Khởi động hàm initRoute với list routes:", routes);
            const allRouteStops: LocationData[][] = [];
            const allRoutePaths: LatLngExpression[][][] = [];
            for (const route of routes) {
                console.log("Đang xử lý tuyến:", route.routeId, route.routeName);
                const geocodedStops = await manyHereGeocodeAddressesViaApi(route.stopPoints);
                console.log("Kết quả geocode:", geocodedStops);

                if (geocodedStops.length > 0) {
                    allRouteStops.push(geocodedStops);
                    const paths = await getHereRouteViaApi(geocodedStops);
                    console.log("Kết quả polyline/routes:", paths);
                    if (paths.length > 0) {
                        allRoutePaths.push(paths);
                    }
                } else {
                    console.log("Tuyến này không có geocodedStops");
                }
            }
            setRouteStops(allRouteStops);
            setRoutePaths(allRoutePaths);
            setLoading(false);
            console.log("Kết quả sau khi process xong tất cả:", { allRouteStops, allRoutePaths });
        };
        initRoute();
    }, [routes]);

    const toggleTracking = (): void => {
        if (!tracking) {
            if ("geolocation" in navigator) {
                setError(null);
                setTracking(true);

                const watchId = navigator.geolocation.watchPosition(
                    (position: GeolocationPosition) => {
                        setCurrentPosition({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            accuracy: position.coords.accuracy,
                            timestamp: position.timestamp,
                            speed: position.coords.speed,
                        });
                        console.log("Cập nhật vị trí người dùng", position.coords);
                    },
                    (err: GeolocationPositionError) => {
                        setError(`Lỗi: ${err.message}`);
                        setTracking(false);
                        console.log("Lỗi GPS:", err);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0,
                    }
                );
                watchIdRef.current = watchId;
            } else {
                setError("Trình duyệt không hỗ trợ Geolocation");
                console.log("Browser không hỗ trợ Geolocation");
            }
        } else {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;
            }
            setTracking(false);
            setCurrentPosition(null);
            console.log("Dừng tracking người dùng");
        }
    };

    useEffect(() => {
        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
        };
    }, []);

    if (!isClient || loading) {
        console.log("Không render Map, đang loading hoặc chưa ssr.");
        return (
            <div className="h-full w-full bg-gray-700 flex items-center justify-center">
                <p className="text-gray-300">Đang tải bản đồ và tuyến đường...</p>
            </div>
        );
    }

    const routeColors: string[] = ['#FF5733', '#33FF57', '#3357FF', '#FF33F5', '#F5FF33', '#33FFF5'];
    const center: LatLngExpression = currentPosition
        ? [currentPosition.lat, currentPosition.lng]
        : routeStops.length > 0 && routeStops[0].length > 0
            ? [routeStops[0][0].lat, routeStops[0][0].lng]
            : [10.762622, 106.660172];

    console.log("Ready render Map với center:", center);

    return (
        <div className="w-full h-full">
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <div className="relative h-full w-full rounded-lg overflow-hidden shadow-lg">
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
                        <div className="text-red-600 text-xs mt-1">{error}</div>
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

                <MapContainer center={center} zoom={currentPosition ? 16 : 13} className="h-full w-full">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {routeStops.map((stops, routeIdx) => (
                        <div key={`route-${routeIdx}`}>
                            {stops.map((stop, stopIdx) => (
                                <Marker key={`route-${routeIdx}-stop-${stopIdx}`} position={[stop.lat, stop.lng]}>
                                    <Popup>
                                        <div className="flex items-start gap-2">
                                            <MapPin size={20} style={{ color: routeColors[routeIdx % routeColors.length] }} className="mt-0.5" />
                                            <div>
                                                <strong>Route {routes[routeIdx]?.routeName} - Điểm {stopIdx + 1}</strong><br />
                                                {stop.display_name}
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </div>
                    ))}

                    {routePaths.map((paths, routeIdx) => (
                        <div key={`route-path-${routeIdx}`}>
                            {paths.map((path, pathIdx) => (
                                <Polyline
                                    key={`route-${routeIdx}-path-${pathIdx}`}
                                    positions={path}
                                    color={routeColors[routeIdx % routeColors.length]}
                                    weight={4}
                                    opacity={0.7}
                                />
                            ))}
                        </div>
                    ))}

                    {currentPosition && (
                        <>
                            <Circle
                                center={[currentPosition.lat, currentPosition.lng]}
                                radius={currentPosition.accuracy}
                                pathOptions={{
                                    fillColor: "#3388ff",
                                    fillOpacity: 0.15,
                                    color: "#3388ff",
                                    weight: 2,
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
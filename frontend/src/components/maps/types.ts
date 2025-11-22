export interface LocationData {
    lat: number;
    lng: number;
    display_name: string;
}

export interface RouteData {
    routeId: number;
    routeName: string;
    stopPoints: string[];
}
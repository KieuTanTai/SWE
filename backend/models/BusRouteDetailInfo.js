/**
 * Value Object for optimized bus route detail info
 * Used for API responses and FE/BE sharing
 */
class BusRouteDetailInfo {
    /**
     * @param {number} bus_route_id
     * @param {number} route_id
     * @param {string} route_name
     * @param {string[]} detail_route_names
     */
    constructor(bus_route_id, route_id, route_name, detail_route_names) {
        this.bus_route_id = bus_route_id;
        this.route_id = route_id;
        this.route_name = route_name;
        this.detail_route_names = detail_route_names;
    }
}

export default BusRouteDetailInfo;

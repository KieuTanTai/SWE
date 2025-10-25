/**
 * BusRoute Model
 * Represents the assignment of buses to routes
 */
class BusRoute {
    constructor({
        bus_route_id = null,
        route_id,
        bus_id,
        bus_route_status = true
    }) {
        this.bus_route_id = bus_route_id;
        this.route_id = route_id;
        this.bus_id = bus_id;
        this.bus_route_status = bus_route_status;

        // Navigation Properties
        this.route = null; // Route object
        this.bus = null; // Bus object
        this.detailSchedules = []; // Array of DetailSchedule objects
    }

    /**
     * Convert to JSON for API responses
     */
    toJSON() {
        return {
            bus_route_id: this.bus_route_id,
            route_id: this.route_id,
            bus_id: this.bus_id,
            bus_route_status: this.bus_route_status,
            route: this.route,
            bus: this.bus,
            detailSchedules: this.detailSchedules
        };
    }

    /**
     * Create BusRoute from database row
     */
    static fromDatabase(row) {
        return new BusRoute({
            bus_route_id: row.bus_route_id,
            route_id: row.route_id,
            bus_id: row.bus_id,
            bus_route_status: row.bus_route_status
        });
    }

    /**
     * Validate bus route data
     */
    validate() {
        const errors = [];

        if (!this.route_id) {
            errors.push('Route ID is required');
        }

        if (!this.bus_id) {
            errors.push('Bus ID is required');
        }

        return errors;
    }
}

export default BusRoute;
/**
 * Route Model
 * Represents bus routes in the system
 */
class Route {
    constructor({
        route_id = 0,
        route_name = '',
        route_status = true
    } = {}) {
        this.route_id = route_id;
        this.route_name = route_name;
        this.route_status = route_status;

        // Navigation Properties
        this.detailRoutes = []; // Array of DetailRoute objects
        this.busRoutes = []; // Array of BusRoute objects
    }

    /**
     * Convert to JSON for API responses
     */
    toJSON() {
        return {
            route_id: this.route_id,
            route_name: this.route_name,
            route_status: this.route_status,
            detailRoutes: this.detailRoutes,
            busRoutes: this.busRoutes
        };
    }

    /**
     * Create Route from database row
     */
    /**
     * Create Route from database row
     * @param {Object} row - The database row
     * @returns {Route} - A new Route instance
     */
    static fromDatabase(row) {
        return new Route({
            route_id: row.route_id,
            route_name: row.route_name,
            route_status: row.route_status
        });
    }

    /**
     * Validate route data
     */
    validate() {
        const errors = [];

        if (!this.route_name || this.route_name.trim().length === 0) {
            errors.push('Route name is required');
        }

        if (this.route_name && this.route_name.length > 50) {
            errors.push('Route name must not exceed 50 characters');
        }

        return errors;
    }
}

export default Route;
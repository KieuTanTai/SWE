/**
 * DetailRoute Model
 * Represents detailed route segments with start and end points
 */
class DetailRoute {
    constructor({
        detail_route_id = 0,
        route_id = 0,
        detail_route_start_point_id = 0,
        detail_route_end_point_id = 0,
        detail_route_distance = 0
    }) {
        this.detail_route_id = detail_route_id;
        this.route_id = route_id;
        this.detail_route_start_point_id = detail_route_start_point_id;
        this.detail_route_end_point_id = detail_route_end_point_id;
        this.detail_route_distance = detail_route_distance;

        // Navigation Properties
        this.route = null; // Route object
        this.startPoint = null; // Address object for start point
        this.endPoint = null; // Address object for end point
    }

    /**
     * Convert to JSON for API responses
     */
    toJSON() {
        return {
            detail_route_id: this.detail_route_id,
            route_id: this.route_id,
            detail_route_start_point_id: this.detail_route_start_point_id,
            detail_route_end_point_id: this.detail_route_end_point_id,
            detail_route_distance: this.detail_route_distance,
            route: this.route,
            startPoint: this.startPoint,
            endPoint: this.endPoint
        };
    }

    /**
     * Create DetailRoute from database row
     */
    static fromDatabase(row) {
        return new DetailRoute({
            detail_route_id: row.detail_route_id,
            route_id: row.route_id,
            detail_route_start_point_id: row.detail_route_start_point_id,
            detail_route_end_point_id: row.detail_route_end_point_id,
            detail_route_distance: row.detail_route_distance
        });
    }

    /**
     * Validate detail route data
     */
    validate() {
        const errors = [];

        if (!this.route_id) {
            errors.push('Route ID is required');
        }

        if (!this.detail_route_start_point_id) {
            errors.push('Start point ID is required');
        }

        if (!this.detail_route_end_point_id) {
            errors.push('End point ID is required');
        }

        if (this.detail_route_start_point_id === this.detail_route_end_point_id) {
            errors.push('Start point and end point cannot be the same');
        }

        if (this.detail_route_distance && this.detail_route_distance < 0) {
            errors.push('Route distance cannot be negative');
        }

        return errors;
    }
}

module.exports = DetailRoute;
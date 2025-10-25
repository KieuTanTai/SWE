/**
 * DetailSchedule Model
 * Represents detailed schedule information with bus routes and time roles
 */
class DetailSchedule {
    constructor({
        detail_schedule_id = null,
        schedule_id,
        detail_schedule_bus_route_id,
        detail_schedule_time_role_id
    }) {
        this.detail_schedule_id = detail_schedule_id;
        this.schedule_id = schedule_id;
        this.detail_schedule_bus_route_id = detail_schedule_bus_route_id;
        this.detail_schedule_time_role_id = detail_schedule_time_role_id;

        // Navigation Properties
        this.schedule = null; // Schedule object
        this.busRoute = null; // BusRoute object
        this.timeRole = null; // TimeRole object
        this.pickupSchedules = []; // Array of PickupSchedule objects
    }

    /**
     * Convert to JSON for API responses
     */
    toJSON() {
        return {
            detail_schedule_id: this.detail_schedule_id,
            schedule_id: this.schedule_id,
            detail_schedule_bus_route_id: this.detail_schedule_bus_route_id,
            detail_schedule_time_role_id: this.detail_schedule_time_role_id,
            schedule: this.schedule,
            busRoute: this.busRoute,
            timeRole: this.timeRole,
            pickupSchedules: this.pickupSchedules
        };
    }

    /**
     * Create DetailSchedule from database row
     */
    static fromDatabase(row) {
        return new DetailSchedule({
            detail_schedule_id: row.detail_schedule_id,
            schedule_id: row.schedule_id,
            detail_schedule_bus_route_id: row.detail_schedule_bus_route_id,
            detail_schedule_time_role_id: row.detail_schedule_time_role_id
        });
    }

    /**
     * Validate detail schedule data
     */
    validate() {
        const errors = [];

        if (!this.schedule_id) {
            errors.push('Schedule ID is required');
        }

        if (!this.detail_schedule_bus_route_id) {
            errors.push('Bus route ID is required');
        }

        if (!this.detail_schedule_time_role_id) {
            errors.push('Time role ID is required');
        }

        return errors;
    }
}

export default DetailSchedule;
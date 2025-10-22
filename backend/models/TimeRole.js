/**
 * TimeRole Model
 * Represents time configurations for pickup and drop-off schedules
 */
class TimeRole {
    constructor({
        time_role_id = null,
        time_role_start_pickup_time = null,
        time_role_start_drop_off_time = null,
        time_role_status = true
    }) {
        this.time_role_id = time_role_id;
        this.time_role_start_pickup_time = time_role_start_pickup_time;
        this.time_role_start_drop_off_time = time_role_start_drop_off_time;
        this.time_role_status = time_role_status;

        // Navigation Properties
        this.detailSchedules = []; // Array of DetailSchedule objects
    }

    /**
     * Convert to JSON for API responses
     */
    toJSON() {
        return {
            time_role_id: this.time_role_id,
            time_role_start_pickup_time: this.time_role_start_pickup_time,
            time_role_start_drop_off_time: this.time_role_start_drop_off_time,
            time_role_status: this.time_role_status,
            detailSchedules: this.detailSchedules
        };
    }

    /**
     * Create TimeRole from database row
     */
    static fromDatabase(row) {
        return new TimeRole({
            time_role_id: row.time_role_id,
            time_role_start_pickup_time: row.time_role_start_pickup_time,
            time_role_start_drop_off_time: row.time_role_start_drop_off_time,
            time_role_status: row.time_role_status
        });
    }

    /**
     * Validate time role data
     */
    validate() {
        const errors = [];

        if (this.time_role_start_pickup_time && this.time_role_start_drop_off_time) {
            const pickupTime = new Date(`1970-01-01T${this.time_role_start_pickup_time}`);
            const dropOffTime = new Date(`1970-01-01T${this.time_role_start_drop_off_time}`);

            if (pickupTime >= dropOffTime) {
                errors.push('Pickup time must be before drop-off time');
            }
        }

        return errors;
    }
}

module.exports = TimeRole;
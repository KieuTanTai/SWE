/**
 * Schedule Model
 * Represents bus schedules managed by managers and assigned to drivers
 */
class Schedule {
    constructor({
        schedule_id = 0,
        schedule_by_manager_id = 0,
        schedule_driver_id = 0,
        schedule_start_date = new Date(),
        schedule_end_date = new Date(),
        schedule_status = true
    } = {}) {
        this.schedule_id = schedule_id;
        this.schedule_by_manager_id = schedule_by_manager_id;
        this.schedule_driver_id = schedule_driver_id;
        this.schedule_start_date = schedule_start_date;
        this.schedule_end_date = schedule_end_date;
        this.schedule_status = schedule_status;

        // Navigation Properties
        this.manager = null; // Person object (manager)
        this.driver = null; // Driver object
        this.detailSchedules = []; // Array of DetailSchedule objects
    }

    /**
     * Convert to JSON for API responses
     */
    toJSON() {
        return {
            schedule_id: this.schedule_id,
            schedule_by_manager_id: this.schedule_by_manager_id,
            schedule_driver_id: this.schedule_driver_id,
            schedule_start_date: this.schedule_start_date,
            schedule_end_date: this.schedule_end_date,
            schedule_status: this.schedule_status,
            manager: this.manager,
            driver: this.driver,
            detailSchedules: this.detailSchedules,
            duration_days: this.getDurationInDays()
        };
    }


    /**
     *
     *
     * @return {number} 
     * @memberof Schedule
     */
    getDurationInDays() {
        if (!this.schedule_start_date || !this.schedule_end_date) return null;

        const start = new Date(this.schedule_start_date);
        const end = new Date(this.schedule_end_date);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Create Schedule from database row
     */
    static fromDatabase(row) {
        return new Schedule({
            schedule_id: row.schedule_id,
            schedule_by_manager_id: row.schedule_by_manager_id,
            schedule_driver_id: row.schedule_driver_id,
            schedule_start_date: row.schedule_start_date,
            schedule_end_date: row.schedule_end_date,
            schedule_status: row.schedule_status
        });
    }

    /**
     * Validate schedule data
     */
    validate() {
        const errors = [];

        if (!this.schedule_by_manager_id) {
            errors.push('Manager ID is required');
        }

        if (!this.schedule_driver_id) {
            errors.push('Driver ID is required');
        }

        if (this.schedule_start_date && this.schedule_end_date) {
            const start = new Date(this.schedule_start_date);
            const end = new Date(this.schedule_end_date);

            if (start >= end) {
                errors.push('Start date must be before end date');
            }
        }

        return errors;
    }
}

export default Schedule;
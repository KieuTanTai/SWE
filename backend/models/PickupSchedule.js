/**
 * PickupSchedule Model
 * Represents pickup schedules for students
 */
class PickupSchedule {
    constructor({
        pickup_schedule_id = null,
        pickup_schedule_detail_id,
        pickup_schedule_student_id
    }) {
        this.pickup_schedule_id = pickup_schedule_id;
        this.pickup_schedule_detail_id = pickup_schedule_detail_id;
        this.pickup_schedule_student_id = pickup_schedule_student_id;

        // Navigation Properties
        this.detailSchedule = null; // DetailSchedule object
        this.student = null; // Student object
    }

    /**
     * Convert to JSON for API responses
     */
    toJSON() {
        return {
            pickup_schedule_id: this.pickup_schedule_id,
            pickup_schedule_detail_id: this.pickup_schedule_detail_id,
            pickup_schedule_student_id: this.pickup_schedule_student_id,
            detailSchedule: this.detailSchedule,
            student: this.student
        };
    }

    /**
     * Create PickupSchedule from database row
     */
    static fromDatabase(row) {
        return new PickupSchedule({
            pickup_schedule_id: row.pickup_schedule_id,
            pickup_schedule_detail_id: row.pickup_schedule_detail_id,
            pickup_schedule_student_id: row.pickup_schedule_student_id
        });
    }

    /**
     * Validate pickup schedule data
     */
    validate() {
        const errors = [];

        if (!this.pickup_schedule_detail_id) {
            errors.push('Detail schedule ID is required');
        }

        if (!this.pickup_schedule_student_id) {
            errors.push('Student ID is required');
        }

        return errors;
    }
}

module.exports = PickupSchedule;
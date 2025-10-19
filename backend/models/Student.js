/**
 * Student Model
 * Represents students in the system
 */
class Student {
    constructor({
        student_id = null,
        student_parent_id,
        student_person_id,
        student_grade = null
    }) {
        this.student_id = student_id;
        this.student_parent_id = student_parent_id;
        this.student_person_id = student_person_id;
        this.student_grade = student_grade;

        // Navigation Properties
        this.person = null; // Person object (must have person_type = 'student')
        this.parent = null; // Parent object
        this.pickupSchedules = []; // Array of PickupSchedule objects
    }

    /**
     * Convert to JSON for API responses
     */
    toJSON() {
        return {
            student_id: this.student_id,
            student_parent_id: this.student_parent_id,
            student_person_id: this.student_person_id,
            student_grade: this.student_grade,
            person: this.person,
            parent: this.parent,
            pickupSchedules: this.pickupSchedules
        };
    }

    /**
     * Create Student from database row
     */
    static fromDatabase(row) {
        return new Student({
            student_id: row.student_id,
            student_parent_id: row.student_parent_id,
            student_person_id: row.student_person_id,
            student_grade: row.student_grade
        });
    }

    /**
     * Validate student data
     */
    validate() {
        const errors = [];

        if (!this.student_parent_id) {
            errors.push('Student parent ID is required');
        }

        if (!this.student_person_id) {
            errors.push('Student person ID is required');
        }

        if (this.student_grade && (this.student_grade < 1 || this.student_grade > 12)) {
            errors.push('Student grade must be between 1 and 12');
        }

        return errors;
    }
}

module.exports = Student;
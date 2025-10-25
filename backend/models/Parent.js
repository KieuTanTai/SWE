/**
 * Parent Model
 * Represents parents in the system
 */
class Parent {
    constructor({
        parent_person_id = 0,
        parent_address_id = null,
        parent_job = null,
        parent_type = null
    } = {}) {
        this.parent_person_id = parent_person_id;
        this.parent_address_id = parent_address_id;
        this.parent_job = parent_job;
        this.parent_type = parent_type; // 'father', 'mother', 'grandpa', 'grandma', 'other'

        // Navigation Properties
        this.person = null; // Person object (must have person_type = 'parent')
        this.address = null; // Address object
        this.students = []; // Array of Student objects
    }

    /**
     * Convert to JSON for API responses
     */
    toJSON() {
        return {
            parent_person_id: this.parent_person_id,
            parent_address_id: this.parent_address_id,
            parent_job: this.parent_job,
            parent_type: this.parent_type,
            person: this.person,
            address: this.address,
            students: this.students
        };
    }

    /**
     * Create Parent from database row
     */
    static fromDatabase(row) {
        return new Parent({
            parent_person_id: row.parent_person_id,
            parent_address_id: row.parent_address_id,
            parent_job: row.parent_job,
            parent_type: row.parent_type
        });
    }

    /**
     * Validate parent data
     */
    validate() {
        const errors = [];

        if (!this.parent_person_id) {
            errors.push('Parent person ID is required');
        }

        if (!this.parent_type) {
            errors.push('Parent type is required');
        }

        const validTypes = ['father', 'mother', 'grandpa', 'grandma', 'other'];
        if (this.parent_type && !validTypes.includes(this.parent_type)) {
            errors.push('Invalid parent type');
        }

        if (this.parent_job && this.parent_job.length > 50) {
            errors.push('Parent job must not exceed 50 characters');
        }

        return errors;
    }
}

export default Parent;
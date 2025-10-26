/**
 * Person Model
 * Base model for all persons in the system (manager, driver, parent, student, other)
 */
class Person {
    constructor({
        person_id = 0,
        person_account_id = 0,
        person_phone = '',
        person_name = '',
        person_gender = '',
        person_birthday = new Date(),
        person_type = '',
        person_life_cycle_status = true
    } = {}) {
        this.person_id = person_id;
        this.person_account_id = person_account_id;
        this.person_phone = person_phone;
        this.person_name = person_name;
        this.person_gender = person_gender;
        this.person_birthday = person_birthday;
        this.person_type = person_type; // 'manager', 'driver', 'parent', 'student', 'other'
        this.person_life_cycle_status = person_life_cycle_status;

        // Navigation Properties
        this.account = null; // Account object
        this.parentProfile = null; // Parent object if person_type is 'parent'
        this.driverProfile = null; // Driver object if person_type is 'driver'
        this.studentProfile = null; // Student object if person_type is 'student'
        this.managedSchedules = []; // Array of Schedule objects where this person is manager
    }

    /**
     * Convert to JSON for API responses
     */
    toJSON() {
        return {
            person_id: this.person_id,
            person_account_id: this.person_account_id,
            person_phone: this.person_phone,
            person_name: this.person_name,
            person_gender: this.person_gender,
            person_birthday: this.person_birthday,
            person_type: this.person_type,
            person_life_cycle_status: this.person_life_cycle_status,
            account: this.account,
            parentProfile: this.parentProfile,
            driverProfile: this.driverProfile,
            studentProfile: this.studentProfile
        };
    }

    /**
     * Create Person from database row
     */
    static fromDatabase(row) {
        return new Person({
            person_id: row.person_id,
            person_account_id: row.person_account_id,
            person_phone: row.person_phone,
            person_name: row.person_name,
            person_gender: row.person_gender,
            person_birthday: row.person_birthday,
            person_type: row.person_type,
            person_life_cycle_status: row.person_life_cycle_status
        });
    }

    /**
     * Validate person data
     */
    validate() {
        const errors = [];

        if (!this.person_name || this.person_name.trim().length === 0) {
            errors.push('Person name is required');
        }

        if (!this.person_type) {
            errors.push('Person type is required');
        }

        const validTypes = ['manager', 'driver', 'parent', 'student', 'other'];
        if (this.person_type && !validTypes.includes(this.person_type)) {
            errors.push('Invalid person type');
        }

        if (this.person_name && this.person_name.length > 50) {
            errors.push('Person name must not exceed 50 characters');
        }

        return errors;
    }

    /**
     * Check if person can be a manager
     */
    canBeManager() {
        return ['manager', 'other'].includes(this.person_type);
    }
}

export default Person;
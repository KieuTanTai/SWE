/**
 * Driver Model
 * Represents drivers in the system
 */
class Driver {
    constructor({
        driver_person_id = 0,
        driver_experience = 0,
        driver_experience_type = 'year',
        driver_late_arrival_count = 0
    } = {}) {
        this.driver_person_id = driver_person_id;
        this.driver_experience = driver_experience;
        this.driver_experience_type = driver_experience_type; // 'day', 'month', 'year'
        this.driver_late_arrival_count = driver_late_arrival_count;

        // Navigation Properties
        this.person = null; // Person object (must have person_type = 'driver')
        this.schedules = []; // Array of Schedule objects
        this.reports = []; // Array of Report objects
    }

    /**
     * Convert to JSON for API responses
     */
    toJSON() {
        return {
            driver_person_id: this.driver_person_id,
            driver_experience: this.driver_experience,
            driver_experience_type: this.driver_experience_type,
            driver_late_arrival_count: this.driver_late_arrival_count,
            person: this.person,
            schedules: this.schedules,
            reports: this.reports,
            experience_in_years: this.getExperienceInYears()
        };
    }

    /**
     * Get experience converted to years
     */
    getExperienceInYears() {
        switch (this.driver_experience_type) {
            case 'day':
                return this.driver_experience / 365;
            case 'month':
                return this.driver_experience / 12;
            case 'year':
            default:
                return this.driver_experience;
        }
    }

    /**
     * Create Driver from database row
     */
    static fromDatabase(row) {
        return new Driver({
            driver_person_id: row.driver_person_id,
            driver_experience: row.driver_experience,
            driver_experience_type: row.driver_experience_type,
            driver_late_arrival_count: row.driver_late_arrival_count
        });
    }

    /**
     * Validate driver data
     */
    validate() {
        const errors = [];

        if (!this.driver_person_id) {
            errors.push('Driver person ID is required');
        }

        const validExperienceTypes = ['day', 'month', 'year'];
        if (this.driver_experience_type && !validExperienceTypes.includes(this.driver_experience_type)) {
            errors.push('Invalid driver experience type');
        }

        if (this.driver_experience < 0) {
            errors.push('Driver experience cannot be negative');
        }

        if (this.driver_late_arrival_count < 0) {
            errors.push('Late arrival count cannot be negative');
        }

        return errors;
    }
}

export default Driver;
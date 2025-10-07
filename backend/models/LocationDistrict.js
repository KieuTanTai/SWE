/**
 * LocationDistrict Model
 * Represents districts within cities
 */
class LocationDistrict {
    constructor({
        location_district_id = null,
        location_district_name,
        location_city_id,
        location_district_status = true
    }) {
        this.location_district_id = location_district_id;
        this.location_district_name = location_district_name;
        this.location_city_id = location_city_id;
        this.location_district_status = location_district_status;

        // Navigation Properties
        this.city = null; // LocationCity object
        this.wards = []; // Array of LocationWard objects
        this.addresses = []; // Array of Address objects
    }

    /**
     * Convert to JSON for API responses
     */
    toJSON() {
        return {
            location_district_id: this.location_district_id,
            location_district_name: this.location_district_name,
            location_city_id: this.location_city_id,
            location_district_status: this.location_district_status,
            city: this.city,
            wards: this.wards,
            addresses: this.addresses
        };
    }

    /**
     * Create LocationDistrict from database row
     */
    static fromDatabase(row) {
        return new LocationDistrict({
            location_district_id: row.location_district_id,
            location_district_name: row.location_district_name,
            location_city_id: row.location_city_id,
            location_district_status: row.location_district_status
        });
    }

    /**
     * Validate district data
     */
    validate() {
        const errors = [];

        if (!this.location_district_name || this.location_district_name.trim().length === 0) {
            errors.push('District name is required');
        }

        if (!this.location_city_id) {
            errors.push('City ID is required');
        }

        if (this.location_district_name && this.location_district_name.length > 50) {
            errors.push('District name must not exceed 50 characters');
        }

        return errors;
    }
}

module.exports = LocationDistrict;
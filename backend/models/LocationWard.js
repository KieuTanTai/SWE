/**
 * LocationWard Model
 * Represents wards within districts
 */
class LocationWard {
    constructor({
        location_ward_id = null,
        location_ward_name,
        location_district_id,
        location_ward_status = true
    }) {
        this.location_ward_id = location_ward_id;
        this.location_ward_name = location_ward_name;
        this.location_district_id = location_district_id;
        this.location_ward_status = location_ward_status;

        // Navigation Properties
        this.district = null; // LocationDistrict object
        this.addresses = []; // Array of Address objects
    }

    /**
     * Convert to JSON for API responses
     */
    toJSON() {
        return {
            location_ward_id: this.location_ward_id,
            location_ward_name: this.location_ward_name,
            location_district_id: this.location_district_id,
            location_ward_status: this.location_ward_status,
            district: this.district,
            addresses: this.addresses
        };
    }

    /**
     * Create LocationWard from database row
     */
    static fromDatabase(row) {
        return new LocationWard({
            location_ward_id: row.location_ward_id,
            location_ward_name: row.location_ward_name,
            location_district_id: row.location_district_id,
            location_ward_status: row.location_ward_status
        });
    }

    /**
     * Validate ward data
     */
    validate() {
        const errors = [];

        if (!this.location_ward_name || this.location_ward_name.trim().length === 0) {
            errors.push('Ward name is required');
        }

        if (!this.location_district_id) {
            errors.push('District ID is required');
        }

        if (this.location_ward_name && this.location_ward_name.length > 50) {
            errors.push('Ward name must not exceed 50 characters');
        }

        return errors;
    }
}

export default LocationWard;
/**
 * LocationCity Model
 * Represents cities in the location hierarchy
 */
class LocationCity {
    constructor({
        location_city_id = null,
        location_city_name,
        location_city_status = true
    }) {
        this.location_city_id = location_city_id;
        this.location_city_name = location_city_name;
        this.location_city_status = location_city_status;

        // Navigation Properties
        this.districts = []; // Array of LocationDistrict objects
        this.addresses = []; // Array of Address objects
    }

    /**
     * Convert to JSON for API responses
     */
    toJSON() {
        return {
            location_city_id: this.location_city_id,
            location_city_name: this.location_city_name,
            location_city_status: this.location_city_status,
            districts: this.districts,
            addresses: this.addresses
        };
    }

    /**
     * Create LocationCity from database row
     */
    static fromDatabase(row) {
        return new LocationCity({
            location_city_id: row.location_city_id,
            location_city_name: row.location_city_name,
            location_city_status: row.location_city_status
        });
    }

    /**
     * Validate city data
     */
    validate() {
        const errors = [];

        if (!this.location_city_name || this.location_city_name.trim().length === 0) {
            errors.push('City name is required');
        }

        if (this.location_city_name && this.location_city_name.length > 50) {
            errors.push('City name must not exceed 50 characters');
        }

        return errors;
    }
}

module.exports = LocationCity;
/**
 * Address Model
 * Represents complete addresses using location hierarchy
 */
class Address {
    constructor({
        address_id = null,
        address_city_id,
        address_district_id,
        address_ward_id,
        address_number = null
    }) {
        this.address_id = address_id;
        this.address_city_id = address_city_id;
        this.address_district_id = address_district_id;
        this.address_ward_id = address_ward_id;
        this.address_number = address_number;

        // Navigation Properties
        this.city = null; // LocationCity object
        this.district = null; // LocationDistrict object
        this.ward = null; // LocationWard object
        this.parents = []; // Array of Parent objects using this address
        this.routeStartPoints = []; // Array of DetailRoute objects where this is start point
        this.routeEndPoints = []; // Array of DetailRoute objects where this is end point
    }

    /**
     * Convert to JSON for API responses
     */
    toJSON() {
        return {
            address_id: this.address_id,
            address_city_id: this.address_city_id,
            address_district_id: this.address_district_id,
            address_ward_id: this.address_ward_id,
            address_number: this.address_number,
            city: this.city,
            district: this.district,
            ward: this.ward,
            full_address: this.getFullAddress()
        };
    }

    /**
     * Get full address string
     */
    getFullAddress() {
        const parts = [];
        if (this.address_number) parts.push(this.address_number);
        if (this.ward?.location_ward_name) parts.push(this.ward.location_ward_name);
        if (this.district?.location_district_name) parts.push(this.district.location_district_name);
        if (this.city?.location_city_name) parts.push(this.city.location_city_name);
        return parts.join(', ');
    }

    /**
     * Create Address from database row
     */
    static fromDatabase(row) {
        return new Address({
            address_id: row.address_id,
            address_city_id: row.address_city_id,
            address_district_id: row.address_district_id,
            address_ward_id: row.address_ward_id,
            address_number: row.address_number
        });
    }

    /**
     * Validate address data
     */
    validate() {
        const errors = [];

        if (!this.address_city_id) {
            errors.push('City ID is required');
        }

        if (!this.address_district_id) {
            errors.push('District ID is required');
        }

        if (!this.address_ward_id) {
            errors.push('Ward ID is required');
        }

        return errors;
    }
}

export default Address;
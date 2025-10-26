/**
 * Bus Model
 * Represents buses in the fleet
 */
class Bus {
    constructor({
        bus_id = 0,
        bus_license_plate = '',
        bus_brand = '',
        bus_model = '',
        bus_capacity = 0,
        bus_year_manufactured = 0,
        bus_has_wifi = false,
        bus_has_camera = false,
        bus_color = '',
        bus_status = true
    } = {}) {
        this.bus_id = bus_id;
        this.bus_license_plate = bus_license_plate;
        this.bus_brand = bus_brand;
        this.bus_model = bus_model;
        this.bus_capacity = bus_capacity;
        this.bus_year_manufactured = bus_year_manufactured;
        this.bus_has_wifi = bus_has_wifi;
        this.bus_has_camera = bus_has_camera;
        this.bus_color = bus_color;
        this.bus_status = bus_status;

        // Navigation Properties
        this.busRoutes = []; // Array of BusRoute objects
    }

    /**
     * Convert to JSON for API responses
     */
    toJSON() {
        return {
            bus_id: this.bus_id,
            bus_license_plate: this.bus_license_plate,
            bus_brand: this.bus_brand,
            bus_model: this.bus_model,
            bus_capacity: this.bus_capacity,
            bus_year_manufactured: this.bus_year_manufactured,
            bus_has_wifi: this.bus_has_wifi,
            bus_has_camera: this.bus_has_camera,
            bus_color: this.bus_color,
            bus_status: this.bus_status,
            busRoutes: this.busRoutes,
            bus_age: this.getBusAge()
        };
    }

    /**
     * Get bus age in years
     */
    getBusAge() {
        if (!this.bus_year_manufactured) return null;
        return new Date().getFullYear() - this.bus_year_manufactured;
    }

    /**
     * Create Bus from database row
     */
    static fromDatabase(row) {
        return new Bus({
            bus_id: row.bus_id,
            bus_license_plate: row.bus_license_plate,
            bus_brand: row.bus_brand,
            bus_model: row.bus_model,
            bus_capacity: row.bus_capacity,
            bus_year_manufactured: row.bus_year_manufactured,
            bus_has_wifi: row.bus_has_wifi,
            bus_has_camera: row.bus_has_camera,
            bus_color: row.bus_color,
            bus_status: row.bus_status
        });
    }

    /**
     * Validate bus data
     */
    validate() {
        const errors = [];

        if (!this.bus_license_plate || this.bus_license_plate.trim().length === 0) {
            errors.push('Bus license plate is required');
        }

        if (!this.bus_capacity || this.bus_capacity <= 0) {
            errors.push('Bus capacity must be greater than 0');
        }

        if (this.bus_license_plate && this.bus_license_plate.length > 20) {
            errors.push('License plate must not exceed 20 characters');
        }

        if (this.bus_year_manufactured && (this.bus_year_manufactured < 1900 || this.bus_year_manufactured > new Date().getFullYear())) {
            errors.push('Invalid year manufactured');
        }

        return errors;
    }
}

export default Bus;
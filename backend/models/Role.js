/**
 * Role Model
 * Represents user roles for authorization
 */
class Role {
    constructor({
        role_id = null,
        role_name,
        role_created_date = new Date(),
        role_active_status = true
    }) {
        this.role_id = role_id;
        this.role_name = role_name;
        this.role_created_date = role_created_date;
        this.role_active_status = role_active_status;

        // Navigation Properties
        this.accounts = []; // Array of Account objects through Account_Role
        this.permissions = []; // Array of permissions for this role
    }

    /**
     * Convert to JSON for API responses
     */
    toJSON() {
        return {
            role_id: this.role_id,
            role_name: this.role_name,
            role_created_date: this.role_created_date,
            role_active_status: this.role_active_status,
            accounts: this.accounts,
            permissions: this.permissions
        };
    }

    /**
     * Create Role from database row
     */
    static fromDatabase(row) {
        return new Role({
            role_id: row.role_id,
            role_name: row.role_name,
            role_created_date: row.role_created_date,
            role_active_status: row.role_active_status
        });
    }

    /**
     * Validate role data
     */
    validate() {
        const errors = [];

        if (!this.role_name || this.role_name.trim().length === 0) {
            errors.push('Role name is required');
        }

        if (this.role_name && this.role_name.length > 25) {
            errors.push('Role name must not exceed 25 characters');
        }

        return errors;
    }
}

module.exports = Role;
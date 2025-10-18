/**
 * Account Model
 * Represents user accounts in the system
 */
class Account {
    constructor({
        account_id = 0,
        account_email = '',
        account_password = '',
        account_create_date = new Date(),
        account_last_updated_date = new Date(),
        account_login_status = false
    }) {
        this.account_id = account_id;
        this.account_email = account_email;
        this.account_password = account_password;
        this.account_create_date = account_create_date;
        this.account_last_updated_date = account_last_updated_date;
        this.account_login_status = account_login_status;

        // Navigation Properties
        this.roles = []; // Array of Role objects through Account_Role
        this.person = null; // Person object if account has person profile
        this.parent = null; // Parent object if account belongs to parent
        this.driver = null; // Driver object if account belongs to driver
    }

    /**
     * Convert to JSON for API responses
     */
    toJSON() {
        return {
            account_id: this.account_id,
            account_email: this.account_email,
            account_create_date: this.account_create_date,
            account_last_updated_date: this.account_last_updated_date,
            account_login_status: this.account_login_status,
            roles: this.roles,
            person: this.person,
            parent: this.parent,
            driver: this.driver
        };
    }

    /**
     * Create Account from database row
     */
    static fromDatabase(row) {
        return new Account({
            account_id: row.account_id,
            account_email: row.account_email,
            account_password: row.account_password,
            account_create_date: row.account_create_date,
            account_last_updated_date: row.account_last_updated_date,
            account_login_status: row.account_login_status
        });
    }

    /**
     * Validate account data
     */
    validate() {
        const errors = [];

        if (!this.account_email || !/\S+@\S+\.\S+/.test(this.account_email)) {
            errors.push('Valid email is required');
        }

        if (!this.account_password || this.account_password.length < 6) {
            errors.push('Password must be at least 6 characters');
        }

        return errors;
    }
}

module.exports = Account;
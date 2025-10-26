/**
 * AccountRole Model
 * Represents many-to-many relationship between Account and Role
 */
class AccountRole {
    constructor({
        role_id = 0,
        account_id = 0,
        assigned_date = new Date(),
        assigned_by = 0
    } = {}) {
        this.role_id = role_id;
        this.account_id = account_id;
        this.assigned_date = assigned_date;
        this.assigned_by = assigned_by;

        // Navigation Properties
        this.account = null; // Account object
        this.role = null; // Role object
    }

    /**
     * Convert to JSON for API responses
     */
    toJSON() {
        return {
            role_id: this.role_id,
            account_id: this.account_id,
            assigned_date: this.assigned_date,
            assigned_by: this.assigned_by,
            account: this.account,
            role: this.role
        };
    }

    /**
     * Create AccountRole from database row
     */
    static fromDatabase(row) {
        return new AccountRole({
            role_id: row.role_id,
            account_id: row.account_id,
            assigned_date: row.assigned_date,
            assigned_by: row.assigned_by
        });
    }

    /**
     * Validate account role data
     */
    validate() {
        const errors = [];

        if (!this.role_id) {
            errors.push('Role ID is required');
        }

        if (!this.account_id) {
            errors.push('Account ID is required');
        }

        return errors;
    }
}

export default AccountRole;
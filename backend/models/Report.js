/**
 * Report Model
 * Represents driver reports for various activities
 */
class Report {
    constructor({
        report_id = null,
        report_driver_id = 0,
        report_time = new Date(),
        report_type = '',
        report_content = null
    } = {}) {
        this.report_id = report_id;
        this.report_driver_id = report_driver_id;
        this.report_time = report_time;
        this.report_type = report_type; // 'start_pickup', 'picked_up', 'late', 'dropped_off', 'warning'
        this.report_content = report_content;

        // Navigation Properties
        this.driver = null; // Driver object
    }

    /**
     * Convert to JSON for API responses
     */
    toJSON() {
        return {
            report_id: this.report_id,
            report_driver_id: this.report_driver_id,
            report_time: this.report_time,
            report_type: this.report_type,
            report_content: this.report_content,
            driver: this.driver,
            formatted_time: this.getFormattedTime()
        };
    }

    /**
     * Get formatted time for display
     */
    getFormattedTime() {
        if (!this.report_time) return null;
        return new Date(this.report_time).toLocaleString();
    }

    /**
     * Create Report from database row
     */
    static fromDatabase(row) {
        return new Report({
            report_id: row.report_id,
            report_driver_id: row.report_driver_id,
            report_time: row.report_time,
            report_type: row.report_type,
            report_content: row.report_content
        });
    }

    /**
     * Validate report data
     */
    validate() {
        const errors = [];

        if (!this.report_driver_id) {
            errors.push('Driver ID is required');
        }

        if (!this.report_type) {
            errors.push('Report type is required');
        }

        const validTypes = ['start_pickup', 'picked_up', 'late', 'dropped_off', 'warning'];
        if (this.report_type && !validTypes.includes(this.report_type)) {
            errors.push('Invalid report type');
        }

        if (this.report_content && this.report_content.length > 255) {
            errors.push('Report content must not exceed 255 characters');
        }

        return errors;
    }

    /**
     * Check if report is urgent (warning or late)
     */
    isUrgent() {
        return ['warning', 'late'].includes(this.report_type);
    }

    /**
     * Get report priority level
     */
    getPriority() {
        const priorityMap = {
            'warning': 'high',
            'late': 'high',
            'start_pickup': 'medium',
            'picked_up': 'low',
            'dropped_off': 'low'
        };

        return priorityMap[this.report_type] || 'low';
    }
}

export default Report;
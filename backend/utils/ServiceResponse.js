/**
 * ServiceResponse - Value object for standardized service layer responses
 * Encapsulates the response structure {success, data?, error?}
 */
class ServiceResponse {
    /**
     * @param {boolean} success - Whether the operation succeeded
     * @param {*} data - The data payload (only for success)
     * @param {string} error - The error message (only for failure)
     */
    constructor(success, data = undefined, error = undefined) {
        this.success = success;
        if (data !== undefined) {
            this.data = data;
        }
        if (error !== undefined) {
            this.error = error;
        }
    }

    /**
     * Create a successful response
     * @param {*} data - The data to return
     * @returns {ServiceResponse} Success response object
     */
    static success(data = null) {
        return new ServiceResponse(true, data);
    }

    /**
     * Create a failure response
     * @param {string} error - The error message
     * @returns {ServiceResponse} Failure response object
     */
    static failure(error) {
        return new ServiceResponse(false, undefined, error);
    }

    /**
     * Create a failure response for validation errors
     * @param {string} fieldName - The field that failed validation
     * @param {string} reason - Why validation failed (optional)
     * @returns {ServiceResponse} Validation error response
     */
    static validationError(fieldName, reason = 'is invalid') {
        return ServiceResponse.failure(`${fieldName} ${reason}`);
    }

    /**
     * Check if this is a success response
     * @returns {boolean}
     */
    isSuccess() {
        return this.success === true;
    }

    /**
     * Check if this is a failure response
     * @returns {boolean}
     */
    isFailure() {
        return this.success === false;
    }

    /**
     * Get the data payload (throws if failure)
     * @returns {*} The data
     * @throws {Error} If response is a failure
     */
    getData() {
        if (this.isFailure()) {
            throw new Error(`Cannot get data from failure response: ${this.error}`);
        }
        return this.data;
    }

    /**
     * Get the error message (throws if success)
     * @returns {string} The error message
     * @throws {Error} If response is a success
     */
    getError() {
        if (this.isSuccess()) {
            throw new Error('Cannot get error from success response');
        }
        return this.error;
    }

    /**
     * Convert to plain object for JSON serialization
     * @returns {Object} Plain object {success, data?, error?}
     */
    toJSON() {
        const result = { success: this.success };
        if (this.data !== undefined) {
            result.data = this.data;
        }
        if (this.error !== undefined) {
            result.error = this.error;
        }
        return result;
    }
}

export default ServiceResponse;

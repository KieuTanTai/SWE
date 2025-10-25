import { Report } from "../../models/index.js";
import { default as BaseDAO } from "./baseDAO.js";
import dbSchema from "./dbSchema.js";
import mySql from "mysql2/promise";

/**
 * ReportDAO
 * Data Access Object for Report table operations
 */
export default class ReportDAO extends BaseDAO {
    
    /**
     * Creates an instance of ReportDAO.
     * @param {mySql.PoolConnection} connection
     * @memberof ReportDAO
     */
    constructor(connection) {
        super(connection, "Report", dbSchema.REPORT_COLUMNS.REPORT_ID);
    }

    /**
     * Get all reports
     * @return {Promise<Report[]>} 
     * @memberof ReportDAO
     */
    async getAllReports() {
        try {
            const results = await this._protectedGetAll();
            if (!results || results.length === 0) {
                console.warn(`Warning: No reports found`);
                return [];
            }
            return results.map(row => Report.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get report by ID
     * @param {number} reportId
     * @return {Promise<Report>} 
     * @memberof ReportDAO
     */
    async getByReportId(reportId) {
        if (reportId === null || reportId === undefined || !Number.isInteger(reportId)) {
            console.warn(`Warning: reportId is invalid : ${reportId}`);
            const emptyReport = {};
            emptyReport[dbSchema.REPORT_COLUMNS.REPORT_ID] = 0;
            emptyReport[dbSchema.REPORT_COLUMNS.REPORT_DRIVER_ID] = 0;
            emptyReport[dbSchema.REPORT_COLUMNS.REPORT_TYPE] = '';
            return new Report(emptyReport);
        }

        try {
            if (Number.parseInt(reportId.toString()) <= 0) {
                console.warn(`Warning: reportId must be greater than zero : ${reportId}`);
                const emptyReport = {};
                emptyReport[dbSchema.REPORT_COLUMNS.REPORT_ID] = 0;
                emptyReport[dbSchema.REPORT_COLUMNS.REPORT_DRIVER_ID] = 0;
                emptyReport[dbSchema.REPORT_COLUMNS.REPORT_TYPE] = '';
                return new Report(emptyReport);
            }

            const result = await this._protectedGetById(reportId);
            if (!result) {
                console.warn(`Warning: No data found for reportId ${reportId}`);
                const emptyReport = {};
                emptyReport[dbSchema.REPORT_COLUMNS.REPORT_ID] = 0;
                emptyReport[dbSchema.REPORT_COLUMNS.REPORT_DRIVER_ID] = 0;
                emptyReport[dbSchema.REPORT_COLUMNS.REPORT_TYPE] = '';
                return new Report(emptyReport);
            }
            return Report.fromDatabase(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            const emptyReport = {};
            emptyReport[dbSchema.REPORT_COLUMNS.REPORT_ID] = 0;
            emptyReport[dbSchema.REPORT_COLUMNS.REPORT_DRIVER_ID] = 0;
            emptyReport[dbSchema.REPORT_COLUMNS.REPORT_TYPE] = '';
            return new Report(emptyReport);
        }
    }

    /**
     * Get reports by multiple IDs
     * @param {number[]} reportIds
     * @return {Promise<Report[]>} 
     * @memberof ReportDAO
     */
    async getByReportIds(reportIds) {
        if (!Array.isArray(reportIds) || reportIds.length === 0) {
            console.warn(`Warning: reportIds must be a non-empty array`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], reportIds,
                `WHERE ${this.primaryKeyName} IN (${reportIds.map(() => '?').join(', ')})`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No reports found for provided reportIds`);
                return [];
            }
            return results.map(row => Report.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get reports by driver ID
     * @param {number} driverId
     * @return {Promise<Report[]>} 
     * @memberof ReportDAO
     */
    async getByDriverId(driverId) {
        if (driverId === null || driverId === undefined || !Number.isInteger(driverId)) {
            console.warn(`Warning: driverId is invalid : ${driverId}`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [driverId],
                `WHERE ${dbSchema.REPORT_COLUMNS.REPORT_DRIVER_ID} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No reports found for driverId ${driverId}`);
                return [];
            }
            return results.map(row => Report.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get reports by report type
     * @param {string} reportType - 'start_pickup', 'picked_up', 'late', 'dropped_off', 'warning'
     * @return {Promise<Report[]>} 
     * @memberof ReportDAO
     */
    async getByReportType(reportType) {
        if (!reportType || typeof reportType !== 'string' || reportType.trim() === '') {
            console.warn(`Warning: reportType is invalid : ${reportType}`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [reportType],
                `WHERE ${dbSchema.REPORT_COLUMNS.REPORT_TYPE} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No reports found for reportType ${reportType}`);
                return [];
            }
            return results.map(row => Report.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get reports by time range
     * @param {Date} startTime
     * @param {Date} endTime
     * @return {Promise<Report[]>} 
     * @memberof ReportDAO
     */
    async getByTimeRange(startTime, endTime) {
        if (!(startTime instanceof Date) || !(endTime instanceof Date)) {
            console.warn(`Warning: Invalid startTime or endTime`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [startTime, endTime],
                `WHERE ${dbSchema.REPORT_COLUMNS.REPORT_TIME} BETWEEN ? AND ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No reports found between ${startTime} and ${endTime}`);
                return [];
            }
            return results.map(row => Report.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get reports by driver and type
     * @param {number} driverId
     * @param {string} reportType
     * @return {Promise<Report[]>} 
     * @memberof ReportDAO
     */
    async getByDriverIdAndType(driverId, reportType) {
        if (!Number.isInteger(driverId) || !reportType) {
            console.warn(`Warning: Invalid driverId or reportType`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [driverId, reportType],
                `WHERE ${dbSchema.REPORT_COLUMNS.REPORT_DRIVER_ID} = ? AND ${dbSchema.REPORT_COLUMNS.REPORT_TYPE} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No reports found for driverId ${driverId} and reportType ${reportType}`);
                return [];
            }
            return results.map(row => Report.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Create a new report
     * @param {Report} report
     * @return {Promise<number>} The report_id or -1 if failed
     * @memberof ReportDAO
     */
    async createReport(report) {
        if (!(report instanceof Report)) {
            console.warn(`Warning: Invalid report object`);
            return -1;
        }

        try {
            const result = await this._protectedCreate(report);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Create multiple reports
     * @param {Report[]} reports
     * @return {Promise<number|number[]>} Number of affected rows or array of IDs, or -1 if failed
     * @memberof ReportDAO
     */
    async createReports(reports) {
        if (!Array.isArray(reports) || reports.length === 0) {
            console.warn(`Warning: reports must be a non-empty array`);
            return -1;
        }

        try {
            const valueInserts = reports.map(report => ({
                [dbSchema.REPORT_COLUMNS.REPORT_DRIVER_ID]: report.report_driver_id,
                [dbSchema.REPORT_COLUMNS.REPORT_TIME]: report.report_time,
                [dbSchema.REPORT_COLUMNS.REPORT_TYPE]: report.report_type,
                [dbSchema.REPORT_COLUMNS.REPORT_CONTENT]: report.report_content
            }));
            const results = await this._protectedMultiCreate([
                dbSchema.REPORT_COLUMNS.REPORT_DRIVER_ID,
                dbSchema.REPORT_COLUMNS.REPORT_TIME,
                dbSchema.REPORT_COLUMNS.REPORT_TYPE,
                dbSchema.REPORT_COLUMNS.REPORT_CONTENT
            ], valueInserts);
            return results;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Private method to update a single report
     * @param {Report} report
     * @return {Promise<number>} Number of affected rows or -1 if failed
     * @memberof ReportDAO
     */
    async #updateReport(report) {
        if (!report) {
            console.warn(`Warning: Invalid report: ${report}`);
            return -1;
        }
        try {
            const result = await this._protectedUpdateById(report[dbSchema.REPORT_COLUMNS.REPORT_ID], report);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Private method to update multiple reports
     * @param {Report[]} reports
     * @return {Promise<number>} Number of affected rows or -1 if failed
     * @memberof ReportDAO
     */
    async #updateReports(reports) {
        if (!Array.isArray(reports) || reports.length === 0) {
            console.warn(`Warning: reports must be a non-empty array`);
            return -1;
        }

        try {
            const result = await this._protectedMultiUpdateById(reports);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update report type
     * @param {number} reportId
     * @param {string} newType
     * @return {Promise<number>} Number of affected rows or -1 if failed
     * @memberof ReportDAO
     */
    async updateReportType(reportId, newType) {
        if (!reportId || !Number.isInteger(reportId)) {
            console.warn(`Warning: Invalid reportId`);
            return -1;
        }

        if (!newType || typeof newType !== 'string') {
            console.warn(`Warning: Invalid newType`);
            return -1;
        }

        try {
            const result = await this.getByReportId(reportId);
            if (!result || !result.report_id) {
                console.warn(`Warning: No report found for reportId ${reportId}`);
                return -1;
            }
            if (result.report_type === newType) {
                console.info(`Info: Report type is already '${newType}' for reportId ${reportId}`);
                return 0;
            }
            result.report_type = newType;
            return await this.#updateReport(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update report content
     * @param {number} reportId
     * @param {string} newContent
     * @return {Promise<number>} Number of affected rows or -1 if failed
     * @memberof ReportDAO
     */
    async updateReportContent(reportId, newContent) {
        if (!reportId || !Number.isInteger(reportId)) {
            console.warn(`Warning: Invalid reportId`);
            return -1;
        }

        try {
            const result = await this.getByReportId(reportId);
            if (!result || !result.report_id) {
                console.warn(`Warning: No report found for reportId ${reportId}`);
                return -1;
            }
            if (result.report_content === newContent) {
                console.info(`Info: Report content is already '${newContent}' for reportId ${reportId}`);
                return 0;
            }
            result.report_content = newContent;
            return await this.#updateReport(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update report types of multiple reports
     * @param {Array<{report_id: number, report_type: string}>} reports - Plain objects with snake_case properties
     * @return {Promise<number>} Number of affected rows or -1 if failed
     * @memberof ReportDAO
     */
    async updateReportTypes(reports) {
        if (!Array.isArray(reports) || reports.length === 0) {
            console.warn(`Warning: reports must be a non-empty array`);
            return -1;
        }
        try {
            const formattedReports = reports.map(report => {
                const obj = {};
                obj[dbSchema.REPORT_COLUMNS.REPORT_ID] = report.report_id;
                obj[dbSchema.REPORT_COLUMNS.REPORT_TYPE] = report.report_type;
                obj[dbSchema.REPORT_COLUMNS.REPORT_DRIVER_ID] = 0; // Placeholder
                return new Report(obj);
            });
            return await this.#updateReports(formattedReports);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update report contents of multiple reports
     * @param {Array<{report_id: number, report_content: string}>} reports - Plain objects with snake_case properties
     * @return {Promise<number>} Number of affected rows or -1 if failed
     * @memberof ReportDAO
     */
    async updateReportContents(reports) {
        if (!Array.isArray(reports) || reports.length === 0) {
            console.warn(`Warning: reports must be a non-empty array`);
            return -1;
        }
        try {
            const formattedReports = reports.map(report => {
                const obj = {};
                obj[dbSchema.REPORT_COLUMNS.REPORT_ID] = report.report_id;
                obj[dbSchema.REPORT_COLUMNS.REPORT_CONTENT] = report.report_content;
                obj[dbSchema.REPORT_COLUMNS.REPORT_DRIVER_ID] = 0; // Placeholder
                obj[dbSchema.REPORT_COLUMNS.REPORT_TYPE] = ''; // Placeholder
                return new Report(obj);
            });
            return await this.#updateReports(formattedReports);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Delete report by ID
     * @param {number} reportId
     * @return {Promise<number>} Number of affected rows or -1 if failed
     * @memberof ReportDAO
     */
    async deleteReport(reportId) {
        if (!reportId || !Number.isInteger(reportId)) {
            console.warn(`Warning: Invalid reportId`);
            return -1;
        }

        try {
            const result = await this._protectedDeleteById(reportId);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Delete multiple reports by IDs
     * @param {number[]} reportIds
     * @return {Promise<number>} Number of affected rows or -1 if failed
     * @memberof ReportDAO
     */
    async deleteReports(reportIds) {
        if (!Array.isArray(reportIds) || reportIds.length === 0) {
            console.warn(`Warning: reportIds must be a non-empty array`);
            return -1;
        }

        try {
            const result = await this._protectedDeleteByIds(reportIds);
            return result;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Delete all reports by driver ID
     * @param {number} driverId
     * @return {Promise<number>} Number of affected rows or -1 if failed
     * @memberof ReportDAO
     */
    async deleteByDriverId(driverId) {
        if (!driverId || !Number.isInteger(driverId)) {
            console.warn(`Warning: Invalid driverId`);
            return -1;
        }

        try {
            const reports = await this.getByDriverId(driverId);
            if (reports.length === 0) {
                console.warn(`Warning: No reports found for driverId ${driverId}`);
                return 0;
            }
            const reportIds = reports.map(r => r.report_id);
            return await this.deleteReports(reportIds);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }
}

import { default as ReportDAO } from "../infrastructure/data/reportDAO.js";
import { Report } from "../index.js";
import { withConnection, withTransaction } from "../infrastructure/connection/transactionHelper.js";

/**
 * ReportServices
 * Service layer for managing reports
 */
class ReportServices {
    /**
     * Get all reports
     * @return {Promise<{success: boolean, data?: Report[], error?: string}>}
     */
    async getAllReports() {
        try {
            const results = await withConnection(async (connection) => {
                const repo = new ReportDAO(connection);
                return await repo.getAllReports();
            });

            return {
                success: true,
                data: results
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get report by ID
     * @param {number} reportId
     * @return {Promise<{success: boolean, data?: Report, error?: string}>}
     */
    async getByReportId(reportId) {
        try {
            if (!reportId || !Number.isInteger(reportId)) {
                return {
                    success: false,
                    error: 'Invalid reportId'
                };
            }

            const result = await withConnection(async (connection) => {
                const repo = new ReportDAO(connection);
                return await repo.getByReportId(reportId);
            });

            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get reports by multiple IDs
     * @param {number[]} reportIds
     * @return {Promise<{success: boolean, data?: Report[], error?: string}>}
     */
    async getByReportIds(reportIds) {
        try {
            if (!Array.isArray(reportIds) || reportIds.length === 0) {
                return {
                    success: false,
                    error: 'Invalid reportIds array'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new ReportDAO(connection);
                return await repo.getByReportIds(reportIds);
            });

            return {
                success: true,
                data: results
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get reports by driver ID
     * @param {number} driverId
     * @return {Promise<{success: boolean, data?: Report[], error?: string}>}
     */
    async getByDriverId(driverId) {
        try {
            if (!driverId || !Number.isInteger(driverId)) {
                return {
                    success: false,
                    error: 'Invalid driverId'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new ReportDAO(connection);
                return await repo.getByDriverId(driverId);
            });

            return {
                success: true,
                data: results
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get reports by report type
     * @param {string} reportType - 'start_pickup', 'picked_up', 'late', 'dropped_off', 'warning'
     * @return {Promise<{success: boolean, data?: Report[], error?: string}>}
     */
    async getByReportType(reportType) {
        try {
            if (!reportType || typeof reportType !== 'string') {
                return {
                    success: false,
                    error: 'Invalid reportType'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new ReportDAO(connection);
                return await repo.getByReportType(reportType);
            });

            return {
                success: true,
                data: results
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get reports by time range
     * @param {Date} startTime
     * @param {Date} endTime
     * @return {Promise<{success: boolean, data?: Report[], error?: string}>}
     */
    async getByTimeRange(startTime, endTime) {
        try {
            if (!(startTime instanceof Date) || !(endTime instanceof Date)) {
                return {
                    success: false,
                    error: 'Invalid startTime or endTime'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new ReportDAO(connection);
                return await repo.getByTimeRange(startTime, endTime);
            });

            return {
                success: true,
                data: results
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get reports by driver and type
     * @param {number} driverId
     * @param {string} reportType
     * @return {Promise<{success: boolean, data?: Report[], error?: string}>}
     */
    async getByDriverIdAndType(driverId, reportType) {
        try {
            if (!driverId || !Number.isInteger(driverId)) {
                return {
                    success: false,
                    error: 'Invalid driverId'
                };
            }

            if (!reportType || typeof reportType !== 'string') {
                return {
                    success: false,
                    error: 'Invalid reportType'
                };
            }

            const results = await withConnection(async (connection) => {
                const repo = new ReportDAO(connection);
                return await repo.getByDriverIdAndType(driverId, reportType);
            });

            return {
                success: true,
                data: results
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create a new report
     * @param {Report} report
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async createReport(report) {
        try {
            if (!(report instanceof Report)) {
                return {
                    success: false,
                    error: 'Invalid report object'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new ReportDAO(connection);
                return await repo.createReport(report);
            });

            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to create report'
                };
            }

            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create multiple reports
     * @param {Report[]} reports
     * @return {Promise<{success: boolean, data?: number|number[], error?: string}>}
     */
    async createReports(reports) {
        try {
            if (!Array.isArray(reports) || reports.length === 0) {
                return {
                    success: false,
                    error: 'Invalid reports array'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new ReportDAO(connection);
                return await repo.createReports(reports);
            });

            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to create reports'
                };
            }

            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Update report type
     * @param {number} reportId
     * @param {string} newType
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateReportType(reportId, newType) {
        try {
            if (!reportId || !Number.isInteger(reportId)) {
                return {
                    success: false,
                    error: 'Invalid reportId'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new ReportDAO(connection);
                return await repo.updateReportType(reportId, newType);
            });

            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update report type'
                };
            }

            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Update report content
     * @param {number} reportId
     * @param {string} newContent
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateReportContent(reportId, newContent) {
        try {
            if (!reportId || !Number.isInteger(reportId)) {
                return {
                    success: false,
                    error: 'Invalid reportId'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new ReportDAO(connection);
                return await repo.updateReportContent(reportId, newContent);
            });

            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update report content'
                };
            }

            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Update report types of multiple reports
     * @param {Array<{report_id: number, report_type: string}>} reports
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateReportTypes(reports) {
        try {
            if (!Array.isArray(reports) || reports.length === 0) {
                return {
                    success: false,
                    error: 'Invalid reports array'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new ReportDAO(connection);
                return await repo.updateReportTypes(reports);
            });

            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update report types'
                };
            }

            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Update report contents of multiple reports
     * @param {Array<{report_id: number, report_content: string}>} reports
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async updateReportContents(reports) {
        try {
            if (!Array.isArray(reports) || reports.length === 0) {
                return {
                    success: false,
                    error: 'Invalid reports array'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new ReportDAO(connection);
                return await repo.updateReportContents(reports);
            });

            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to update report contents'
                };
            }

            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Delete report by ID
     * @param {number} reportId
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async deleteReport(reportId) {
        try {
            if (!reportId || !Number.isInteger(reportId)) {
                return {
                    success: false,
                    error: 'Invalid reportId'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new ReportDAO(connection);
                return await repo.deleteReport(reportId);
            });

            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to delete report'
                };
            }

            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Delete multiple reports by IDs
     * @param {number[]} reportIds
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async deleteReports(reportIds) {
        try {
            if (!Array.isArray(reportIds) || reportIds.length === 0) {
                return {
                    success: false,
                    error: 'Invalid reportIds array'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new ReportDAO(connection);
                return await repo.deleteReports(reportIds);
            });

            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to delete reports'
                };
            }

            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Delete all reports by driver ID
     * @param {number} driverId
     * @return {Promise<{success: boolean, data?: number, error?: string}>}
     */
    async deleteByDriverId(driverId) {
        try {
            if (!driverId || !Number.isInteger(driverId)) {
                return {
                    success: false,
                    error: 'Invalid driverId'
                };
            }

            const result = await withTransaction(async (connection) => {
                const repo = new ReportDAO(connection);
                return await repo.deleteByDriverId(driverId);
            });
            if (result === -1) {
                return {
                    success: false,
                    error: 'Failed to delete reports by driverId'
                };
            }

            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default ReportServices;
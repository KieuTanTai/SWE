// backend/services/driverPickupTrackingService.js

import PickupScheduleDAO from "../infrastructure/data/pickupScheduleDAO.js";
import ReportDAO from "../infrastructure/data/reportDAO.js";
import Report from "../models/Report.js";
import dbSchema, { isValidEnum } from "../infrastructure/data/dbSchema.js";
import { withConnection, withTransaction } from "../infrastructure/connection/transactionHelper.js";

const { REPORT_COLUMNS, REPORT_TYPE } = dbSchema;

class DriverPickupTrackingService {
    /**
     * Lấy danh sách học sinh cho 1 trip (detailScheduleId)
     * 👉 PHẦN NÀY: nếu bạn đã có code cũ chạy đúng (đang trả về JSON như bạn gửi),
     * hãy giữ nguyên code cũ của bạn trong hàm này.
     */
    async getPickupListForTrip(detailScheduleId) {
        if (!Number.isInteger(detailScheduleId) || detailScheduleId <= 0) {
            return { success: false, error: "Invalid detailScheduleId" };
        }

        try {
            // 🔴 GỢI Ý: nếu hiện tại bạn đang dùng raw SQL join ở đây, cứ giữ nguyên.
            // Ví dụ:
            // return await withConnection(async (connection) => {
            //   const [rows] = await connection.execute(`SELECT ... FROM ... WHERE ps.pickup_schedule_detail_id = ?`, [detailScheduleId]);
            //   return { success: true, data: rows };
            // });

            const data = await withConnection(async (connection) => {
                const pickupDao = new PickupScheduleDAO(connection);
                const rows = await pickupDao.getStudentListForDetailSchedule(detailScheduleId);

                return rows.map((r) => ({
                    pickupScheduleId: r.pickup_schedule_id,
                    detailScheduleId: r.pickup_schedule_detail_id,
                    studentId: r.pickup_schedule_student_id,

                    studentName: r.student_name,
                    parentPhone: r.parent_phone ?? null,
                    studentAddress: r.parent_address ?? null,

                    status: r.latest_status ?? null,
                    lastReportTime: r.latest_report_time ?? null,
                    lastNote: r.latest_note ?? null,
                }));
            });

            return { success: true, data };

        } catch (error) {
            console.error("[DriverPickupTrackingService.getPickupListForTrip] Error:", error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Tạo report trạng thái đón/trả học sinh
     * - Nhận accountId từ token
     * - Map accountId -> driver_person_id qua Person + Driver
     *
     * @param {number} accountId      // account_id từ JWT
     * @param {Object} payload
     * @param {number} payload.pickupScheduleId
     * @param {number} payload.detailScheduleId
     * @param {number} payload.studentId
     * @param {string} payload.status  // start_pickup | picked_up | late | dropped_off | warning
     * @param {string} [payload.note]
     */
    async createPickupStatusReport(accountId, payload) {
        const {
            pickupScheduleId,
            detailScheduleId,
            studentId,
            status,
            note = "",
        } = payload || {};

        // --- VALIDATE CƠ BẢN ---
        if (!Number.isInteger(accountId) || accountId <= 0) {
            throw new Error("Invalid accountId");
        }
        if (!Number.isInteger(pickupScheduleId) || pickupScheduleId <= 0) {
            throw new Error("Invalid pickupScheduleId");
        }
        if (!Number.isInteger(detailScheduleId) || detailScheduleId <= 0) {
            throw new Error("Invalid detailScheduleId");
        }
        if (!Number.isInteger(studentId) || studentId <= 0) {
            throw new Error("Invalid studentId");
        }

        if (!isValidEnum(REPORT_COLUMNS.REPORT_TYPE, status)) {
            throw new Error(
                `Invalid status. Must be one of: ${Object.values(REPORT_TYPE).join(", ")}`
            );
        }

        return await withTransaction(async (connection) => {
            const pickupDao = new PickupScheduleDAO(connection);
            const reportDao = new ReportDAO(connection);

            // 1️⃣ MAP account_id -> driver_person_id
            const [rows] = await connection.execute(
                `
                SELECT d.driver_person_id
                FROM Person p
                JOIN Driver d
                  ON d.driver_person_id = p.person_id
                WHERE p.person_account_id = ?
                  AND p.person_type = 'driver'
                LIMIT 1;
                `,
                [accountId]
            );

            const driverPersonId = rows[0]?.driver_person_id;

            if (!driverPersonId) {
                throw new Error(
                    "Không tìm thấy driver tương ứng với account hiện tại"
                );
            }

            // 2️⃣ Kiểm tra pickup schedule
            const pickup = await pickupDao.getByPickupScheduleId(pickupScheduleId);

            if (!pickup || !pickup.pickup_schedule_id) {
                throw new Error(`Pickup schedule not found for id=${pickupScheduleId}`);
            }
            if (pickup.pickup_schedule_detail_id !== detailScheduleId) {
                throw new Error(
                    `detailScheduleId mismatch: DB=${pickup.pickup_schedule_detail_id}, input=${detailScheduleId}`
                );
            }
            if (pickup.pickup_schedule_student_id !== studentId) {
                throw new Error(
                    `studentId mismatch: DB=${pickup.pickup_schedule_student_id}, input=${studentId}`
                );
            }

            // 3️⃣ Tạo đối tượng Report với driverPersonId ĐÚNG
            const now = new Date();

            const report = new Report({
                report_driver_id: driverPersonId,   // 👈 đây mới là driver_person_id
                report_time: now,
                report_type: status,
                report_content: JSON.stringify({
                    pickupScheduleId,
                    detailScheduleId,
                    studentId,
                    note,
                }),
            });

            // Nếu model Report có validate
            if (typeof report.validate === "function") {
                const errors = report.validate();
                if (errors && errors.length > 0) {
                    throw new Error(`Report validation failed: ${errors.join("; ")}`);
                }
            }

            // 4️⃣ Lưu report
            const insertResult = await reportDao.createReports([report]);
            if (insertResult === -1) {
                throw new Error("Create report failed");
            }

            return {
                reportTime: now.toISOString(),
                pickupScheduleId,
                detailScheduleId,
                studentId,
                driverPersonId,
                status,
                note,
            };
        });
    }

    /**
     * Tạo REPORT cho CHUYẾN (bắt đầu / kết thúc / báo cáo sự cố)
     * @param {number} accountId
     * @param {{ detailScheduleId: number, type: string, note?: string }} payload
     *   type: start_pickup | dropped_off | warning
     */
    async createTripReport(accountId, payload) {
        const { detailScheduleId, type, note = "" } = payload || {};

        // --- VALIDATE CƠ BẢN ---
        if (!Number.isInteger(accountId) || accountId <= 0) {
            throw new Error("Invalid accountId");
        }
        if (!Number.isInteger(detailScheduleId) || detailScheduleId <= 0) {
            throw new Error("Invalid detailScheduleId");
        }

        // validate enum type (dùng chung REPORT_TYPE)
        if (!isValidEnum(REPORT_COLUMNS.REPORT_TYPE, type)) {
            throw new Error(
                `Invalid type. Must be one of: ${Object.values(REPORT_TYPE).join(", ")}`
            );
        }

        return await withTransaction(async (connection) => {
            const reportDao = new ReportDAO(connection);

            // 1️⃣ MAP account_id -> driver_person_id
            const [rows] = await connection.execute(
                `
            SELECT d.driver_person_id
            FROM Person p
            JOIN Driver d
              ON d.driver_person_id = p.person_id
            WHERE p.person_account_id = ?
              AND p.person_type = 'driver'
            LIMIT 1;
            `,
                [accountId]
            );

            const driverPersonId = rows[0]?.driver_person_id;

            if (!driverPersonId) {
                throw new Error(
                    "Không tìm thấy driver tương ứng với account hiện tại"
                );
            }

            // 2️⃣ Tạo report
            const now = new Date();

            const report = new Report({
                report_driver_id: driverPersonId,
                report_time: now,
                report_type: type,      // start_pickup | dropped_off | warning
                report_content: JSON.stringify({
                    detailScheduleId,
                    note,
                }),
            });

            // 3️⃣ Lưu report
            const insertResult = await reportDao.createReports([report]);
            if (insertResult === -1) {
                throw new Error("Create report failed");
            }

            return {
                reportTime: now.toISOString(),
                detailScheduleId,
                driverPersonId,
                type,
                note,
            };
        });
    }

}

export default new DriverPickupTrackingService();

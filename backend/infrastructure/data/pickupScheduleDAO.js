import PickupSchedule from "../../models/PickupSchedule.js";
import { default as BaseDAO } from "./baseDAO.js";
import dbSchema from "./dbSchema.js";
import mySql from "mysql2/promise"

export default class PickupScheduleDAO extends BaseDAO {

    /**
     * Creates an instance of PickupScheduleDAO.
     * @param {mySql.PoolConnection} connection
     * @memberof PickupScheduleDAO
     */
    constructor(connection) {
        super(connection, "Pickup_Schedule", dbSchema.PICKUP_SCHEDULE_COLUMNS.PICKUP_SCHEDULE_ID);
    }

    /**
     * Get all pickup schedules
     * @return {Promise<PickupSchedule[]>}
     * @memberof PickupScheduleDAO
     */
    async getAllPickupSchedules() {
        try {
            const results = await this._protectedGetAll();
            if (!results || results.length === 0) {
                console.warn(`Warning: No pickup schedules found`);
                return [];
            }
            return results.map(row => PickupSchedule.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get pickup schedule by ID
     * @param {number} pickupScheduleId
     * @return {Promise<PickupSchedule>}
     * @memberof PickupScheduleDAO
     */
    async getByPickupScheduleId(pickupScheduleId) {
        if (pickupScheduleId === null || pickupScheduleId === undefined || !Number.isInteger(pickupScheduleId)) {
            console.warn(`Warning: pickupScheduleId is invalid : ${pickupScheduleId}`);
            return new PickupSchedule();
        }

        try {
            if (pickupScheduleId <= 0) {
                console.warn(`Warning: pickupScheduleId must be greater than zero : ${pickupScheduleId}`);
                return new PickupSchedule();
            }

            const result = await this._protectedGetById(pickupScheduleId);
            if (!result) {
                console.warn(`Warning: No data found for pickupScheduleId ${pickupScheduleId}`);
                return new PickupSchedule();
            }
            return PickupSchedule.fromDatabase(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return new PickupSchedule();
        }
    }

    /**
     * Get pickup schedules by multiple IDs
     * @param {number[]} pickupScheduleIds
     * @return {Promise<PickupSchedule[]>}
     * @memberof PickupScheduleDAO
     */
    async getByPickupScheduleIds(pickupScheduleIds) {
        if (!Array.isArray(pickupScheduleIds) || pickupScheduleIds.length === 0) {
            console.warn(`Warning: pickupScheduleIds must be a non-empty array`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], pickupScheduleIds,
                `WHERE ${this.primaryKeyName} IN (${pickupScheduleIds.map(() => '?').join(', ')})`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No pickup schedules found for provided pickupScheduleIds`);
                return [];
            }
            return results.map(row => PickupSchedule.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get pickup schedules by detail schedule ID
     * @param {number} detailScheduleId
     * @return {Promise<PickupSchedule[]>}
     * @memberof PickupScheduleDAO
     */
    async getByDetailScheduleId(detailScheduleId) {
        if (detailScheduleId === null || detailScheduleId === undefined || !Number.isInteger(detailScheduleId)) {
            console.warn(`Warning: detailScheduleId is invalid : ${detailScheduleId}`);
            return [];
        }

        try {
            if (detailScheduleId <= 0) {
                console.warn(`Warning: detailScheduleId must be greater than zero : ${detailScheduleId}`);
                return [];
            }

            const results = await this._protectedGetBySelection(["*"], [detailScheduleId],
                `WHERE ${dbSchema.PICKUP_SCHEDULE_COLUMNS.PICKUP_SCHEDULE_DETAIL_ID} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No pickup schedules found for detailScheduleId ${detailScheduleId}`);
                return [];
            }
            return results.map(row => PickupSchedule.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get pickup schedules by student ID
     * @param {number} studentId
     * @return {Promise<PickupSchedule[]>}
     * @memberof PickupScheduleDAO
     */
    async getByStudentId(studentId) {
        if (studentId === null || studentId === undefined || !Number.isInteger(studentId)) {
            console.warn(`Warning: studentId is invalid : ${studentId}`);
            return [];
        }

        try {
            if (studentId <= 0) {
                console.warn(`Warning: studentId must be greater than zero : ${studentId}`);
                return [];
            }

            const results = await this._protectedGetBySelection(["*"], [studentId],
                `WHERE ${dbSchema.PICKUP_SCHEDULE_COLUMNS.PICKUP_SCHEDULE_STUDENT_ID} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No pickup schedules found for studentId ${studentId}`);
                return [];
            }
            return results.map(row => PickupSchedule.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Create new pickup schedule
     * @param {PickupSchedule} pickupSchedule
     * @return {Promise<number>} insertId or -1 if failed
     * @memberof PickupScheduleDAO
     */
    async createPickupSchedule(pickupSchedule) {

        try {
            const data = {
                [dbSchema.PICKUP_SCHEDULE_COLUMNS.PICKUP_SCHEDULE_DETAIL_ID]: pickupSchedule.pickup_schedule_detail_id,
                [dbSchema.PICKUP_SCHEDULE_COLUMNS.PICKUP_SCHEDULE_STUDENT_ID]: pickupSchedule.pickup_schedule_student_id
            };

            const insertId = await this._protectedCreate(data);
            if (insertId <= 0) {
                console.error('Error: Failed to create pickup schedule');
                return -1;
            }
            return insertId;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update pickup schedule
     * @param {number} pickupScheduleId
     * @param {PickupSchedule} pickupSchedule
     * @return {Promise<number>} affected rows or -1 if failed
     * @memberof PickupScheduleDAO
     */
    async updatePickupSchedule(pickupScheduleId, pickupSchedule) {
        if (pickupScheduleId === null || pickupScheduleId === undefined || !Number.isInteger(pickupScheduleId)) {
            console.error('Error: pickupScheduleId is invalid');
            return -1;
        }

        if (pickupScheduleId <= 0) {
            console.error('Error: pickupScheduleId must be greater than zero');
            return -1;
        }

        if (!(pickupSchedule instanceof PickupSchedule)) {
            console.error('Error: pickupSchedule must be an instance of PickupSchedule');
            return -1;
        }

        try {
            const data = {
                [dbSchema.PICKUP_SCHEDULE_COLUMNS.PICKUP_SCHEDULE_DETAIL_ID]: pickupSchedule.pickup_schedule_detail_id,
                [dbSchema.PICKUP_SCHEDULE_COLUMNS.PICKUP_SCHEDULE_STUDENT_ID]: pickupSchedule.pickup_schedule_student_id
            };

            const affectedRows = await this._protectedUpdateById(pickupScheduleId, data);
            if (affectedRows <= 0) {
                console.warn(`Warning: No pickup schedule updated for pickupScheduleId ${pickupScheduleId}`);
                return -1;
            }
            return affectedRows;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Delete pickup schedule
     * @param {number} pickupScheduleId
     * @return {Promise<number>} affected rows or -1 if failed
     * @memberof PickupScheduleDAO
     */
    async deletePickupSchedule(pickupScheduleId) {
        if (pickupScheduleId === null || pickupScheduleId === undefined || !Number.isInteger(pickupScheduleId)) {
            console.error('Error: pickupScheduleId is invalid');
            return -1;
        }

        if (pickupScheduleId <= 0) {
            console.error('Error: pickupScheduleId must be greater than zero');
            return -1;
        }

        try {
            const affectedRows = await this._protectedDeleteById(pickupScheduleId);
            if (affectedRows <= 0) {
                console.warn(`Warning: No pickup schedule deleted for pickupScheduleId ${pickupScheduleId}`);
                return -1;
            }
            return affectedRows;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Lấy danh sách học sinh + thông tin địa chỉ cho 1 detailScheduleId
     * Dùng cho màn tracking của driver.
     *
     * @param {number} detailScheduleId
     * @return {Promise<any[]>}
     */
    async getStudentListForDetailSchedule(detailScheduleId) {
        if (
            detailScheduleId === null ||
            detailScheduleId === undefined ||
            !Number.isInteger(detailScheduleId)
        ) {
            console.warn(`Warning: detailScheduleId is invalid : ${detailScheduleId}`);
            return [];
        }

        if (detailScheduleId <= 0) {
            console.warn(
                `Warning: detailScheduleId must be greater than zero : ${detailScheduleId}`
            );
            return [];
        }

        try {
            const sql = `
                SELECT ps.${dbSchema.PICKUP_SCHEDULE_COLUMNS.PICKUP_SCHEDULE_ID}         AS pickup_schedule_id,
                       ps.${dbSchema.PICKUP_SCHEDULE_COLUMNS.PICKUP_SCHEDULE_DETAIL_ID}  AS pickup_schedule_detail_id,
                       ps.${dbSchema.PICKUP_SCHEDULE_COLUMNS.PICKUP_SCHEDULE_STUDENT_ID} AS pickup_schedule_student_id,

                       s.student_id                                                      AS student_id,
                       sp.person_name                                                    AS student_name,

                       -- Lấy SĐT phụ huynh từ Person (cha mẹ)
                       pp.person_phone                                                   AS parent_phone,

                       CONCAT_WS(', ',
                                 addr.address_number,
                                 ward.location_ward_name,
                                 district.location_district_name,
                                 city.location_city_name
                       )                                                                 AS parent_address
                FROM Pickup_Schedule ps
                         JOIN Student s
                              ON s.student_id = ps.${dbSchema.PICKUP_SCHEDULE_COLUMNS.PICKUP_SCHEDULE_STUDENT_ID}
                    -- Person của học sinh
                         JOIN Person sp
                              ON sp.person_id = s.student_person_id
                    -- Parent: liên kết học sinh -> phụ huynh
                         LEFT JOIN Parent pa
                                   ON pa.parent_person_id = s.student_parent_id
                    -- Person của phụ huynh (để lấy phone)
                         LEFT JOIN Person pp
                                   ON pp.person_id = pa.parent_person_id
                         LEFT JOIN Address addr
                                   ON addr.address_id = pa.parent_address_id
                         LEFT JOIN Location_Ward ward
                                   ON ward.location_ward_id = addr.address_ward_id
                         LEFT JOIN Location_District district
                                   ON district.location_district_id = addr.address_district_id
                         LEFT JOIN Location_City city
                                   ON city.location_city_id = addr.address_city_id
                WHERE ps.${dbSchema.PICKUP_SCHEDULE_COLUMNS.PICKUP_SCHEDULE_DETAIL_ID} = ?
            `;

            const [rows] = await this.connection.execute(sql, [detailScheduleId]);
            if (!rows || rows.length === 0) {
                console.warn(
                    `Warning: No student pickup found for detailScheduleId ${detailScheduleId}`
                );
                return [];
            }

            return rows;
        } catch (error) {
            console.error(
                `[PickupScheduleDAO.getStudentListForDetailSchedule] Error: ${error.message}`
            );
            return [];
        }
    }
}


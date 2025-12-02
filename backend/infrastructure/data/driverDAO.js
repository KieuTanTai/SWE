import Driver from "../../models/Driver.js";
import { default as BaseDAO } from "./baseDAO.js";
import dbSchema from "./dbSchema.js";

export default class DriverDAO extends BaseDAO {
    
    constructor(connection) {
        super(connection, "Driver", dbSchema.DRIVER_COLUMNS.DRIVER_PERSON_ID);
    }

    _mapRowToDriver(row) {
        const driver = new Driver({
            driver_person_id: row.driver_person_id,
            driver_experience: row.driver_experience,
            driver_experience_type: row.driver_experience_type,
            driver_late_arrival_count: row.driver_late_arrival_count
        });

        if (row.person_name) {
            driver.person = {
                person_id: row.driver_person_id,
                person_name: row.person_name,
                person_phone: row.person_phone,
                person_gender: row.person_gender,
                person_birthday: row.person_birthday,
                person_life_cycle_status: row.person_life_cycle_status,
                person_email: row.account_email
            };
        }
        return driver;
    }

    async getAllDrivers() {
        try {
            const query = `
                SELECT 
                    d.*, 
                    p.person_name, p.person_phone, p.person_gender, p.person_birthday, p.person_life_cycle_status,
                    a.account_email
                FROM Driver d
                JOIN Person p ON d.driver_person_id = p.person_id
                LEFT JOIN Account a ON p.person_account_id = a.account_id
            `;

            /** @type {[any[], any]} */
            const [rows] = await this.connection.execute(query);

            if (!rows || rows.length === 0) {
                return [];
            }
            
            return rows.map(row => this._mapRowToDriver(row));
        } catch (error) {
            console.error(`Error getAllDrivers: ${error.message}`);
            return [];
        }
    }

    async getByDriverPersonId(driverPersonId) {
        if (!driverPersonId) return new Driver();

        try {
            const query = `
                SELECT 
                    d.*, 
                    p.person_name, p.person_phone, p.person_gender, p.person_birthday, p.person_life_cycle_status,
                    a.account_email
                FROM Driver d
                JOIN Person p ON d.driver_person_id = p.person_id
                LEFT JOIN Account a ON p.person_account_id = a.account_id
                WHERE d.driver_person_id = ?
            `;

            // FIX LỖI LENGTH: Ép kiểu
            /** @type {[any[], any]} */
            const [rows] = await this.connection.execute(query, [driverPersonId]);

            if (!rows || rows.length === 0) {
                return new Driver();
            }
            return this._mapRowToDriver(rows[0]);
        } catch (error) {
            console.error(`Error getByDriverPersonId: ${error.message}`);
            return new Driver();
        }
    }

    async createDriver(driver) {
        if (!(driver instanceof Driver)) return -1;
        try {
            return await this._protectedCreate(driver);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    async updateExperience(driverId, experience, type) {
        try {
            const query = `UPDATE Driver SET driver_experience = ?, driver_experience_type = ? WHERE driver_person_id = ?`;
            
            // FIX LỖI AFFECTEDROWS: Ép kiểu result
            /** @type {[any, any]} */
            const [result] = await this.connection.execute(query, [experience, type, driverId]);
            
            // Kiểm tra affectedRows an toàn hơn
            return (result && result.affectedRows > 0) ? driverId : -1;
        } catch (error) {
            return -1;
        }
    }

    async deleteDriver(driverId) {
        try {
            const query = `UPDATE Person SET person_life_cycle_status = 0 WHERE person_id = ?`;
            
            // FIX LỖI AFFECTEDROWS: Ép kiểu result
            /** @type {[any, any]} */
            const [result] = await this.connection.execute(query, [driverId]);
            
            return (result && result.affectedRows > 0) ? driverId : -1;
        } catch (error) {
            console.error(`Error deleteDriver: ${error.message}`);
            return -1;
        }
    }
}
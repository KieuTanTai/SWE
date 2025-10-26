import { Person } from "../../index.js";
import { default as BaseDAO } from "./baseDAO.js";
import dbSchema from "./dbSchema.js";
import mySql from "mysql2/promise"

export default class PersonDAO extends BaseDAO {
    
    /**
     * Creates an instance of PersonDAO.
     * @param {mySql.PoolConnection} connection
     * @memberof PersonDAO
     */
    constructor(connection) {
        super(connection, "Person", dbSchema.PERSON_COLUMNS.PERSON_ID);
    }

    /**
     * Get all persons
     * @return {Promise<Person[]>} 
     * @memberof PersonDAO
     */
    async getAllPersons() {
        try {
            const results = await this._protectedGetAll();
            if (!results || results.length === 0) {
                console.warn(`Warning: No persons found`);
                return [];
            }
            return results.map(row => Person.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get person by ID
     * @param {number} personId
     * @return {Promise<Person>} 
     * @memberof PersonDAO
     */
    async getByPersonId(personId) {
        if (personId === null || personId === undefined || !Number.isInteger(personId)) {
            console.warn(`Warning: personId is invalid : ${personId}`);
            return new Person();
        }

        try {
            if (personId <= 0) {
                console.warn(`Warning: personId must be greater than zero : ${personId}`);
                return new Person();
            }

            const result = await this._protectedGetById(personId);
            if (!result) {
                console.warn(`Warning: No data found for personId ${personId}`);
                return new Person();
            }
            return Person.fromDatabase(result);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return new Person();
        }
    }

    /**
     * Get persons by multiple IDs
     * @param {number[]} personIds
     * @return {Promise<Person[]>} 
     * @memberof PersonDAO
     */
    async getByPersonIds(personIds) {
        if (!Array.isArray(personIds) || personIds.length === 0) {
            console.warn(`Warning: personIds must be a non-empty array`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], personIds,
                `WHERE ${this.primaryKeyName} IN (${personIds.map(() => '?').join(', ')})`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No persons found for provided personIds`);
                return [];
            }
            return results.map(row => Person.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get person by account ID
     * @param {number} accountId
     * @return {Promise<Person>} 
     * @memberof PersonDAO
     */
    async getByAccountId(accountId) {
        if (accountId === null || accountId === undefined || !Number.isInteger(accountId)) {
            console.warn(`Warning: accountId is invalid : ${accountId}`);
            return new Person();
        }

        try {
            if (accountId <= 0) {
                console.warn(`Warning: accountId must be greater than zero : ${accountId}`);
                return new Person();
            }

            const results = await this._protectedGetBySelection(["*"], [accountId],
                `WHERE ${dbSchema.PERSON_COLUMNS.PERSON_ACCOUNT_ID} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No person found for accountId ${accountId}`);
                return new Person();
            }
            return results.map(row => Person.fromDatabase(row))[0];
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return new Person();
        }
    }

    /**
     * Get persons by phone number
     * @param {string} phone
     * @return {Promise<Person[]>} 
     * @memberof PersonDAO
     */
    async getByPhone(phone) {
        if (!phone || typeof phone !== 'string' || phone.trim() === '') {
            console.warn(`Warning: phone is invalid : ${phone}`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [phone],
                `WHERE ${dbSchema.PERSON_COLUMNS.PERSON_PHONE} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No persons found for phone ${phone}`);
                return [];
            }
            return results.map(row => Person.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get persons by name (partial match)
     * @param {string} name
     * @return {Promise<Person[]>} 
     * @memberof PersonDAO
     */
    async getByName(name) {
        if (!name || typeof name !== 'string' || name.trim() === '') {
            console.warn(`Warning: name is invalid : ${name}`);
            return [];
        }

        try {
            const likePattern = `%${name}%`;
            const results = await this._protectedGetBySelection(["*"], [likePattern],
                `WHERE ${dbSchema.PERSON_COLUMNS.PERSON_NAME} LIKE ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No persons found matching name ${name}`);
                return [];
            }
            return results.map(row => Person.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get persons by type
     * @param {string} personType
     * @return {Promise<Person[]>} 
     * @memberof PersonDAO
     */
    async getByType(personType) {
        if (!personType || typeof personType !== 'string' || personType.trim() === '') {
            console.warn(`Warning: personType is invalid : ${personType}`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [personType],
                `WHERE ${dbSchema.PERSON_COLUMNS.PERSON_TYPE} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No persons found for type ${personType}`);
                return [];
            }
            return results.map(row => Person.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get persons by gender
     * @param {string} gender
     * @return {Promise<Person[]>} 
     * @memberof PersonDAO
     */
    async getByGender(gender) {
        if (!gender || typeof gender !== 'string' || gender.trim() === '') {
            console.warn(`Warning: gender is invalid : ${gender}`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [gender],
                `WHERE ${dbSchema.PERSON_COLUMNS.PERSON_GENDER} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No persons found for gender ${gender}`);
                return [];
            }
            return results.map(row => Person.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Get persons by lifecycle status
     * @param {boolean} status
     * @return {Promise<Person[]>} 
     * @memberof PersonDAO
     */
    async getByLifecycleStatus(status) {
        if (typeof status !== 'boolean') {
            console.warn(`Warning: status must be boolean`);
            return [];
        }

        try {
            const results = await this._protectedGetBySelection(["*"], [status],
                `WHERE ${dbSchema.PERSON_COLUMNS.PERSON_LIFE_CYCLE_STATUS} = ?`);
            if (!results || results.length === 0) {
                console.warn(`Warning: No persons found for lifecycle status ${status}`);
                return [];
            }
            return results.map(row => Person.fromDatabase(row));
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return [];
        }
    }

    /**
     * Create new person
     * @param {Person} person
     * @return {Promise<number>} insertId or -1 if failed
     * @memberof PersonDAO
     */
    async createPerson(person) {
        if (!(person instanceof Person)) {
            console.error('Error: person must be an instance of Person');
            return -1;
        }

        try {
            const data = {
                [dbSchema.PERSON_COLUMNS.PERSON_ACCOUNT_ID]: person.person_account_id,
                [dbSchema.PERSON_COLUMNS.PERSON_PHONE]: person.person_phone,
                [dbSchema.PERSON_COLUMNS.PERSON_NAME]: person.person_name,
                [dbSchema.PERSON_COLUMNS.PERSON_GENDER]: person.person_gender,
                [dbSchema.PERSON_COLUMNS.PERSON_BIRTHDAY]: person.person_birthday,
                [dbSchema.PERSON_COLUMNS.PERSON_TYPE]: person.person_type,
                [dbSchema.PERSON_COLUMNS.PERSON_LIFE_CYCLE_STATUS]: person.person_life_cycle_status
            };

            const insertId = await this._protectedCreate(data);
            if (insertId <= 0) {
                console.error('Error: Failed to create person');
                return -1;
            }
            return insertId;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Update person
     * @param {number} personId
     * @param {Person} person
     * @return {Promise<number>} affected rows or -1 if failed
     * @memberof PersonDAO
     */
    async updatePerson(personId, person) {
        if (personId === null || personId === undefined || !Number.isInteger(personId)) {
            console.error('Error: personId is invalid');
            return -1;
        }

        if (personId <= 0) {
            console.error('Error: personId must be greater than zero');
            return -1;
        }

        if (!(person instanceof Person)) {
            console.error('Error: person must be an instance of Person');
            return -1;
        }

        try {
            const data = {
                [dbSchema.PERSON_COLUMNS.PERSON_ACCOUNT_ID]: person.person_account_id,
                [dbSchema.PERSON_COLUMNS.PERSON_PHONE]: person.person_phone,
                [dbSchema.PERSON_COLUMNS.PERSON_NAME]: person.person_name,
                [dbSchema.PERSON_COLUMNS.PERSON_GENDER]: person.person_gender,
                [dbSchema.PERSON_COLUMNS.PERSON_BIRTHDAY]: person.person_birthday,
                [dbSchema.PERSON_COLUMNS.PERSON_TYPE]: person.person_type,
                [dbSchema.PERSON_COLUMNS.PERSON_LIFE_CYCLE_STATUS]: person.person_life_cycle_status
            };

            const affectedRows = await this._protectedUpdateById(personId, data);
            if (affectedRows <= 0) {
                console.warn(`Warning: No person updated for personId ${personId}`);
                return -1;
            }
            return affectedRows;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }

    /**
     * Delete person
     * @param {number} personId
     * @return {Promise<number>} affected rows or -1 if failed
     * @memberof PersonDAO
     */
    async deletePerson(personId) {
        if (personId === null || personId === undefined || !Number.isInteger(personId)) {
            console.error('Error: personId is invalid');
            return -1;
        }

        if (personId <= 0) {
            console.error('Error: personId must be greater than zero');
            return -1;
        }

        try {
            const affectedRows = await this._protectedDeleteById(personId);
            if (affectedRows <= 0) {
                console.warn(`Warning: No person deleted for personId ${personId}`);
                return -1;
            }
            return affectedRows;
        } catch (error) {
            console.error(`Error: ${error.message}`);
            return -1;
        }
    }
}

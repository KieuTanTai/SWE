import mysql from 'mysql2/promise';
import BaseGetDAO from './baseGetDAO.js';
class BaseDAO extends BaseGetDAO {
    /**
     * Creates an instance of BaseDAO.
     * @param {mysql.PoolConnection} connection
     * @param {string} tableName
     * @param {string} [primaryKeyName='id']
     * @memberof BaseDAO
     */

    constructor(connection, tableName, primaryKeyName = 'id'){
        super(connection, tableName, primaryKeyName);
    }

    /**
     *
     *
     * @param {*} data
     * @return {Promise<string|number>} InsertId or -1 if failed
     * @memberof BaseDAO
     */
    async _protectedCreate(data) {
        try {
            if (typeof data !== 'object' || data === null || Array.isArray(data)) {
                console.error('Error: data must be a non-null object');
                return -1;
            }
            
            const columns = Object.keys(data);
            const values = Object.values(data);

            if (columns.length === 0) {
                console.error('Error: No columns to insert');
                return -1;
            }

            if (values.length === 0) {
                console.error('Error: No values to insert');
                return -1;
            }

            const sql = this._protectedGetCreateQueryString(columns);
            this.connection.beginTransaction();
            const [result] = await this.connection.execute(sql, values);

            if (result && typeof result === 'object' && 'insertId' in result) {
                this.connection.commit();
                return result.insertId;
            }
            this.connection.rollback();
            return -1;
        } catch (exception) {
            this.connection.rollback();
            if (exception instanceof Error)
                console.error(`Error: ${exception.message}`);
            else
                console.error(`Exception: ${exception}`);
            return -1;
        }
    }

    /**
     *
     *
     * @param {string[]} arrayColumns
     * @param {Array<Object>} arrayValues
     * @return {Promise<number>} 
     * @memberof BaseDAO
     */
    async _protectedMultiCreate(arrayColumns, arrayValues) {
        try {
            if (!Array.isArray(arrayValues) || arrayValues.length === 0) {
                console.error('Error: arrayValues must be a non-empty array');
                return -1;
            }

            const query = this._protectedGetMultiCreateQueryString(arrayColumns, arrayValues.length);
            this.connection.beginTransaction();
            arrayValues = arrayValues.flatMap(Object.values);
            const [results] = await this.connection.execute(query, arrayValues);

            if (results && typeof results === 'object' && 'affectedRows' in results) {
                this.connection.commit();
                return results.affectedRows;
            }
            this.connection.rollback();
            return -1;
        } catch (error) {
            this.connection.rollback();
            if (error instanceof Error)
                console.error(`Error: ${error.message}`);
            else
                console.error(`Exception: ${error}`);
            return -1;
        }
    }

    /**
     *
     *
     * @param {string|number} id
     * @param {*} data
     * @return {Promise<number>} Number of affected rows or -1 if failed
     * @memberof BaseDAO
     */
    async _protectedUpdateById(id, data) {
        try {
            if (id === null || id === undefined) {
                console.error('Error: id must be provided');
                return -1;
            }
            if (typeof data !== 'object' || data === null || Array.isArray(data)) {
                console.error('Error: data must be a non-null object');
                return -1;
            }
            
            const columns = Object.keys(data);
            const values = Object.values(data);

            if (columns.length === 0) {
                console.error('Error: No columns to update');
                return -1;
            }

            if (values.length === 0) {
                console.error('Error: No values to update');
                return -1;
            }

            const sql = this._protectedGetUpdateByIdQueryString(columns);
            this.connection.beginTransaction();
            values.push(id);
            const [result] = await this.connection.execute(sql, values);

            if (result && typeof result === 'object' && 'affectedRows' in result) {
                this.connection.commit();
                return result.affectedRows;
            }
            this.connection.rollback();
            return -1;
        } catch (exception) {
            this.connection.rollback();
            if (exception instanceof Error)
                console.error(`Error: ${exception.message}`);
            else
                console.error(`Exception: ${exception}`);
            return -1;
        }
    }

    /**
     *
     *
     * @param {Array<{[key: string]: any}>} arrayValues
     * @return {Promise<number>} Number of affected rows or -1 if failed
     * @memberof BaseDAO
     */
    async _protectedMultiUpdateById(arrayValues) {
        try {
            if (!Array.isArray(arrayValues) || arrayValues.length === 0) {
                console.error('Error: arrayValues must be a non-empty array');
                return -1;
            }

            const listIds = arrayValues.map(item => item[this.primaryKeyName]);
            const columns = Object.keys(arrayValues[0]).filter(col => col !== this.primaryKeyName);
            if (columns.length === 0) {
                console.error('Error: No columns to update');
                return -1;
            }

            if (listIds.length === 0) {
                console.error('Error: No IDs provided');
                return -1;
            }

            const query = this._protectedGetMultiUpdateByIdQueryString(columns, arrayValues.length);
            this.connection.beginTransaction();

            const values = [];
            arrayValues.forEach(item => {
                columns.forEach(col => {
                    values.push(item[this.primaryKeyName]);
                    values.push(item[col]);
                });
            });
            values.push(listIds);
            
            const [results] = await this.connection.execute(query, values);
            if (results && typeof results === 'object' && 'affectedRows' in results) {
                this.connection.commit();
                return results.affectedRows;
            }
            this.connection.rollback();
            return -1;  
        } catch (error) {
            this.connection.rollback();
            if (error instanceof Error)
                console.error(`Error: ${error.message}`);
            else
                console.error(`Exception: ${error}`);
            return -1;
        }
    }

    /**
     * Generate INSERT query string
     * @param {string[]} columns - Array of column names
     * @return { string} containing query string
     * @memberof BaseDAO
     */
    _protectedGetCreateQueryString(columns) {
        const placeholders = columns.map(() => '?').join(', ');
        return `INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
    }

    /**
     *
     *
     * @param {string[]} columns
     * @param {number} numberOfRows
     * @return {string} 
     * @memberof BaseDAO
     */
    _protectedGetMultiCreateQueryString(columns, numberOfRows) {
        const placeholders = columns.map(() => '?').join(', ');
        const allPlaceholders = Array(numberOfRows).fill(`(${placeholders})`).join(', ');
        return `INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES ${allPlaceholders}`;
    }

    /**
     * Generate UPDATE query string with WHERE clause
     * @param {string[]} setColumns - array of column names to update
     * @param {string[]} whereColumns - array of column names for WHERE clause
     * @return {string} query string with placeholders
     * @memberof BaseDAO
     */
    _protectedGetUpdateQueryString(setColumns, whereColumns) {
        const setClause = setColumns.map(col => `${col} = ?`).join(', ');
        const whereClause = whereColumns.map(col => `${col} = ?`).join(' AND ');
        
        return `UPDATE ${this.tableName} SET ${setClause} WHERE ${whereClause}`;
    }

    /**
     * Generate UPDATE query string by primary key
     * @param {string[]} setColumns - array of column names to update
     * @return {string} query string with placeholders
     * @memberof BaseDAO
     */
    _protectedGetUpdateByIdQueryString(setColumns) {
        const setClause = setColumns.map(col => `${col} = ?`).join(', ');
        
        return `UPDATE ${this.tableName} SET ${setClause} WHERE ${this.primaryKeyName} = ?`;
    }

    /**
     *
     *
     * @param {string[]} setColumns
     * @param {number} numberOfRows
     * @return {string}
     * @memberof BaseDAO
     */
    _protectedGetMultiUpdateByIdQueryString(setColumns, numberOfRows) {
        const setClause = setColumns.map(col => `${col} = CASE`).join(', ');
        const whenClause = Array(numberOfRows).fill(`WHEN ${this.primaryKeyName} = ? THEN ?`).join(' ');
        return `UPDATE ${this.tableName} SET ${setClause} ${whenClause} END WHERE ${this.primaryKeyName} IN (?)`;
    }

    /**
     * Generate DELETE query string with WHERE clause
     * @param {string[]} whereColumns - array of column names for WHERE clause
     * @return {string} query string with placeholders
     * @memberof BaseDAO
     */
    _protectedGetDeleteQueryString(whereColumns) {
        const whereClause = whereColumns.map(col => `${col} = ?`).join(' AND ');
        
        return `DELETE FROM ${this.tableName} WHERE ${whereClause}`;
    }

    /**
     * Generate DELETE query string by primary key
     * @return {string} Object containing query string and values array
     * @memberof BaseDAO
     */
    _protectedGetDeleteByIdQueryString() {
        return `DELETE FROM ${this.tableName} WHERE ${this.primaryKeyName} = ?`;
    }
}

export default BaseDAO;
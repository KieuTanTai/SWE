import mysql from 'mysql2/promise';

class BaseDAO {

    
    /**
     * Creates an instance of BaseDAO.
     * @param {mysql.PoolConnection} connection
     * @param {string} tableName
     * @param {string} [primaryKeyName='id']
     * @memberof BaseDAO
     */

    constructor(connection, tableName, primaryKeyName = 'id') {
        this.connection = connection;
        this.tableName = tableName;
        this.primaryKeyName = primaryKeyName;
    }

    /**
     *
     * @return {Promise<Array>} 
     * @memberof BaseDAO
     */
    async getAll() {
        try {
            const sql = `select * from ${this.tableName}`;
            let [results] = await this.connection.query(sql);
            if (!Array.isArray(results))
                return [];
            return results;
        } catch (exception) {
            if (exception instanceof Error)
                console.error(`Error: ${exception.message}`);
            else
                console.error(`Exception: ${exception}`);
            return [];
        }
    }

    
    /**
     *
     *
     * @param {string|number} id
     * @memberof BaseDAO
     */
    async getById(id) {
        try {
            const sql = `select * from ${this.tableName} where ${this.primaryKeyName} = ?`
        } catch (exception) {
            console.log(exception.message);
        }
    } 

    /**
     *
     *
     * @param {string} [selectString="*"]
     * @return {string} 
     * @memberof BaseDAO
     */
    getGetAllQuery(selectString = "*") {
        return `select ${selectString} from ${this.tableName}`;
    }

    
    /**
     *
     *
     * @param {string} [selectString="*"]
     * @return {string} 
     * @memberof BaseDAO
     */
    getByIdQuery(selectString = "*") {
        return `select ${selectString} from ${this.tableName} where ${this.primaryKeyName} = ?`;
    }

    
    /**
     *
     *
     * @param {string} [selectString="*"]
     * @param {string} [whereClause=""]
     * @return {string} 
     * @memberof BaseDAO
     */
    getBySelectionQuery(selectString = "*", whereClause = "") {
        return `select ${selectString} from ${this.tableName} ${whereClause}`;
    }

    /**
     * Generate INSERT query string
     * @param {JSON} data - Object with column names as keys
     * @return {Object} Object containing query string and values array
     * @memberof BaseDAO
     */
    getCreateQueryString(data) {
        const columns = Object.keys(data);
        const placeholders = columns.map(() => '?').join(', ');
        const values = Object.values(data);
        
        const query = `INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
        
        return {
            query,
            values
        };
    }

    /**
     * Generate UPDATE query string with WHERE clause
     * @param {JSON} data - Object with column names to update as keys
     * @param {Object} whereConditions - Object with WHERE conditions
     * @return {Object} Object containing query string and values array
     * @memberof BaseDAO
     */
    getUpdateQueryString(data, whereConditions) {
        const setColumns = Object.keys(data);
        const setClause = setColumns.map(col => `${col} = ?`).join(', ');
        const setValues = Object.values(data);
        
        const whereColumns = Object.keys(whereConditions);
        const whereClause = whereColumns.map(col => `${col} = ?`).join(' AND ');
        const whereValues = Object.values(whereConditions);
        
        const query = `UPDATE ${this.tableName} SET ${setClause} WHERE ${whereClause}`;
        const values = [...setValues, ...whereValues];
        
        return {
            query,
            values
        };
    }

    /**
     * Generate UPDATE query string by primary key
     * @param {JSON} data - Object with column names to update as keys
     * @param {string|number} id - Primary key value
     * @return {Object} Object containing query string and values array
     * @memberof BaseDAO
     */
    getUpdateByIdQueryString(data, id) {
        return this.getUpdateQueryString(data, { [this.primaryKeyName]: id });
    }

    /**
     * Generate DELETE query string with WHERE clause
     * @param {Object} whereConditions - Object with WHERE conditions
     * @return {Object} Object containing query string and values array
     * @memberof BaseDAO
     */
    getDeleteQueryString(whereConditions) {
        const whereColumns = Object.keys(whereConditions);
        const whereClause = whereColumns.map(col => `${col} = ?`).join(' AND ');
        const values = Object.values(whereConditions);
        
        const query = `DELETE FROM ${this.tableName} WHERE ${whereClause}`;
        
        return {
            query,
            values
        };
    }

    /**
     * Generate DELETE query string by primary key
     * @return {string} Object containing query string and values array
     * @memberof BaseDAO
     */
    getDeleteByIdQueryString() {
        return `DELETE FROM ${this.tableName} WHERE ${this.primaryKeyName} = ?`;
    }
}

export default BaseDAO;
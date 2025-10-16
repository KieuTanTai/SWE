import mysql from 'mysql2/promise';
export default class BaseGetDAO {
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
            const sql = this.getAllQuery();
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
            if (id === null || id === undefined) {
                console.error('Error: id must be provided');
                return null;
            }
            
            const sql = this.getByIdQuery();
            let [results] = await this.connection.query(sql, [id]);
            if (!Array.isArray(results) || results.length === 0)
                return null;
            return results[0];
        } catch (exception) {
            if (exception instanceof Error)
                console.error(`Error: ${exception.message}`);
            else
                console.error(`Exception: ${exception}`);
            return null;
        }
    } 

    /**
     *
     *
     * @param {string} [whereClause=""]
     * @param {*} [params=[]]
     * @return {Promise<Array>} 
     * @memberof BaseDAO
     */
    async getBySelection(selectColumns = ["*"], params = [], whereClause = "") {
        try {
            if (!Array.isArray(selectColumns) || selectColumns.length === 0) {
                console.error('Error: selectColumns must be a non-empty array');
                return [];
            }

            const sql = this.getBySelectionQuery(selectColumns, whereClause);
            let [results] = await this.connection.query(sql, params);
            if (!Array.isArray(results) || results.length === 0)
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
     * @param {string[]} [selectColumns=["*"]]
     * @return {string} 
     * @memberof BaseDAO
     */
    getAllQuery(selectColumns = ["*"]) {
        return `select ${selectColumns.join(", ")} from ${this.tableName}`;
    }

    /**
     *
     *
     * @param {string[]} [selectColumns=["*"]]
     * @return {string} 
     * @memberof BaseDAO
     */
    getByIdQuery(selectColumns = ["*"]) {
        return `select ${selectColumns.join(", ")} from ${this.tableName} where ${this.primaryKeyName} = ?`;
    }

    
    /**
     *
     *
     * @param {string[]} [selectColumns="*"]
     * @param {string} [whereClause=""]
     * @return {string} 
     * @memberof BaseDAO
     */
    getBySelectionQuery(selectColumns = ["*"], whereClause = "") {
        return `select ${selectColumns.join(", ")} from ${this.tableName} ${whereClause}`;
    }
}
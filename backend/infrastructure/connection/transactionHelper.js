import { getConnection } from './dbConnection.js';

/**
 * Execute a callback with a database connection
 * Automatically releases the connection when done
 * @param {Function} callback - Async function that receives connection as parameter
 * @returns {Promise<any>} Result from callback
 */
export async function withConnection(callback) {
    let connection = null;
    try {
        connection = await getConnection();
        return await callback(connection);
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

/**
 * Execute a callback within a database transaction
 * Automatically begins transaction, commits on success, rollbacks on error, and releases connection
 * @param {Function} callback - Async function that receives connection as parameter
 * @returns {Promise<any>} Result from callback
 */
export async function withTransaction(callback) {
    let connection = null;
    try {
        connection = await getConnection();
        await connection.beginTransaction();
        
        const result = await callback(connection);
        
        await connection.commit();
        return result;
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

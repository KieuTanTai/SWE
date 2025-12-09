/**
 * Shared Database Connection Instance
 * Singleton pattern for database connection across the application
 */
import Connection from './getConnection.js';

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(process.cwd(), 'env.development.json');

console.log('Looking for config at:', configPath);
console.log('File exists:', fs.existsSync(configPath));

const dbConnection = new Connection(configPath);
let connectionPool = null;

/**
 * Get connection pool (creates if not exists)
 * @returns {Promise<import('mysql2/promise').Pool>}
 */
export const getConnectionPool = async () => {
    if (!connectionPool) {
        connectionPool = await dbConnection.connect();
    }
    return connectionPool;
};

/**
 * Get a connection from the pool
 * @returns {Promise<import('mysql2/promise').PoolConnection>}
 */
export const getConnection = async () => {
    const pool = await getConnectionPool();
    return await pool.getConnection();
};

/**
 * Close the connection pool
 * @returns {Promise<void>}
 */
export const closeConnection = async () => {
    if (connectionPool) {
        await dbConnection.close();
        connectionPool = null;
    }
};

export default dbConnection;

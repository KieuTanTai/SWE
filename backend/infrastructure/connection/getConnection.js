import fs from 'fs';
import mysql from 'mysql2/promise';

class Connection {
    constructor(configPath, connectionName = 'DefaultConnection') {
        this.configPath = configPath;
        this.connectionName = connectionName;
        this.pool = null;
        this.config = null;
    }

    readConfig() {
        try {
            if (!fs.existsSync(this.configPath)) {
                throw new Error(`Configuration file not found: ${this.configPath}`);
            }

            const rawData = fs.readFileSync(this.configPath, 'utf8');
            const json = JSON.parse(rawData);

            if (!json.ConnectionStrings) {
                throw new Error('ConnectionStrings section not found in configuration file');
            }

            if (!json.ConnectionStrings[this.connectionName]) {
                throw new Error(`Connection name "${this.connectionName}" not found in configuration file`);
            }

            this.config = json.ConnectionStrings[this.connectionName];
            return this.config;
        } catch (error) {
            throw new Error(`Failed to read configuration: ${error.message}`);
        }
    }

    parseConnectionString(connectionString) {
        const config = {};
        const parts = connectionString.split(';').filter(p => p.trim());

        parts.forEach(part => {
            const [key, value] = part.split('=').map(s => s.trim());
            switch (key.toLowerCase()) {
                case 'server':
                    config.host = value;
                    break;
                case 'database':
                    config.database = value;
                    break;
                case 'user':
                    config.user = value;
                    break;
                case 'password':
                    config.password = value;
                    break;
                case 'charset':
                    config.charset = value;
                    break;
                case 'minimumpoolsize':
                    config.connectionLimit = parseInt(value, 10);
                    break;
                case 'maximumpoolsize':
                    config.connectionLimit = parseInt(value, 10);
                    break;
                case 'connectiontimeout':
                    config.connectTimeout = parseInt(value, 10) * 1000; // Convert to milliseconds
                    break;
            }
        });

        return config;
    }

    async connect() {
        try {
            if (this.pool) {
                console.log('Connection pool already exists, reusing...');
                return this.pool;
            }

            // Read configuration
            const connectionString = this.readConfig();

            // Parse connection string
            const dbConfig = this.parseConnectionString(connectionString);

            // Create connection pool
            this.pool = mysql.createPool({
                host: dbConfig.host || 'localhost',
                user: dbConfig.user,
                password: dbConfig.password,
                database: dbConfig.database,
                waitForConnections: true,
                connectionLimit: dbConfig.connectionLimit || 10,
                queueLimit: 0,
                enableKeepAlive: true,
                keepAliveInitialDelay: 0,
                charset: dbConfig.charset || 'utf8mb4',
                connectTimeout: dbConfig.connectTimeout || 30000
            });

            // Test connection
            const connection = await this.pool.getConnection();
            console.log(`✓ Database connected successfully to ${dbConfig.database}`);
            connection.release();

            return this.pool;
        } catch (error) {
            throw new Error(`Failed to connect to database: ${error.message}`);
        }
    }

    async getConnection() {
        if (!this.pool) {
            await this.connect();
        }
        return await this.pool.getConnection();
    }

    async query(sql, params = []) {
        if (!this.pool) {
            await this.connect();
        }
        try {
            const [rows] = await this.pool.execute(sql, params);
            return rows;
        } catch (error) {
            throw new Error(`Query execution failed: ${error.message}`);
        }
    }

    async close() {
        if (this.pool) {
            try {
                await this.pool.end();
                this.pool = null;
                console.log('✓ Database connection pool closed successfully');
            } catch (error) {
                throw new Error(`Failed to close connection pool: ${error.message}`);
            }
        }
    }

    static getInstance(configPath, connectionName = 'DefaultConnection') {
        return new Connection(configPath, connectionName);
    }

    static async getConnection(configPath, connectionName = 'DefaultConnection') {
        const instance = new Connection(configPath, connectionName);
        return await instance.connect();
    }
}

export default Connection;

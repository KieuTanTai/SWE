import Connection from '../getConnection.js';
const connection = new Connection('./config.json');

class ParentDAO {
  constructor() {
    this.tableName = 'parent'; // 🔧 đổi đúng tên bảng trong DB của bạn
  }

  async getAll() {
    const pool = await connection.connect();
    const [rows] = await pool.query(`SELECT * FROM ${this.tableName}`);
    return rows;
  }

  async getById(id) {
    const pool = await connection.connect();
    const [rows] = await pool.query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
    return rows[0] || null;
  }

  async insert(data) {
    const pool = await connection.connect();
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(', ');

    const sql = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`;

    // ✅ Khai báo kiểu rõ ràng để TypeScript hiểu đúng
    /** @type {[import('mysql2').ResultSetHeader, any]} */
    const [result] = await pool.query(sql, values);

    return { id: result.insertId, ...data };
  }

  async update(id, data) {
    const pool = await connection.connect();
    const columns = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), id];
    const sql = `UPDATE ${this.tableName} SET ${columns} WHERE id = ?`;

    /** @type {[import('mysql2').ResultSetHeader, any]} */
    const [result] = await pool.query(sql, values);

    return result.affectedRows > 0;
  }

  async delete(id) {
    const pool = await connection.connect();
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;

    /** @type {[import('mysql2').ResultSetHeader, any]} */
    const [result] = await pool.query(sql, [id]);

    return result.affectedRows > 0;
  }
}

export default new ParentDAO();

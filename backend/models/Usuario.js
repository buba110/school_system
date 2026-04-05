const db = require('../config/db');
const bcrypt = require('bcryptjs');

class Usuario {
  static async findByEmail(email) {
    const [rows] = await db.query(
      `SELECT u.*, r.nombre as rol_nombre 
       FROM usuarios u 
       JOIN roles r ON u.rol_id = r.id 
       WHERE u.email = ?`,
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.query(
      `SELECT u.*, r.nombre as rol_nombre 
       FROM usuarios u 
       JOIN roles r ON u.rol_id = r.id 
       WHERE u.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
}

module.exports = Usuario;
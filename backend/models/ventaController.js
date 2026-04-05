const db = require('../config/db');

class CorteCaja {
  static async abrir(usuario_id, monto_apertura) {
    const [result] = await db.query(
      `INSERT INTO cortes_caja (usuario_id, fecha_apertura, monto_apertura, estado)
       VALUES (?, NOW(), ?, 'abierto')`,
      [usuario_id, monto_apertura || 0]
    );
    return result.insertId;
  }

  static async obtenerAbierto() {
    const [rows] = await db.query(
      `SELECT * FROM cortes_caja WHERE estado = 'abierto' ORDER BY id DESC LIMIT 1`
    );
    return rows[0];
  }

  static async cerrar(corteId, monto_cierre, total_ventas, total_colegiaturas) {
    const [result] = await db.query(
      `UPDATE cortes_caja SET fecha_cierre = NOW(), monto_cierre = ?, total_ventas = ?, total_colegiaturas = ?, estado = 'cerrado'
       WHERE id = ?`,
      [monto_cierre, total_ventas, total_colegiaturas, corteId]
    );
    return result.affectedRows;
  }
}

module.exports = CorteCaja;
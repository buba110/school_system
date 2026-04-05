const db = require('../config/db');

class MovimientoInventario {
  static async registrar(producto_id, tipo, cantidad, motivo, usuario_id) {
    const [result] = await db.query(
      `INSERT INTO movimientos_inventario (producto_id, tipo, cantidad, motivo, usuario_id)
       VALUES (?, ?, ?, ?, ?)`,
      [producto_id, tipo, cantidad, motivo, usuario_id]
    );
    return result.insertId;
  }

  static async listar(filtros = {}) {
    let query = `
      SELECT m.*, p.nombre as producto_nombre, u.nombre_completo as usuario_nombre
      FROM movimientos_inventario m
      JOIN productos p ON m.producto_id = p.id
      JOIN usuarios u ON m.usuario_id = u.id
    `;
    const conditions = [];
    const params = [];
    if (filtros.producto) {
      conditions.push('p.nombre LIKE ?');
      params.push(`%${filtros.producto}%`);
    }
    if (filtros.tipo) {
      conditions.push('m.tipo = ?');
      params.push(filtros.tipo);
    }
    if (filtros.fecha) {
      conditions.push('DATE(m.fecha) = ?');
      params.push(filtros.fecha);
    }
    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY m.fecha DESC';
    const [rows] = await db.query(query, params);
    return rows;
  }
}

module.exports = MovimientoInventario;
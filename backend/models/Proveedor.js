const db = require('../config/db');

class Proveedor {
  static async listar() {
    const [rows] = await db.query('SELECT * FROM proveedores ORDER BY nombre');
    return rows;
  }

  static async crear(data) {
    const { nombre, contacto, telefono, email, direccion } = data;
    const [result] = await db.query(
      'INSERT INTO proveedores (nombre, contacto, telefono, email, direccion) VALUES (?, ?, ?, ?, ?)',
      [nombre, contacto, telefono, email, direccion]
    );
    return result.insertId;
  }

  static async actualizar(id, data) {
    const { nombre, contacto, telefono, email, direccion } = data;
    const [result] = await db.query(
      'UPDATE proveedores SET nombre=?, contacto=?, telefono=?, email=?, direccion=? WHERE id=?',
      [nombre, contacto, telefono, email, direccion, id]
    );
    return result.affectedRows;
  }

  static async eliminar(id) {
    const [result] = await db.query('DELETE FROM proveedores WHERE id=?', [id]);
    return result.affectedRows;
  }
}

module.exports = Proveedor;
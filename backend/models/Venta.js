const db = require('../config/db');

class Venta {
  static async crear(ventaData, detalles) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      const { folio, total, metodo_pago, usuario_id } = ventaData;
      const [result] = await connection.query(
        'INSERT INTO ventas (folio, total, metodo_pago, usuario_id) VALUES (?, ?, ?, ?)',
        [folio, total, metodo_pago, usuario_id]
      );
      const ventaId = result.insertId;
      for (const detalle of detalles) {
        await connection.query(
          'INSERT INTO detalles_venta (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
          [ventaId, detalle.producto_id, detalle.cantidad, detalle.precio_unitario, detalle.subtotal]
        );
        await connection.query('UPDATE productos SET stock = stock - ? WHERE id = ?', [detalle.cantidad, detalle.producto_id]);
        await connection.query(
          `INSERT INTO movimientos_inventario (producto_id, tipo, cantidad, motivo, usuario_id)
           VALUES (?, 'salida', ?, 'venta', ?)`,
          [detalle.producto_id, detalle.cantidad, usuario_id]
        );
      }
      await connection.commit();
      return ventaId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async obtenerPorId(id) {
    const [venta] = await db.query('SELECT * FROM ventas WHERE id = ?', [id]);
    if (venta.length === 0) return null;
    const [detalles] = await db.query(
      `SELECT dv.*, p.nombre as producto_nombre
       FROM detalles_venta dv
       JOIN productos p ON dv.producto_id = p.id
       WHERE dv.venta_id = ?`,
      [id]
    );
    return { ...venta[0], detalles };
  }
}

module.exports = Venta;
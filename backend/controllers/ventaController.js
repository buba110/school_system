const db = require('../config/db');
const CorteCaja = require('../models/CorteCaja');
const Venta = require('../models/Venta');

async function generarFolio() {
  const [rows] = await db.query("SELECT COUNT(*) as total FROM ventas");
  const num = (rows[0].total + 1).toString().padStart(5, '0');
  return `V-${num}`;
}

exports.realizarVenta = async (req, res) => {
  // ... (código ya entregado, no lo repito por brevedad, pero debe estar completo)
};

exports.ultimaVenta = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM ventas WHERE usuario_id = ? ORDER BY fecha DESC LIMIT 1', [req.user.id]);
    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.anularVenta = async (req, res) => {
  const { id } = req.params;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [venta] = await connection.query('SELECT anulada FROM ventas WHERE id = ?', [id]);
    if (venta.length === 0) return res.status(404).json({ message: 'Venta no encontrada' });
    if (venta[0].anulada) return res.status(400).json({ message: 'Venta ya anulada' });
    const [detalles] = await connection.query('SELECT producto_id, cantidad FROM detalles_venta WHERE venta_id = ?', [id]);
    for (const det of detalles) {
      await connection.query('UPDATE productos SET stock = stock + ? WHERE id = ?', [det.cantidad, det.producto_id]);
      await connection.query(
        `INSERT INTO movimientos_inventario (producto_id, tipo, cantidad, motivo, usuario_id)
         VALUES (?, 'entrada', ?, 'anulación de venta', ?)`,
        [det.producto_id, det.cantidad, req.user.id]
      );
    }
    await connection.query('UPDATE ventas SET anulada = TRUE WHERE id = ?', [id]);
    await connection.commit();
    res.json({ message: 'Venta anulada y stock restaurado' });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    connection.release();
  }
};
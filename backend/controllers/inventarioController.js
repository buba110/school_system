const db = require('../config/db');
const MovimientoInventario = require('../models/MovimientoInventario');

exports.listarMovimientos = async (req, res) => {
  try {
    const movimientos = await MovimientoInventario.listar(req.query);
    res.json(movimientos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.registrarMovimiento = async (req, res) => {
  try {
    const { producto_id, tipo, cantidad, motivo, proveedor_id } = req.body;
    const connection = await db.getConnection();
    await connection.beginTransaction();
    // Registrar movimiento
    await MovimientoInventario.registrar(producto_id, tipo, cantidad, motivo, req.user.id);
    // Actualizar stock
    if (tipo === 'entrada') {
      await connection.query('UPDATE productos SET stock = stock + ? WHERE id = ?', [cantidad, producto_id]);
    } else if (tipo === 'salida') {
      await connection.query('UPDATE productos SET stock = stock - ? WHERE id = ?', [cantidad, producto_id]);
    }
    // Si es compra, asociar proveedor (opcional, se puede guardar en otra tabla)
    await connection.commit();
    res.status(201).json({ message: 'Movimiento registrado' });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    if (connection) connection.release();
  }
};
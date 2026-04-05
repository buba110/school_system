const db = require('../config/db');

exports.listar = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM productos WHERE activo = 1 ORDER BY nombre');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.obtener = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM productos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.crear = async (req, res) => {
  try {
    const { codigo, nombre, precio, stock, stock_minimo, proveedor_id } = req.body;
    const [result] = await db.query(
      `INSERT INTO productos (codigo, nombre, precio, stock, stock_minimo, proveedor_id, activo)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [codigo, nombre, precio, stock || 0, stock_minimo || 5, proveedor_id || null]
    );
    res.status(201).json({ id: result.insertId, message: 'Producto creado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { codigo, nombre, precio, stock, stock_minimo, proveedor_id, activo } = req.body;
    await db.query(
      `UPDATE productos SET codigo=?, nombre=?, precio=?, stock=?, stock_minimo=?, proveedor_id=?, activo=?
       WHERE id = ?`,
      [codigo, nombre, precio, stock, stock_minimo, proveedor_id, activo, req.params.id]
    );
    res.json({ message: 'Producto actualizado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    await db.query('UPDATE productos SET activo = 0 WHERE id = ?', [req.params.id]);
    res.json({ message: 'Producto desactivado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const db = require('../config/db');

exports.listar = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM proveedores ORDER BY nombre');
  res.json(rows);
};
exports.crear = async (req, res) => {
  const { nombre, contacto, telefono, email, direccion } = req.body;
  const [result] = await db.query(
    'INSERT INTO proveedores (nombre, contacto, telefono, email, direccion) VALUES (?, ?, ?, ?, ?)',
    [nombre, contacto, telefono, email, direccion]
  );
  res.status(201).json({ id: result.insertId });
};
exports.actualizar = async (req, res) => {
  const { nombre, contacto, telefono, email, direccion } = req.body;
  await db.query(
    'UPDATE proveedores SET nombre=?, contacto=?, telefono=?, email=?, direccion=? WHERE id=?',
    [nombre, contacto, telefono, email, direccion, req.params.id]
  );
  res.json({ message: 'Actualizado' });
};
exports.eliminar = async (req, res) => {
  await db.query('DELETE FROM proveedores WHERE id=?', [req.params.id]);
  res.json({ message: 'Eliminado' });
};
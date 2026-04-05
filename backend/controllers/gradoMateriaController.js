const db = require('../config/db');

// ---------- GRADOS ----------
exports.listarGrados = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM grados ORDER BY nivel, nombre');
  res.json(rows);
};
exports.crearGrado = async (req, res) => {
  const { nombre, nivel } = req.body;
  const [result] = await db.query('INSERT INTO grados (nombre, nivel) VALUES (?, ?)', [nombre, nivel]);
  res.status(201).json({ id: result.insertId });
};
exports.actualizarGrado = async (req, res) => {
  const { nombre, nivel } = req.body;
  await db.query('UPDATE grados SET nombre=?, nivel=? WHERE id=?', [nombre, nivel, req.params.id]);
  res.json({ message: 'Actualizado' });
};
exports.eliminarGrado = async (req, res) => {
  await db.query('DELETE FROM grados WHERE id=?', [req.params.id]);
  res.json({ message: 'Eliminado' });
};

// ---------- GRUPOS ----------
exports.listarGrupos = async (req, res) => {
  const [rows] = await db.query(`
    SELECT g.*, gr.nombre as grado_nombre 
    FROM grupos g 
    JOIN grados gr ON g.grado_id = gr.id
  `);
  res.json(rows);
};
exports.crearGrupo = async (req, res) => {
  const { nombre, grado_id } = req.body;
  const [result] = await db.query('INSERT INTO grupos (nombre, grado_id) VALUES (?, ?)', [nombre, grado_id]);
  res.status(201).json({ id: result.insertId });
};
exports.actualizarGrupo = async (req, res) => {
  const { nombre, grado_id } = req.body;
  await db.query('UPDATE grupos SET nombre=?, grado_id=? WHERE id=?', [nombre, grado_id, req.params.id]);
  res.json({ message: 'Actualizado' });
};
exports.eliminarGrupo = async (req, res) => {
  await db.query('DELETE FROM grupos WHERE id=?', [req.params.id]);
  res.json({ message: 'Eliminado' });
};

// ---------- MATERIAS ----------
exports.listarMaterias = async (req, res) => {
  const [rows] = await db.query(`
    SELECT m.*, gr.nombre as grado_nombre 
    FROM materias m 
    JOIN grados gr ON m.grado_id = gr.id
  `);
  res.json(rows);
};
exports.crearMateria = async (req, res) => {
  const { nombre, grado_id } = req.body;
  const [result] = await db.query('INSERT INTO materias (nombre, grado_id) VALUES (?, ?)', [nombre, grado_id]);
  res.status(201).json({ id: result.insertId });
};
exports.actualizarMateria = async (req, res) => {
  const { nombre, grado_id } = req.body;
  await db.query('UPDATE materias SET nombre=?, grado_id=? WHERE id=?', [nombre, grado_id, req.params.id]);
  res.json({ message: 'Actualizado' });
};
exports.eliminarMateria = async (req, res) => {
  await db.query('DELETE FROM materias WHERE id=?', [req.params.id]);
  res.json({ message: 'Eliminado' });
};
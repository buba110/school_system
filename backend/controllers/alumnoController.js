const pool = require('../config/db');

exports.listar = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM alumnos WHERE activo = 1 ORDER BY nombre_completo');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.obtener = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM alumnos WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Alumno no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.crear = async (req, res) => {
  try {
    const { matricula, nombre_completo, fecha_nacimiento, tutor_nombre, tutor_telefono, tutor_email, direccion } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO alumnos (matricula, nombre_completo, fecha_nacimiento, tutor_nombre, tutor_telefono, tutor_email, direccion)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [matricula, nombre_completo, fecha_nacimiento, tutor_nombre, tutor_telefono, tutor_email, direccion]
    );
    res.status(201).json({ id: rows[0].id, message: 'Alumno creado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { nombre_completo, fecha_nacimiento, tutor_nombre, tutor_telefono, tutor_email, direccion, activo } = req.body;
    await pool.query(
      `UPDATE alumnos SET nombre_completo=$1, fecha_nacimiento=$2, tutor_nombre=$3, tutor_telefono=$4, tutor_email=$5, direccion=$6, activo=$7
       WHERE id = $8`,
      [nombre_completo, fecha_nacimiento, tutor_nombre, tutor_telefono, tutor_email, direccion, activo, req.params.id]
    );
    res.json({ message: 'Actualizado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    await pool.query('UPDATE alumnos SET activo = 0 WHERE id = $1', [req.params.id]);
    res.json({ message: 'Eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

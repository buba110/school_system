const db = require('../config/db');
const Colegiatura = require('../models/Colegiatura');

exports.inscribir = async (req, res) => {
  const { alumno_id, grupo_id, ciclo_escolar, monto_mensual } = req.body;
  try {
    const [existing] = await db.query(
      'SELECT id FROM inscripciones WHERE alumno_id = ? AND ciclo_escolar = ?',
      [alumno_id, ciclo_escolar]
    );
    if (existing.length > 0) return res.status(400).json({ message: 'Ya inscrito en este ciclo' });

    const [result] = await db.query(
      'INSERT INTO inscripciones (alumno_id, grupo_id, ciclo_escolar) VALUES (?, ?, ?)',
      [alumno_id, grupo_id, ciclo_escolar]
    );
    // Generar colegiaturas mensuales
    await Colegiatura.generarMensualidades(alumno_id, ciclo_escolar, monto_mensual || 1500);
    res.status(201).json({ id: result.insertId, message: 'Inscripción y colegiaturas generadas' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.inscripcionesPorAlumno = async (req, res) => {
  const { alumnoId } = req.params;
  const [rows] = await db.query(`
    SELECT i.*, g.nombre as grupo_nombre, gr.nombre as grado_nombre
    FROM inscripciones i
    JOIN grupos g ON i.grupo_id = g.id
    JOIN grados gr ON g.grado_id = gr.id
    WHERE i.alumno_id = ?
  `, [alumnoId]);
  res.json(rows);
};
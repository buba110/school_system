const db = require('../config/db');

// Generar colegiaturas para un alumno en un ciclo escolar
exports.generar = async (req, res) => {
  try {
    const { alumno_id, ciclo_escolar, monto_mensual } = req.body;
    const [anioInicio, anioFin] = ciclo_escolar.split('-').map(Number);
    const meses = [];
    for (let mes = 8; mes <= 12; mes++) meses.push({ year: anioInicio, month: mes });
    for (let mes = 1; mes <= 7; mes++) meses.push({ year: anioFin, month: mes });
    for (const { year, month } of meses) {
      const mesNumber = year * 100 + month;
      const fechaVencimiento = new Date(year, month, 10);
      await db.query(
        `INSERT INTO colegiaturas (alumno_id, mes, monto, fecha_vencimiento)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE monto = VALUES(monto)`,
        [alumno_id, mesNumber, monto_mensual, fechaVencimiento]
      );
    }
    res.json({ message: 'Colegiaturas generadas correctamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtener adeudos de un alumno
exports.adeudos = async (req, res) => {
  try {
    const { alumnoId } = req.params;
    const [rows] = await db.query(
      `SELECT * FROM colegiaturas WHERE alumno_id = ? AND pagado = 0 ORDER BY mes`,
      [alumnoId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Registrar pago de una colegiatura
exports.pagar = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const { colegiatura_id, monto, metodo_pago, usuario_id } = req.body;
    // Insertar en pagos
    const [pagoResult] = await connection.query(
      `INSERT INTO pagos (tipo, referencia_id, monto, metodo_pago, usuario_id)
       VALUES ('colegiatura', ?, ?, ?, ?)`,
      [colegiatura_id, monto, metodo_pago, usuario_id]
    );
    // Marcar colegiatura como pagada
    await connection.query(
      `UPDATE colegiaturas SET pagado = 1 WHERE id = ?`,
      [colegiatura_id]
    );
    await connection.commit();
    res.status(201).json({ pagoId: pagoResult.insertId, message: 'Pago registrado' });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    connection.release();
  }
};
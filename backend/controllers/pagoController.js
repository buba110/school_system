const db = require('../config/db');
const Pago = require('../models/Pago');
const Colegiatura = require('../models/Colegiatura');

exports.registrarPagoColegiatura = async (req, res) => {
  try {
    const { colegiatura_id, monto, metodo_pago } = req.body;
    const pagoId = await Pago.registrar({
      tipo: 'colegiatura',
      referencia_id: colegiatura_id,
      monto,
      metodo_pago,
      usuario_id: req.user.id
    });
    await Colegiatura.marcarPagado(colegiatura_id, pagoId);
    res.status(201).json({ pagoId, message: 'Pago registrado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.historialPagosPorAlumno = async (req, res) => {
  try {
    const { alumnoId } = req.params;
    const [rows] = await db.query(`
      SELECT p.*, c.mes, c.monto as monto_colegiatura
      FROM pagos p
      JOIN colegiaturas c ON p.referencia_id = c.id
      WHERE c.alumno_id = ? AND p.tipo = 'colegiatura'
      ORDER BY p.fecha_pago DESC
    `, [alumnoId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.estadoCuenta = async (req, res) => {
  try {
    const { alumnoId } = req.params;
    const [adeudos] = await db.query(
      'SELECT SUM(monto) as total_adeudo FROM colegiaturas WHERE alumno_id = ? AND pagado = 0',
      [alumnoId]
    );
    const [pagado] = await db.query(`
      SELECT SUM(p.monto) as total_pagado
      FROM pagos p
      JOIN colegiaturas c ON p.referencia_id = c.id
      WHERE c.alumno_id = ? AND p.tipo = 'colegiatura'
    `, [alumnoId]);
    res.json({
      total_adeudo: adeudos[0].total_adeudo || 0,
      total_pagado: pagado[0].total_pagado || 0,
      saldo: (adeudos[0].total_adeudo || 0) - (pagado[0].total_pagado || 0)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
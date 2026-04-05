const CorteCaja = require('../models/CorteCaja');
const db = require('../config/db');

exports.abrirCaja = async (req, res) => {
  try {
    const { monto_apertura } = req.body;
    const existente = await CorteCaja.obtenerAbierto();
    if (existente) return res.status(400).json({ message: 'Ya hay una caja abierta' });
    const id = await CorteCaja.abrir(req.user.id, monto_apertura || 0);
    res.status(201).json({ id, message: 'Caja abierta correctamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cerrarCaja = async (req, res) => {
  try {
    const caja = await CorteCaja.obtenerAbierto();
    if (!caja) return res.status(400).json({ message: 'No hay caja abierta' });
    const [ventas] = await db.query(
      'SELECT SUM(total) as total FROM ventas WHERE fecha >= ? AND metodo_pago = "efectivo"',
      [caja.fecha_apertura]
    );
    const [colegiaturas] = await db.query(
      `SELECT SUM(p.monto) as total FROM pagos p
       JOIN colegiaturas c ON p.referencia_id = c.id
       WHERE p.tipo = 'colegiatura' AND p.metodo_pago = 'efectivo' AND p.fecha_pago >= ?`,
      [caja.fecha_apertura]
    );
    const totalVentas = ventas[0].total || 0;
    const totalColeg = colegiaturas[0].total || 0;
    const montoEsperado = caja.monto_apertura + totalVentas + totalColeg;
    res.json({ montoEsperado, totalVentas, totalColeg, apertura: caja.monto_apertura });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cerrarCajaConfirmar = async (req, res) => {
  try {
    const { monto_real, total_ventas, total_colegiaturas } = req.body;
    const caja = await CorteCaja.obtenerAbierto();
    if (!caja) return res.status(400).json({ message: 'No hay caja abierta' });
    const diferencia = monto_real - (caja.monto_apertura + total_ventas + total_colegiaturas);
    await CorteCaja.cerrar(caja.id, monto_real, total_ventas, total_colegiaturas, diferencia);
    res.json({ message: 'Caja cerrada correctamente', diferencia });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.estadoCaja = async (req, res) => {
  try {
    const caja = await CorteCaja.obtenerAbierto();
    res.json({ abierto: !!caja, corte: caja });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
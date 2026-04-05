const db = require('../config/db');

// Ingresos por colegiaturas (agrupado por mes)
exports.ingresosColegiaturas = async (req, res) => {
  try {
    const { anio } = req.query;
    const [rows] = await db.query(
      `SELECT DATE_FORMAT(fecha_pago, '%Y-%m') as mes, SUM(monto) as total
       FROM pagos
       WHERE tipo = 'colegiatura' AND YEAR(fecha_pago) = ?
       GROUP BY mes ORDER BY mes`,
      [anio || new Date().getFullYear()]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.ingresosPorPeriodo = async (req, res) => {
  const { fechaInicio, fechaFin } = req.query;
  const [rows] = await db.query(
    `SELECT DATE(fecha_pago) as dia, SUM(monto) as total
     FROM pagos
     WHERE fecha_pago BETWEEN ? AND ?
     GROUP BY dia ORDER BY dia`,
    [fechaInicio, fechaFin]
  );
  res.json(rows);
};
exports.ingresosPorPeriodo = async (req, res) => {
  const { fechaInicio, fechaFin } = req.query;
  const [rows] = await db.query(
    `SELECT DATE(fecha_pago) as dia, SUM(monto) as total
     FROM pagos
     WHERE fecha_pago BETWEEN ? AND ?
     GROUP BY dia ORDER BY dia`,
    [fechaInicio, fechaFin]
  );
  res.json(rows);
};
exports.ingresosVentas = async (req, res) => {
  const { days = 30 } = req.query;
  const [rows] = await db.query(
    `SELECT DATE(fecha) as dia, SUM(total) as total
     FROM ventas
     WHERE fecha >= DATE_SUB(NOW(), INTERVAL ? DAY)
     GROUP BY dia ORDER BY dia`,
    [days]
  );
  res.json(rows);
};
// Ingresos por ventas (últimos N días)
exports.ingresosVentas = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const [rows] = await db.query(
      `SELECT DATE(fecha) as dia, SUM(total) as total
       FROM ventas
       WHERE fecha >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY dia ORDER BY dia`,
      [days]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Alumnos morosos
exports.alumnosMorosos = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT a.id, a.matricula, a.nombre_completo, 
              COUNT(c.id) as meses_adeudo, SUM(c.monto) as total_adeudo
       FROM alumnos a
       JOIN colegiaturas c ON a.id = c.alumno_id
       WHERE c.pagado = 0
       GROUP BY a.id
       ORDER BY total_adeudo DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Productos más vendidos
exports.productosMasVendidos = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.id, p.nombre, SUM(dv.cantidad) as total_vendido
       FROM productos p
       JOIN detalles_venta dv ON p.id = dv.producto_id
       GROUP BY p.id
       ORDER BY total_vendido DESC
       LIMIT 10`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
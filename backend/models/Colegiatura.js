const db = require('../config/db');

class Colegiatura {
  static async generarMensualidades(alumno_id, ciclo_escolar, montoMensual) {
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
        [alumno_id, mesNumber, montoMensual, fechaVencimiento]
      );
    }
    return true;
  }

  static async obtenerAdeudos(alumno_id) {
    const [rows] = await db.query(
      'SELECT * FROM colegiaturas WHERE alumno_id = ? AND pagado = 0 ORDER BY mes',
      [alumno_id]
    );
    return rows;
  }

  static async marcarPagado(colegiatura_id, pago_id) {
    const [result] = await db.query(
      'UPDATE colegiaturas SET pagado = 1 WHERE id = ?',
      [colegiatura_id]
    );
    return result.affectedRows;
  }
}

module.exports = Colegiatura;
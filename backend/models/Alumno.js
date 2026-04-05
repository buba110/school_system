const db = require('../config/db');
class Alumno {
  static async findAll() { const [rows] = await db.query('SELECT * FROM alumnos WHERE activo = 1'); return rows; }
  static async create(data) { const { matricula, nombre_completo, tutor_nombre } = data; const [res] = await db.query('INSERT INTO alumnos (matricula, nombre_completo, tutor_nombre) VALUES (?,?,?)', [matricula, nombre_completo, tutor_nombre]); return res.insertId; }
  static async update(id, data) { const { nombre_completo, tutor_nombre, activo } = data; const [res] = await db.query('UPDATE alumnos SET nombre_completo=?, tutor_nombre=?, activo=? WHERE id=?', [nombre_completo, tutor_nombre, activo, id]); return res.affectedRows; }
  static async delete(id) { return this.update(id, { activo: 0 }); }
}
module.exports = Alumno;

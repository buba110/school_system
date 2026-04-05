const Usuario = require('../models/Usuario');
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Listar usuarios (solo admin y subadmin pueden ver)
exports.listar = async (req, res) => {
  try {
    let query = `
      SELECT u.id, u.nombre_completo, u.email, u.activo, u.fecha_expiracion, 
             r.nombre as rol_nombre, u.creado_por
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
    `;
    // Subadmin solo ve cajeros
    if (req.user.rol_nombre === 'subadmin') {
      query += ` WHERE r.nombre = 'cajero'`;
    }
    query += ` ORDER BY u.id DESC`;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Crear usuario (admin puede crear cualquier rol; subadmin solo cajeros)
exports.crear = async (req, res) => {
  try {
    const { nombre_completo, email, password, rol_nombre, fecha_expiracion } = req.body;
    
    // Validar rol permitido según quien crea
    if (req.user.rol_nombre === 'subadmin' && rol_nombre !== 'cajero') {
      return res.status(403).json({ message: 'No puedes crear usuarios con ese rol' });
    }
    
    // Verificar si el email ya existe
    const [existe] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existe.length > 0) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }
    
    // Obtener id del rol
    const [rolRow] = await db.query('SELECT id FROM roles WHERE nombre = ?', [rol_nombre]);
    if (rolRow.length === 0) return res.status(400).json({ message: 'Rol no válido' });
    const rol_id = rolRow[0].id;
    
    const hash = await bcrypt.hash(password, 10);
    const fechaExp = fecha_expiracion || null;
    
    const [result] = await db.query(
      `INSERT INTO usuarios (nombre_completo, email, password_hash, rol_id, activo, fecha_expiracion, creado_por)
       VALUES (?, ?, ?, ?, 1, ?, ?)`,
      [nombre_completo, email, hash, rol_id, fechaExp, req.user.id]
    );
    
    res.status(201).json({ id: result.insertId, message: 'Usuario creado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Editar usuario (solo admin puede editar admins; subadmin solo cajeros)
exports.editar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_completo, email, activo, fecha_expiracion, password } = req.body;
    
    // Obtener usuario actual
    const [userRows] = await db.query('SELECT rol_id, creado_por FROM usuarios WHERE id = ?', [id]);
    if (userRows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    const user = userRows[0];
    
    // Verificar permisos: subadmin no puede editar usuarios que no sean cajeros
    if (req.user.rol_nombre === 'subadmin') {
      const [rol] = await db.query('SELECT nombre FROM roles WHERE id = ?', [user.rol_id]);
      if (rol[0].nombre !== 'cajero') {
        return res.status(403).json({ message: 'No puedes editar este usuario' });
      }
    }
    
    let updateFields = [];
    let values = [];
    
    if (nombre_completo) {
      updateFields.push('nombre_completo = ?');
      values.push(nombre_completo);
    }
    if (email) {
      updateFields.push('email = ?');
      values.push(email);
    }
    if (activo !== undefined) {
      updateFields.push('activo = ?');
      values.push(activo);
    }
    if (fecha_expiracion !== undefined) {
      updateFields.push('fecha_expiracion = ?');
      values.push(fecha_expiracion);
    }
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      updateFields.push('password_hash = ?');
      values.push(hash);
    }
    
    if (updateFields.length === 0) return res.status(400).json({ message: 'Nada que actualizar' });
    
    values.push(id);
    await db.query(`UPDATE usuarios SET ${updateFields.join(', ')} WHERE id = ?`, values);
    
    res.json({ message: 'Usuario actualizado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Eliminar usuario (desactivar)
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    // No permitir eliminar el propio usuario
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: 'No puedes eliminarte a ti mismo' });
    }
    await db.query('UPDATE usuarios SET activo = 0 WHERE id = ?', [id]);
    res.json({ message: 'Usuario desactivado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtener un usuario por ID
exports.obtener = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT u.id, u.nombre_completo, u.email, u.activo, u.fecha_expiracion, r.nombre as rol_nombre
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      WHERE u.id = ?
    `, [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
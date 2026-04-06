const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login intento:', email);

    const user = await Usuario.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    if (!user.activo) {
      return res.status(401).json({ message: 'Cuenta desactivada' });
    }
    if (user.fecha_expiracion && new Date(user.fecha_expiracion) < new Date()) {
      return res.status(401).json({ message: 'Cuenta expirada' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, rol_nombre: user.rol_nombre },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nombre_completo: user.nombre_completo,
        email: user.email,
        rol: user.rol_nombre
      }
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.perfil = async (req, res) => {
  try {
    const user = await Usuario.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    delete user.password_hash;
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = (roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'No autenticado' });
  if (!roles.includes(req.user.rol_nombre)) return res.status(403).json({ message: 'Permiso denegado' });
  next();
};

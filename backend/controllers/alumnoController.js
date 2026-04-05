const Alumno = require('../models/Alumno');
exports.listar = async (req, res) => { res.json(await Alumno.findAll()); };
exports.crear = async (req, res) => { const id = await Alumno.create(req.body); res.status(201).json({ id }); };
exports.actualizar = async (req, res) => { await Alumno.update(req.params.id, req.body); res.json({ message: 'Actualizado' }); };
exports.eliminar = async (req, res) => { await Alumno.delete(req.params.id); res.json({ message: 'Eliminado' }); };

const express = require('express');
const {
  listarGrados, crearGrado, actualizarGrado, eliminarGrado,
  listarGrupos, crearGrupo, actualizarGrupo, eliminarGrupo,
  listarMaterias, crearMateria, actualizarMateria, eliminarMateria
} = require('../controllers/gradoMateriaController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const router = express.Router();
router.use(auth);

// Grados
router.get('/grados', role(['administrador']), listarGrados);
router.post('/grados', role(['administrador']), crearGrado);
router.put('/grados/:id', role(['administrador']), actualizarGrado);
router.delete('/grados/:id', role(['administrador']), eliminarGrado);

// Grupos
router.get('/grupos', role(['administrador']), listarGrupos);
router.post('/grupos', role(['administrador']), crearGrupo);
router.put('/grupos/:id', role(['administrador']), actualizarGrupo);
router.delete('/grupos/:id', role(['administrador']), eliminarGrupo);

// Materias
router.get('/materias', role(['administrador']), listarMaterias);
router.post('/materias', role(['administrador']), crearMateria);
router.put('/materias/:id', role(['administrador']), actualizarMateria);
router.delete('/materias/:id', role(['administrador']), eliminarMateria);

module.exports = router;
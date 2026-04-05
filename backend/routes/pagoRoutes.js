const express = require('express');
const { registrarPagoColegiatura, historialPagosPorAlumno, estadoCuenta } = require('../controllers/pagoController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const router = express.Router();
router.use(auth);

router.post('/colegiatura', role(['administrador', 'cajero']), registrarPagoColegiatura);
router.get('/historial/:alumnoId', role(['administrador', 'padre']), historialPagosPorAlumno);
router.get('/estado-cuenta/:alumnoId', role(['administrador', 'padre']), estadoCuenta);

module.exports = router;
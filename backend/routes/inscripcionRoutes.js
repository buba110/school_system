const express = require('express');
const { inscribir, inscripcionesPorAlumno } = require('../controllers/inscripcionController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const router = express.Router();
router.use(auth);
router.post('/', role(['administrador']), inscribir);
router.get('/alumno/:alumnoId', role(['administrador']), inscripcionesPorAlumno);

module.exports = router;
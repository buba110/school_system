const express = require('express');
const { listarMovimientos, registrarMovimiento } = require('../controllers/inventarioController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const router = express.Router();
router.use(auth);

router.get('/movimientos', role(['administrador']), listarMovimientos);
router.post('/movimientos', role(['administrador']), registrarMovimiento);

module.exports = router;
const express = require('express');
const { realizarVenta, ultimaVenta, anularVenta } = require('../controllers/ventaController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const router = express.Router();
router.use(auth);

router.post('/', role(['administrador', 'cajero']), realizarVenta);
router.get('/ultima', role(['administrador', 'cajero']), ultimaVenta);
router.post('/anular/:id', role(['administrador']), anularVenta);

module.exports = router;
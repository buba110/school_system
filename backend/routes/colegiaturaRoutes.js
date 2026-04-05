const express = require('express');
const { generar, adeudos, pagar } = require('../controllers/colegiaturaController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const router = express.Router();
router.use(auth);

router.post('/generar', role(['administrador']), generar);
router.get('/adeudos/:alumnoId', role(['administrador', 'padre']), adeudos);
router.post('/pagar', role(['administrador', 'cajero']), pagar);

module.exports = router;
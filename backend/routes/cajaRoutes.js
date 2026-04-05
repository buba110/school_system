const express = require('express');
const { abrirCaja, cerrarCaja, cerrarCajaConfirmar, estadoCaja } = require('../controllers/cajaController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const router = express.Router();
router.get('/historial', role(['administrador', 'cajero']), async (req, res) => {
  const [rows] = await db.query('SELECT * FROM cortes_caja ORDER BY id DESC');
  res.json(rows);
});
router.use(auth);

router.post('/abrir', role(['administrador', 'cajero']), abrirCaja);
router.post('/cerrar', role(['administrador', 'cajero']), cerrarCaja);
router.post('/cerrar-confirmar', role(['administrador', 'cajero']), cerrarCajaConfirmar);
router.get('/estado', role(['administrador', 'cajero']), estadoCaja);

module.exports = router;
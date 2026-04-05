const express = require('express');
const { ingresosColegiaturas, ingresosVentas, alumnosMorosos, productosMasVendidos } = require('../controllers/reporteController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const router = express.Router();
router.use(auth);
router.get('/ingresos-colegiaturas', role(['administrador']), ingresosColegiaturas);
router.get('/ingresos-ventas', role(['administrador']), ingresosVentas);
router.get('/alumnos-morosos', role(['administrador']), alumnosMorosos);
router.get('/productos-mas-vendidos', role(['administrador']), productosMasVendidos);
router.get('/ingresos-periodo', role(['administrador']), ingresosPorPeriodo);
router.get('/ingresos-periodo', role(['administrador']), ingresosPorPeriodo);

module.exports = router;
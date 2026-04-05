const express = require('express');
const { listar, obtener, crear, actualizar, eliminar } = require('../controllers/productoController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.get('/', roleMiddleware(['administrador', 'cajero', 'subadmin']), listar);
router.get('/:id', roleMiddleware(['administrador', 'cajero', 'subadmin']), obtener);
router.post('/', roleMiddleware(['administrador', 'subadmin']), crear);
router.put('/:id', roleMiddleware(['administrador', 'subadmin']), actualizar);
router.delete('/:id', roleMiddleware(['administrador', 'subadmin']), eliminar);

module.exports = router;
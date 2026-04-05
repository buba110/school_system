const express = require('express');
const { listar, crear, editar, eliminar, obtener } = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(authMiddleware);

// Solo administrador y subadmin pueden gestionar usuarios
router.get('/', roleMiddleware(['administrador', 'subadmin']), listar);
router.get('/:id', roleMiddleware(['administrador', 'subadmin']), obtener);
router.post('/', roleMiddleware(['administrador', 'subadmin']), crear);
router.put('/:id', roleMiddleware(['administrador', 'subadmin']), editar);
router.delete('/:id', roleMiddleware(['administrador', 'subadmin']), eliminar);

module.exports = router;
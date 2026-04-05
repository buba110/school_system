const express = require('express');
const { listar, crear, editar, eliminar, obtener } = require('../controllers/usuarioController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const router = express.Router();
router.use(auth);

router.get('/', role(['administrador', 'subadmin']), listar);
router.get('/:id', role(['administrador', 'subadmin']), obtener);
router.post('/', role(['administrador', 'subadmin']), crear);
router.put('/:id', role(['administrador', 'subadmin']), editar);
router.delete('/:id', role(['administrador', 'subadmin']), eliminar);

module.exports = router;
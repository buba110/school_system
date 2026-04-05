const express = require('express');
const { listar, crear, actualizar, eliminar } = require('../controllers/proveedorController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const router = express.Router();
router.use(auth);

router.get('/', role(['administrador']), listar);
router.post('/', role(['administrador']), crear);
router.put('/:id', role(['administrador']), actualizar);
router.delete('/:id', role(['administrador']), eliminar);

module.exports = router;
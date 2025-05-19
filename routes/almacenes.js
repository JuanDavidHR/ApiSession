const express = require('express');
const router = express.Router();
const almacenesController = require('../controllers/almacenesController');
const verificarToken = require('../middleware/verificarToken');

// Crear
router.post('/', verificarToken, almacenesController.insertarAlmacen);

// Listar todos
router.get('/', verificarToken, almacenesController.listarAlmacenes);

// Buscar por código
router.get('/:codigo', verificarToken, almacenesController.obtenerAlmacenPorCodigo);

module.exports = router;
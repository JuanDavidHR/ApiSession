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

// Dar de baja almacén
router.put('/dar-de-baja', verificarToken, almacenesController.darDeBajaAlmacen);

module.exports = router;
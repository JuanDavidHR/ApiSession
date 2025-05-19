const express = require('express');
const router = express.Router();
const almacenesController = require('../controllers/almacenesController');

router.post('/', almacenesController.insertarAlmacen);

module.exports = router;
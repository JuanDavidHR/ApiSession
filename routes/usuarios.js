// routes/usuarios.js
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

router.get('/', usuariosController.obtenerUsuarios);
router.post('/', usuariosController.crearUsuario);

module.exports = router;
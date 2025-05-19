// routes/usuarios.js
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const verificarToken = require('../middleware/verificarToken');

router.get('/', usuariosController.obtenerUsuarios);
router.post('/', usuariosController.crearUsuario);
router.post('/login', usuariosController.loginUsuario);
router.get('/perfil', verificarToken, (req, res) => {
  res.json({
    mensaje: 'Perfil accedido correctamente',
    usuario: req.usuario
  });
});

module.exports = router;
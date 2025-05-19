// controllers/usuariosController.js
const usuarios = require('../models/usuariosModel');

exports.obtenerUsuarios = (req, res) => {
  res.json(usuarios);
};

exports.crearUsuario = (req, res) => {
  const nuevo = req.body;
  usuarios.push(nuevo);
  res.status(201).json({ mensaje: 'Usuario creado', datos: nuevo });
}
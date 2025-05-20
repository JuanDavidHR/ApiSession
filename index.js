// index.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// 🔥 CORS: permitir acceso desde cualquier origen (como localhost:8080)
app.use(cors());
// Middleware para leer JSON
app.use(express.json());

// Importa rutas
const usuariosRoutes = require('./routes/usuarios');
app.use('/api/usuarios', usuariosRoutes);

const almacenesRoutes = require('./routes/almacenes');
app.use('/api/almacenes', almacenesRoutes);

// Servidor iniciado
app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
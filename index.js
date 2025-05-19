// index.js
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para recibir JSON
app.use(express.json());

// Ruta GET
app.get('/', (req, res) => {
  res.send('¡Hola desde la API REST!');
});

// Ruta POST de ejemplo
app.post('/usuarios', (req, res) => {
  const datos = req.body;
  res.json({
    mensaje: 'Usuario recibido',
    datos: datos
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
const { poolPromise, sql } = require('../config/db');

const verificarToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Token requerido' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('Token', sql.VarChar, token)
      .query('SELECT id, token_expira FROM Usuarios WHERE token = @Token');

    if (result.recordset.length === 0) {
      return res.status(401).json({ mensaje: 'Token inválido' });
    }

    const usuario = result.recordset[0];
    const ahora = new Date();

    if (new Date(usuario.token_expira) < ahora) {
      return res.status(401).json({ mensaje: 'Token expirado' });
    }

    req.usuario = usuario; // ← Aquí va el ID del usuario autenticado
    next();
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al validar token', error: err.message });
  }
};

module.exports = verificarToken;

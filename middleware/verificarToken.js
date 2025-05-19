const { poolPromise, sql } = require('../config/db');

const verificarToken = async (req, res, next) => {
  const token = req.headers['authorization']; // se espera "Bearer <token>"

  if (!token) {
    return res.status(401).json({ mensaje: 'Token requerido' });
  }

  const tokenSolo = token.replace('Bearer ', '');

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('Token', sql.VarChar, tokenSolo)
      .query('SELECT * FROM Usuarios WHERE token = @Token');

    if (result.recordset.length === 0) {
      return res.status(401).json({ mensaje: 'Token inválido' });
    }

    const usuario = result.recordset[0];
    const ahora = new Date();

    if (new Date(usuario.token_expira) < ahora) {
      return res.status(401).json({ mensaje: 'Token expirado' });
    }

    // ✅ Token válido, continúa
    req.usuario = usuario;
    next();
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al validar token', error: err.message });
  }
};

module.exports = verificarToken;
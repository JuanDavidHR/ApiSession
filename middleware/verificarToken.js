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
       .execute('LOGEOS_OBTENER_POR_TOKEN');

    if (result.recordset.length === 0) {
      return res.status(401).json({ mensaje: 'Token inválido' });
    }

    const logeo = result.recordset[0];
    const ahora = new Date();
    const expira = new Date(logeo.token_expira);

    // Si expiró, actualizar estado en BD a 2
    if (expira < ahora) {
      await pool.request()
          .input('Token', sql.VarChar, token)
          .execute('LOGEOS_CERRAR_SESION');

      return res.status(401).json({ mensaje: 'Token expirado, sesión cerrada automáticamente' });
    }

    if (logeo.status_login !== 1) {
      return res.status(401).json({ mensaje: 'Sesión cerrada' });
    }

    req.usuario = logeo;
    next();
  } catch (err) {
    return res.status(500).json({ mensaje: 'Error del servidor', error: err.message });
  }
};
module.exports = verificarToken;

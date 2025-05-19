const { poolPromise, sql } = require('../config/db');

exports.insertarAlmacen = async (req, res) => {
  const { codigo, nombre, direccion, ubigeo, status, usuario_creador } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('codigo', sql.VarChar, codigo)
      .input('nombre', sql.VarChar, nombre)
      .input('direccion', sql.VarChar, direccion)
      .input('ubigeo', sql.VarChar, ubigeo)
      .input('status', sql.Bit, status)
      .input('usuario_creador', sql.Int, usuario_creador)
      .execute('InsertarAlmacen');

    const nuevoId = result.recordset[0]?.id;

    res.status(201).json({
      mensaje: 'Almacén registrado correctamente',
      id: nuevoId
    });
  } catch (err) {
    res.status(500).json({
      mensaje: 'Error al insertar almacén',
      error: err.message
    });
  }
};
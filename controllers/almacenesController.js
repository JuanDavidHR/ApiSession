const { poolPromise, sql } = require('../config/db');

exports.insertarAlmacen = async (req, res) => {
  const { codigo, nombre, direccion, ubigeo, status } = req.body;
  const usuario_creador = req.usuario.id; // ← viene del token

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('codigo', sql.VarChar, codigo || null)
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
    res.status(500).json({ mensaje: 'Error al insertar almacén', error: err.message });
  }
};

exports.listarAlmacenes = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .query('SELECT * FROM Almacenes ORDER BY createdate DESC');

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al listar almacenes', error: err.message });
  }
};

exports.obtenerAlmacenPorCodigo = async (req, res) => {
  const { codigo } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('codigo', sql.VarChar, codigo)
      .query('SELECT * FROM Almacenes WHERE codigo = @codigo');

    if (result.recordset.length === 0) {
      return res.status(404).json({ mensaje: 'Almacén no encontrado' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al buscar almacén', error: err.message });
  }
};
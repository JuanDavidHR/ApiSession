const { poolPromise, sql } = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

// GET: Listar usuarios desde SQL Server
exports.obtenerUsuarios = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT id, nombre FROM Usuarios');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error: err.message });
  }
};

// POST: Insertar usuario en SQL Server
exports.crearUsuario = async (req, res) => {
  const { nombre, correo, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10); // 🔐 Encripta el pass

    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('Nombre', sql.VarChar, nombre)
      .input('Correo', sql.VarChar, correo)
      .input('Password', sql.VarChar, hash)
      .execute('InsertarUsuario');

    const nuevoId = result.recordset[0]?.id;

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      id: nuevoId
    });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al registrar usuario', error: err.message });
  }
};

exports.loginUsuario = async (req, res) => {
  const { correo, password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input('Correo', sql.VarChar, correo)
      .query('SELECT id, password FROM Usuarios WHERE correo = @Correo');

    if (result.recordset.length === 0) {
      // Logeo fallido
      await pool.request()
        .input('usuario_id', sql.Int, null)
        .input('correo', sql.VarChar, correo)
        .input('ip_origen', sql.VarChar, ip)
        .input('fecha_ingreso', sql.DateTime, new Date())
        .input('token', sql.VarChar, null)
        .input('exito', sql.Bit, 0)
        .query(`INSERT INTO Logeos (usuario_id, correo, ip_origen, fecha_ingreso, token, exito)
                VALUES (@usuario_id, @correo, @ip_origen, @fecha_ingreso, @token, @exito)`);

      return res.status(401).json({ mensaje: 'Correo no encontrado' });
    }

    const usuario = result.recordset[0];
    const coincide = await bcrypt.compare(password, usuario.password);

    if (!coincide) {
      // Logeo fallido
      await pool.request()
        .input('usuario_id', sql.Int, usuario.id)
        .input('correo', sql.VarChar, correo)
        .input('ip_origen', sql.VarChar, ip)
        .input('fecha_ingreso', sql.DateTime, new Date())
        .input('token', sql.VarChar, null)
        .input('exito', sql.Bit, 0)
        .query(`INSERT INTO Logeos (usuario_id, correo, ip_origen, fecha_ingreso, token, exito)
                VALUES (@usuario_id, @correo, @ip_origen, @fecha_ingreso, @token, @exito)`);

      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    const token = uuidv4();
    const expira = new Date(Date.now() + 5 * 60000);

    await pool
      .request()
      .input('Id', sql.Int, usuario.id)
      .input('Token', sql.VarChar, token)
      .input('Expira', sql.DateTime, expira)
      .query('UPDATE Usuarios SET token = @Token, token_expira = @Expira WHERE id = @Id');

    // Logeo exitoso
    await pool.request()
      .input('usuario_id', sql.Int, usuario.id)
      .input('correo', sql.VarChar, correo)
      .input('ip_origen', sql.VarChar, ip)
      .input('fecha_ingreso', sql.DateTime, new Date())
      .input('token', sql.VarChar, token)
      .input('exito', sql.Bit, 1)
      .query(`INSERT INTO Logeos (usuario_id, correo, ip_origen, fecha_ingreso, token, exito)
              VALUES (@usuario_id, @correo, @ip_origen, @fecha_ingreso, @token, @exito)`);

    res.status(200).json({
      mensaje: 'Login exitoso',
      token,
      expira
    });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al iniciar sesión', error: err.message });
  }
};


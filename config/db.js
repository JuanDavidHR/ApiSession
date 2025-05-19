const sql = require('mssql');

const config = {
  user: 'sa',
  password: 'sa',
  server: 'DESKTOP-BO0FOFP',
  database: 'PRUEBA2',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✔️ Conectado a SQL Server');
    return pool;
  })
  .catch(err => console.error('❌ Error de conexión:', err));

module.exports = {
  sql,
  poolPromise
};

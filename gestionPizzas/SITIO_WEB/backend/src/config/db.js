const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'admin_pizzas',
  password: process.env.DB_PASSWORD || 'pi4sh3h',
  database: process.env.DB_NAME || 'gestionPizza',
  connectionTimeoutMillis: 3000,
});

pool.on('error', (err) => {
  console.error('[PostgreSQL] Error inesperado en el pool de conexiones:', err.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};

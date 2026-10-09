const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');
const categoriasRoutes = require('./routes/categorias.routes');
const productosRoutes = require('./routes/productos.routes');
const pedidosRoutes = require('./routes/pedidos.routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: '*', // Permitir peticiones desde Angular (localhost:4200 u otros puertos)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health check y estado de conexión
app.get('/api/health', async (req, res) => {
  try {
    const dbRes = await db.query('SELECT NOW() AS hora_servidor, current_database() AS bd');
    res.json({
      status: 'online',
      base_de_datos: 'conectada',
      info_db: dbRes.rows[0]
    });
  } catch (error) {
    res.json({
      status: 'online',
      base_de_datos: 'desconectada (usando modo contingencia)',
      error: error.message
    });
  }
});

// Rutas de API
app.use('/api/categorias', categoriasRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/pedidos', pedidosRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🍕 Servidor Backend Pizzería corriendo en http://localhost:${PORT}`);
  console.log(`🍕 Endpoints disponibles:`);
  console.log(`   - GET  http://localhost:${PORT}/api/categorias`);
  console.log(`   - GET  http://localhost:${PORT}/api/productos`);
  console.log(`   - POST http://localhost:${PORT}/api/pedidos`);
  console.log(`   - GET  http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

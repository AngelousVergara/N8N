const db = require('../config/db');
const { mockCategorias } = require('../data/mockData');

const getCategorias = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id_categoria, nombre, descripcion, orden_visualizacion FROM categorias WHERE activo = TRUE ORDER BY orden_visualizacion ASC'
    );
    if (result.rows && result.rows.length > 0) {
      return res.json(result.rows);
    }
    // Si la tabla está vacía, responder con catálogo por defecto
    return res.json(mockCategorias);
  } catch (error) {
    console.warn('[Categorias] Usando catálogo de respaldo (BD no disponible o vacía):', error.message);
    return res.json(mockCategorias);
  }
};

module.exports = {
  getCategorias
};

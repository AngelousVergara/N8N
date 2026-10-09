const db = require('../config/db');
const { mockProductos } = require('../data/mockData');

const getProductos = async (req, res) => {
  try {
    const query = `
      SELECT 
        p.id_producto,
        p.id_categoria,
        c.nombre AS categoria,
        p.nombre,
        p.descripcion,
        p.imagen_url,
        p.es_pizza,
        json_agg(
          json_build_object(
            'id_presentacion', pp.id_presentacion,
            'tamano', t.nombre,
            'descripcion_tamano', t.descripcion,
            'precio', pp.precio,
            'sku', pp.sku
          ) ORDER BY pp.precio ASC
        ) AS presentaciones
      FROM productos p
      JOIN categorias c ON p.id_categoria = c.id_categoria
      JOIN producto_presentaciones pp ON p.id_producto = pp.id_producto
      JOIN tamanos t ON pp.id_tamano = t.id_tamano
      WHERE p.activo = TRUE AND pp.activo = TRUE
      GROUP BY p.id_producto, p.id_categoria, c.nombre, c.orden_visualizacion, p.nombre, p.descripcion, p.imagen_url, p.es_pizza
      ORDER BY c.orden_visualizacion ASC, p.id_producto ASC;
    `;
    const result = await db.query(query);
    if (result.rows && result.rows.length > 0) {
      return res.json(result.rows);
    }
    return res.json(mockProductos);
  } catch (error) {
    console.warn('[Productos] Usando catálogo de respaldo:', error.message);
    const { categoria } = req.query;
    if (categoria) {
      return res.json(mockProductos.filter(p => p.id_categoria == categoria));
    }
    return res.json(mockProductos);
  }
};

const getProductoById = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT 
        p.id_producto,
        p.id_categoria,
        c.nombre AS categoria,
        p.nombre,
        p.descripcion,
        p.imagen_url,
        p.es_pizza,
        json_agg(
          json_build_object(
            'id_presentacion', pp.id_presentacion,
            'tamano', t.nombre,
            'descripcion_tamano', t.descripcion,
            'precio', pp.precio,
            'sku', pp.sku
          ) ORDER BY pp.precio ASC
        ) AS presentaciones
      FROM productos p
      JOIN categorias c ON p.id_categoria = c.id_categoria
      JOIN producto_presentaciones pp ON p.id_producto = pp.id_producto
      JOIN tamanos t ON pp.id_tamano = t.id_tamano
      WHERE p.id_producto = $1 AND p.activo = TRUE
      GROUP BY p.id_producto, p.id_categoria, c.nombre, p.nombre, p.descripcion, p.imagen_url, p.es_pizza;
    `;
    const result = await db.query(query, [id]);
    if (result.rows && result.rows.length > 0) {
      return res.json(result.rows[0]);
    }
    const fallback = mockProductos.find(p => p.id_producto == id);
    if (fallback) return res.json(fallback);
    return res.status(404).json({ error: 'Producto no encontrado' });
  } catch (error) {
    console.warn('[ProductoPorId] Usando catálogo de respaldo:', error.message);
    const fallback = mockProductos.find(p => p.id_producto == id);
    if (fallback) return res.json(fallback);
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
};

module.exports = {
  getProductos,
  getProductoById
};

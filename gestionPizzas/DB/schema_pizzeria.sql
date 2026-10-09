-- =============================================================================
-- MODELO DE DATOS PARA GESTIÓN DE PIZZERÍA (POSTGRESQL)
-- Base de Datos: gestionPizza
-- =============================================================================

-- 1. TIPOS ENUMERADOS (Opcionales para consistencia de estados)
DO $$ BEGIN
    CREATE TYPE tipo_entrega_enum AS ENUM ('DELIVERY', 'RETIRO_LOCAL', 'CONSUMO_LOCAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE estado_pedido_enum AS ENUM (
        'PENDIENTE',
        'CONFIRMADO',
        'EN_PREPARACION',
        'EN_CAMINO',
        'ENTREGADO',
        'CANCELADO'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE estado_pago_enum AS ENUM ('PENDIENTE', 'PAGADO', 'RECHAZADO', 'REEMBOLSADO');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE metodo_pago_enum AS ENUM ('EFECTIVO', 'TARJETA_DEBITO', 'TARJETA_CREDITO', 'TRANSFERENCIA');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================================================
-- 2. TABLAS DE CLIENTES Y DIRECCIONES
-- =============================================================================

CREATE TABLE IF NOT EXISTS clientes (
    id_cliente BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(150) UNIQUE,
    fecha_registro TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    notas TEXT
);

CREATE TABLE IF NOT EXISTS direcciones_cliente (
    id_direccion BIGSERIAL PRIMARY KEY,
    id_cliente BIGINT NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    numero_depto_casa VARCHAR(50),
    referencia VARCHAR(255),
    ciudad VARCHAR(100) DEFAULT 'Ciudad Principal',
    es_principal BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_direccion_cliente 
        FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE CASCADE
);

-- =============================================================================
-- 3. CATÁLOGO DE PRODUCTOS (CATEGORÍAS, PRODUCTOS Y PRESENTACIONES/TAMAÑOS)
-- =============================================================================

CREATE TABLE IF NOT EXISTS categorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    orden_visualizacion INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS tamanos (
    id_tamano SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,       -- Ej: 'Individual', 'Mediana', 'Familiar', '350ml', '1.5L', 'Porción'
    descripcion VARCHAR(150),                 -- Ej: '4 porciones', '8 porciones', '12 porciones'
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS productos (
    id_producto BIGSERIAL PRIMARY KEY,
    id_categoria INT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    imagen_url VARCHAR(500),                   -- Opción A (Recomendada): Enlace a S3, Cloudinary, MinIO o servidor local
    imagen_binaria BYTEA,                      -- Opción B: Datos del archivo guardados directamente en PostgreSQL
    imagen_mime VARCHAR(50),                   -- Ej: 'image/jpeg', 'image/png', 'image/webp'
    es_pizza BOOLEAN DEFAULT FALSE,            -- Facilita filtros para personalización o masa
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_producto_categoria 
        FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE RESTRICT
);

-- Tabla para galería de imágenes (permite múltiples fotos por producto, ej: fotos de detalle, elaboración o tamaños)
CREATE TABLE IF NOT EXISTS producto_imagenes (
    id_imagen BIGSERIAL PRIMARY KEY,
    id_producto BIGINT NOT NULL,
    titulo VARCHAR(100),
    imagen_url VARCHAR(500),
    imagen_binaria BYTEA,                      -- Opcional para almacenamiento directo en BD
    imagen_mime VARCHAR(50),
    es_portada BOOLEAN DEFAULT FALSE,
    orden INT DEFAULT 0,
    creado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_imagen_producto 
        FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE
);

-- Presentación/Variante con su respectivo precio (Una pizza puede ser Mediana o Familiar; una bebida Lata o 1.5L)
CREATE TABLE IF NOT EXISTS producto_presentaciones (
    id_presentacion BIGSERIAL PRIMARY KEY,
    id_producto BIGINT NOT NULL,
    id_tamano INT NOT NULL,
    precio NUMERIC(10, 2) NOT NULL CHECK (precio >= 0),
    sku VARCHAR(50) UNIQUE,
    activo BOOLEAN DEFAULT TRUE,
    CONSTRAINT uq_producto_tamano UNIQUE (id_producto, id_tamano),
    CONSTRAINT fk_presentacion_producto 
        FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE,
    CONSTRAINT fk_presentacion_tamano 
        FOREIGN KEY (id_tamano) REFERENCES tamanos(id_tamano) ON DELETE RESTRICT
);

-- Opcional: Ingredientes / Toppings para personalización de pizzas
CREATE TABLE IF NOT EXISTS ingredientes (
    id_ingrediente SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    precio_adicional NUMERIC(10, 2) DEFAULT 0.00 CHECK (precio_adicional >= 0),
    disponible BOOLEAN DEFAULT TRUE
);

-- =============================================================================
-- 4. ÓRDENES / PEDIDOS Y DETALLES
-- =============================================================================

CREATE TABLE IF NOT EXISTS pedidos (
    id_pedido BIGSERIAL PRIMARY KEY,
    id_cliente BIGINT,                                  -- Puede ser NULL si es venta directa en caja
    id_direccion BIGINT,                                -- Requerido solo si tipo_entrega = DELIVERY
    fecha_pedido TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    tipo_entrega tipo_entrega_enum NOT NULL DEFAULT 'DELIVERY',
    estado estado_pedido_enum NOT NULL DEFAULT 'PENDIENTE',
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (subtotal >= 0),
    costo_envio NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (costo_envio >= 0),
    descuento NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (descuento >= 0),
    total NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (total >= 0),
    instrucciones_entrega TEXT,
    observaciones TEXT,
    fecha_entrega_estimada TIMESTAMPTZ,
    actualizado_en TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pedido_cliente 
        FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE SET NULL,
    CONSTRAINT fk_pedido_direccion 
        FOREIGN KEY (id_direccion) REFERENCES direcciones_cliente(id_direccion) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS detalles_pedido (
    id_detalle BIGSERIAL PRIMARY KEY,
    id_pedido BIGINT NOT NULL,
    id_presentacion BIGINT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(10, 2) NOT NULL CHECK (precio_unitario >= 0), -- Congela el precio al momento de la venta
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    notas_item VARCHAR(255),                                              -- Ej: "Sin cebolla", "Masa delgada"
    CONSTRAINT fk_detalle_pedido 
        FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    CONSTRAINT fk_detalle_presentacion 
        FOREIGN KEY (id_presentacion) REFERENCES producto_presentaciones(id_presentacion) ON DELETE RESTRICT
);

-- Ingredientes extra / modificaciones por ítem del pedido
CREATE TABLE IF NOT EXISTS detalle_pedido_ingredientes (
    id_detalle_ingrediente BIGSERIAL PRIMARY KEY,
    id_detalle BIGINT NOT NULL,
    id_ingrediente INT NOT NULL,
    precio_adicional NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    CONSTRAINT fk_item_ingrediente_detalle 
        FOREIGN KEY (id_detalle) REFERENCES detalles_pedido(id_detalle) ON DELETE CASCADE,
    CONSTRAINT fk_item_ingrediente 
        FOREIGN KEY (id_ingrediente) REFERENCES ingredientes(id_ingrediente) ON DELETE RESTRICT
);

-- =============================================================================
-- 5. PAGOS
-- =============================================================================

CREATE TABLE IF NOT EXISTS pagos (
    id_pago BIGSERIAL PRIMARY KEY,
    id_pedido BIGINT NOT NULL,
    metodo_pago metodo_pago_enum NOT NULL,
    monto NUMERIC(10, 2) NOT NULL CHECK (monto > 0),
    estado_pago estado_pago_enum NOT NULL DEFAULT 'PENDIENTE',
    referencia_transaccion VARCHAR(150),
    fecha_pago TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pago_pedido 
        FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE
);

-- =============================================================================
-- 6. ÍNDICES RECOMENDADOS PARA RENDIMIENTO
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_clientes_telefono ON clientes(telefono);
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente ON pedidos(id_cliente);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_fecha ON pedidos(fecha_pedido);
CREATE INDEX IF NOT EXISTS idx_detalles_pedido_pedido ON detalles_pedido(id_pedido);
CREATE INDEX IF NOT EXISTS idx_producto_pres_producto ON producto_presentaciones(id_producto);

-- =============================================================================
-- 7. VISTAS DE CONSULTA ÚTILES
-- =============================================================================

-- Vista para consultar la carta / menú con precios y tamaños
CREATE OR REPLACE VIEW v_menu_disponible AS
SELECT 
    c.nombre AS categoria,
    p.id_producto,
    p.nombre AS producto,
    p.descripcion,
    p.imagen_url,
    t.nombre AS tamano,
    t.descripcion AS porciones,
    pp.id_presentacion,
    pp.precio,
    pp.sku
FROM productos p
JOIN categorias c ON p.id_categoria = c.id_categoria
JOIN producto_presentaciones pp ON p.id_producto = pp.id_producto
JOIN tamanos t ON pp.id_tamano = t.id_tamano
WHERE p.activo = TRUE AND pp.activo = TRUE AND c.activo = TRUE
ORDER BY c.orden_visualizacion, p.nombre, pp.precio;

-- Vista para monitorear pedidos en cocina y despacho
CREATE OR REPLACE VIEW v_pedidos_activos AS
SELECT 
    ped.id_pedido,
    ped.fecha_pedido,
    ped.estado,
    ped.tipo_entrega,
    CONCAT(cli.nombre, ' ', cli.apellido) AS cliente,
    cli.telefono,
    dir.direccion AS direccion_entrega,
    ped.total,
    COUNT(det.id_detalle) AS total_items
FROM pedidos ped
LEFT JOIN clientes cli ON ped.id_cliente = cli.id_cliente
LEFT JOIN direcciones_cliente dir ON ped.id_direccion = dir.id_direccion
LEFT JOIN detalles_pedido det ON ped.id_pedido = det.id_pedido
WHERE ped.estado IN ('PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'EN_CAMINO')
GROUP BY ped.id_pedido, cli.nombre, cli.apellido, cli.telefono, dir.direccion
ORDER BY ped.fecha_pedido ASC;

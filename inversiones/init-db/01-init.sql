-- ====================================================================
-- Esquema de Base de Datos para Scraping Bolsa de Santiago en N8N
-- Compatible con PostgreSQL 16 y PostgREST API
-- ====================================================================

-- Esquema interno para n8n (para no mezclar tablas del sistema con datos financieros)
CREATE SCHEMA IF NOT EXISTS n8n_internal;

-- 1. Tabla de Snapshots del IPSA Principal
CREATE TABLE IF NOT EXISTS ipsa_snapshots (
    id BIGSERIAL PRIMARY KEY,
    fecha_captura TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fecha_mercado VARCHAR(50),
    precio NUMERIC(14, 4) NOT NULL,
    variacion_pct NUMERIC(8, 4) NOT NULL,
    variacion_puntos NUMERIC(14, 4),
    min_dia NUMERIC(14, 4),
    max_dia NUMERIC(14, 4),
    rent_mes_fecha NUMERIC(8, 4),
    rent_1m NUMERIC(8, 4),
    rent_3m NUMERIC(8, 4),
    rent_6m NUMERIC(8, 4),
    rent_ytd NUMERIC(8, 4),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ipsa_fecha ON ipsa_snapshots (fecha_captura DESC);

-- 2. Tabla de Snapshots de Acciones del IPSA (30 acciones)
CREATE TABLE IF NOT EXISTS acciones_ipsa_snapshots (
    id BIGSERIAL PRIMARY KEY,
    fecha_captura TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    symbol VARCHAR(30) NOT NULL,
    nombre VARCHAR(150),
    precio NUMERIC(14, 4) NOT NULL,
    variacion_pct NUMERIC(8, 4) NOT NULL,
    direccion VARCHAR(10), -- 'green' / 'red' / 'off'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_acciones_symbol_fecha ON acciones_ipsa_snapshots (symbol, fecha_captura DESC);
CREATE INDEX IF NOT EXISTS idx_acciones_fecha ON acciones_ipsa_snapshots (fecha_captura DESC);

-- 3. Tabla de Indicadores Económicos (UF, UTM, Dólar Observado, IPC, Tasas)
CREATE TABLE IF NOT EXISTS indicadores_economicos_snapshots (
    id BIGSERIAL PRIMARY KEY,
    fecha_captura TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    nombre VARCHAR(50) NOT NULL,
    valor NUMERIC(16, 4) NOT NULL,
    variacion_pct NUMERIC(8, 4),
    direccion VARCHAR(10),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_indicadores_nombre_fecha ON indicadores_economicos_snapshots (nombre, fecha_captura DESC);

-- 4. Tabla de Commodities (Cobre Cash, Cobre Futuro, Petróleo, Oro, etc.)
CREATE TABLE IF NOT EXISTS commodities_snapshots (
    id BIGSERIAL PRIMARY KEY,
    fecha_captura TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    nombre VARCHAR(50) NOT NULL,
    valor NUMERIC(14, 4) NOT NULL,
    variacion_pct NUMERIC(8, 4),
    direccion VARCHAR(10),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_commodities_nombre_fecha ON commodities_snapshots (nombre, fecha_captura DESC);

-- 5. Tabla de Índices Sectoriales
CREATE TABLE IF NOT EXISTS indices_sectoriales_snapshots (
    id BIGSERIAL PRIMARY KEY,
    fecha_captura TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    codigo VARCHAR(50) NOT NULL,
    puntos NUMERIC(14, 4) NOT NULL,
    variacion_pct NUMERIC(8, 4) NOT NULL,
    direccion VARCHAR(10),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sectoriales_codigo_fecha ON indices_sectoriales_snapshots (codigo, fecha_captura DESC);

-- 6. Tabla de Mayores Alzas, Bajas y Más Transadas
CREATE TABLE IF NOT EXISTS mercado_tops_snapshots (
    id BIGSERIAL PRIMARY KEY,
    fecha_captura TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    tipo VARCHAR(20) NOT NULL, -- 'alza', 'baja', 'mas_transada'
    posicion INT NOT NULL,
    symbol VARCHAR(30) NOT NULL,
    precio NUMERIC(14, 4) NOT NULL,
    variacion_pct NUMERIC(8, 4) NOT NULL,
    direccion VARCHAR(10),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tops_tipo_fecha ON mercado_tops_snapshots (tipo, fecha_captura DESC);

-- ====================================================================
-- VISTAS OPTIMIZADAS PARA POSTGREST API (ÚLTIMO VALOR REGISTRADO)
-- ====================================================================

-- Vista con el último snapshot del IPSA
CREATE OR REPLACE VIEW v_ipsa_latest AS
SELECT DISTINCT ON (true)
    id,
    fecha_captura,
    fecha_mercado,
    precio,
    variacion_pct,
    variacion_puntos,
    min_dia,
    max_dia,
    rent_mes_fecha,
    rent_1m,
    rent_3m,
    rent_6m,
    rent_ytd
FROM ipsa_snapshots
ORDER BY true, fecha_captura DESC;

-- Vista con la última cotización de cada acción del IPSA
CREATE OR REPLACE VIEW v_acciones_latest AS
SELECT DISTINCT ON (symbol)
    symbol,
    nombre,
    precio,
    variacion_pct,
    direccion,
    fecha_captura
FROM acciones_ipsa_snapshots
ORDER BY symbol, fecha_captura DESC;

-- Vista con el último valor de cada indicador económico
CREATE OR REPLACE VIEW v_indicadores_latest AS
SELECT DISTINCT ON (nombre)
    nombre,
    valor,
    variacion_pct,
    direccion,
    fecha_captura
FROM indicadores_economicos_snapshots
ORDER BY nombre, fecha_captura DESC;

-- Vista con el último valor de cada commodity
CREATE OR REPLACE VIEW v_commodities_latest AS
SELECT DISTINCT ON (nombre)
    nombre,
    valor,
    variacion_pct,
    direccion,
    fecha_captura
FROM commodities_snapshots
ORDER BY nombre, fecha_captura DESC;

-- Vista con los últimos índices sectoriales
CREATE OR REPLACE VIEW v_indices_sectoriales_latest AS
SELECT DISTINCT ON (codigo)
    codigo,
    puntos,
    variacion_pct,
    direccion,
    fecha_captura
FROM indices_sectoriales_snapshots
ORDER BY codigo, fecha_captura DESC;

-- ====================================================================
-- CONFIGURACIÓN DE SEGURIDAD Y PERMISOS PARA POSTGREST (ANON ROLE)
-- ====================================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'web_anon') THEN
        CREATE ROLE web_anon NOLOGIN;
    END IF;
END
$$;

GRANT USAGE ON SCHEMA public TO web_anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO web_anon;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO web_anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO web_anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON SEQUENCES TO web_anon;

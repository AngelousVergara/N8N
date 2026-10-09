-- =============================================================================
-- CONFIGURACIÓN DE USUARIO, BASE DE DATOS Y PERMISOS (POSTGRESQL)
-- NOTA: Este script debe ejecutarse conectado como superusuario (ej. 'postgres')
--
-- TIP RÁPIDO PARA DESARROLLO / LOCAL / N8N:
-- Para evitar cualquier problema de permisos con esquemas, puedes ejecutar directamente:
--    ALTER ROLE admin_pizzas WITH SUPERUSER;
-- =============================================================================

-- 1. Crear el usuario si no existe y definir su contraseña
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'admin_pizzas') THEN
        CREATE ROLE admin_pizzas WITH LOGIN PASSWORD 'pi4sh3h' SUPERUSER;
    ELSE
        ALTER ROLE admin_pizzas WITH PASSWORD 'pi4sh3h' SUPERUSER;
    END IF;
END $$;

-- 2. Crear la base de datos con admin_pizzas como propietario (si aún no existe)
-- Si la base de datos ya existe, le asignamos la propiedad:
ALTER DATABASE "gestionPizza" OWNER TO admin_pizzas;
GRANT ALL PRIVILEGES ON DATABASE "gestionPizza" TO admin_pizzas;

-- =============================================================================
-- 3. PERMISOS SOBRE EL ESQUEMA 'public' (Crucial en PostgreSQL 15+)
-- IMPORTANTE: Para ejecutar las siguientes líneas debes estar CONECTADO a la
-- base de datos 'gestionPizza' (por ejemplo usando: \c gestionPizza en psql
-- o seleccionando 'gestionPizza' en DBeaver/pgAdmin con el usuario postgres).
-- =============================================================================

-- Asignar a admin_pizzas como dueño del esquema public y otorgar todos los permisos:
ALTER SCHEMA public OWNER TO admin_pizzas;
GRANT ALL ON SCHEMA public TO admin_pizzas;
GRANT USAGE, CREATE ON SCHEMA public TO admin_pizzas;

-- Permisos sobre tablas, secuencias y tipos existentes:
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin_pizzas;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin_pizzas;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO admin_pizzas;
GRANT ALL PRIVILEGES ON ALL ROUTINES IN SCHEMA public TO admin_pizzas;

-- Permisos por defecto para cualquier objeto creado a futuro en el esquema:
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO admin_pizzas;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO admin_pizzas;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO admin_pizzas;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO admin_pizzas;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TYPES TO admin_pizzas;

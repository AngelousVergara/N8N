# Proyecto N8N: Scraping Bolsa de Santiago e Indicadores Económicos

Este proyecto proporciona una infraestructura completa y automatizada con **n8n**, **PostgreSQL** y **PostgREST** para la captura, procesamiento, almacenamiento y consulta en tiempo real de los datos bursátiles de la Bolsa de Comercio de Santiago y los principales indicadores económicos de Chile (desde el portal de Scotiabank Finmarkets).

---

## 🏗 Arquitectura del Sistema

```
                        ┌────────────────────────────────────────────────────────┐
                        │              Scotiabank Finmarkets Live                │
                        │  (corredora.html / inversiones.html - cada 5 mins)    │
                        └──────────────────────────┬─────────────────────────────┘
                                                   │ HTTP GET
                                                   ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                          n8n                                            │
│  [Schedule Trigger (cada 5m)] ──► [Filtro 08:30-16:30] ──► [HTTP Requests & Parser]     │
│                                                                   │                     │
│  [Webhook GET /latest] ◄──────────────────────────────────────────┴─────┐               │
└────────────────────────────────────────┬────────────────────────────────┼───────────────┘
                                         │ INSERT Snapshots               │ SELECT
                                         ▼                                ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                   PostgreSQL 16                                         │
│  • Tablas: ipsa_snapshots, acciones_ipsa_snapshots, indicadores_economicos_snapshots   │
│  • Vistas: v_ipsa_latest, v_acciones_latest, v_indicadores_latest, v_commodities_latest │
└────────────────────────────────────────┬────────────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                   PostgREST API                                         │
│                  Exposición automática RESTful en http://localhost:3000                 │
│              (ej: GET /v_acciones_latest, GET /v_ipsa_latest?symbol=eq.SQM-B)           │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Características Principales

1. **Extracción Completa y Automática**:
   - **IPSA**: Precio actual, variación porcentual diaria, variación en puntos, mínimo y máximo del día, fecha bursátil y rentabilidad histórica (mes actual, 1M, 3M, 6M, año a la fecha).
   - **30 Acciones del IPSA**: Nemotécnico, Razón Social, Precio, Variación % y tendencia (`AGUAS-A`, `CHILE`, `BCI`, `ITAUCL`, `BSANTANDER`, `CAP`, `CENCOSUD`, `CCU`, `VAPORES`, `FALABELLA`, `LTM`, `SQM-B`, etc.).
   - **Indicadores Económicos**: Dólar Observado, UF, UTM, IPC, Tasas de Depósito a Plazo.
   - **Commodities**: Cobre Cash (USD/lb), Cobre Futuro, Petróleo Crudo, Oro, Plata, Celulosa.
   - **Índices Sectoriales & Tops**: IGPA, INDUSTRIAL, FINANCLS, Mayores Alzas y Mayores Bajas.
2. **Horario Bursátil Configurado**:
   - Se ejecuta **cada 5 minutos de lunes a viernes entre las 08:30 y las 16:30 hrs** (horario de operación de la Bolsa de Santiago, zona horaria `America/Santiago`).
   - Posee un trigger manual ("Test Manual") para probar el flujo en cualquier momento (incluso fuera de horario o fines de semana).
3. **Persistencia en PostgreSQL**:
   - Guarda snapshots en series temporales para análisis histórico y backtesting.
4. **Doble Opción de API REST para tus aplicaciones**:
   - **Opción A (PostgREST)**: Consulta ultrarrápida directa sobre la base de datos en `http://localhost:3000`.
   - **Opción B (Webhook n8n)**: Endpoint en n8n `http://localhost:5678/webhook/bolsa-santiago/latest`.

---

## 🚀 Puesta en Marcha Rápida (Quickstart)

### 1. Requisitos Previos
- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/) instalados.

### 2. Levantar los Servicios
En la carpeta raíz del proyecto, ejecuta:

```bash
docker compose up -d
```

Esto levantará automáticamente 3 contenedores:
- **n8n**: `http://localhost:5678`
- **PostgREST API**: `http://localhost:3000`
- **PostgreSQL**: `localhost:5432` (con el esquema `init-db/01-init.sql` ya ejecutado)

Verifica el estado con:
```bash
docker compose ps
```

---

## 📥 Importar el Flujo en N8N

1. Abre tu navegador en **`http://localhost:5678`**.
2. Completa la configuración inicial de tu usuario en n8n si es la primera vez.
3. En el menú lateral izquierdo, ve a **Workflows** y haz clic en **Add Workflow**.
4. Haz clic en el botón de tres puntos `...` (arriba a la derecha) y selecciona **Import from File...**.
5. Selecciona el archivo:
   ```
   workflows/bolsa_santiago_scraper.json
   ```
6. **Configurar Credencial de PostgreSQL**:
   - En n8n, ve a **Credentials** > **Add Credential** > busca **Postgres**.
   - Ingresa los siguientes datos (coincidentes con el `docker-compose.yml`):
     - **Host**: `postgres`
     - **Database**: `bolsa_santiago`
     - **User**: `n8n_user`
     - **Password**: `n8n_secret_password`
     - **Port**: `5432`
     - **SSL**: `allow` o `disable`
   - Nómbrala **`Postgres Bolsa Santiago`** y guárdala.
7. Haz clic en el botón **Save** del Workflow y luego activa el switch **Active** para que comience a ejecutarse cada 5 minutos en horario hábil.
8. Para probarlo de inmediato, haz clic en el botón **Test workflow**.

---

## 🌐 Consumo de la API REST

Una vez que los datos son guardados, puedes consumirlos inmediatamente en cualquier frontend, dashboard, Excel, Python o app móvil:

### 1. A través de PostgREST (`http://localhost:3000`)

PostgREST convierte automáticamente las vistas en endpoints HTTP RESTful:

| Endpoint | Descripción |
| :--- | :--- |
| `GET http://localhost:3000/v_ipsa_latest` | Último valor registrado del IPSA y rentabilidad |
| `GET http://localhost:3000/v_acciones_latest` | Último precio de todas las 30 acciones del IPSA |
| `GET http://localhost:3000/v_acciones_latest?symbol=eq.SQM-B` | Precio específico de SQM-B |
| `GET http://localhost:3000/v_indicadores_latest` | Últimos valores de Dólar Observado, UF, UTM e IPC |
| `GET http://localhost:3000/v_commodities_latest` | Últimos precios de Cobre Cash, Futuro, Petróleo, Oro |
| `GET http://localhost:3000/v_indices_sectoriales_latest` | Puntos de índices sectoriales |
| `GET http://localhost:3000/acciones_ipsa_snapshots?symbol=eq.CHILE&order=fecha_captura.desc&limit=50` | Historial de las últimas 50 cotizaciones de Banco de Chile |

Ejemplo con `curl`:
```bash
curl -s http://localhost:3000/v_acciones_latest?symbol=eq.FALABELLA | jq .
```

### 2. A través del Webhook de N8N (`http://localhost:5678`)

Puedes hacer un GET al endpoint del webhook configurado en el flujo:
```bash
curl -s http://localhost:5678/webhook/bolsa-santiago/latest
```
Retorna un payload JSON unificado con:
```json
{
  "data": {
    "ipsa": { "precio": 11137.23, "variacion_pct": -1.06, ... },
    "acciones": [ ... ],
    "indicadores": [ ... ],
    "commodities": [ ... ],
    "indices_sectoriales": [ ... ]
  }
}
```

---

## 🧪 Script de Prueba Standalone (Sin Docker)

Si deseas probar la extracción de datos por consola sin necesidad de levantar los contenedores:

```bash
node scripts/test_scraper.js
```

Este script ejecuta el parser sobre las fuentes de Scotiabank y muestra en la terminal la estructura de datos extraída y formateada.

---

## 🗄 Esquema de Tablas en PostgreSQL

- **`ipsa_snapshots`**: Registro temporal del índice IPSA principal.
- **`acciones_ipsa_snapshots`**: Registro temporal por acción del IPSA (symbol, nombre, precio, variacion_pct, direccion).
- **`indicadores_economicos_snapshots`**: Registro de Dólar Observado, UF, UTM, IPC y depósitos.
- **`commodities_snapshots`**: Registro de Cobre, Petróleo, Oro, etc.
- **`indices_sectoriales_snapshots`**: Puntos y variación por sector.
- **`mercado_tops_snapshots`**: Mayores alzas, bajas y más transadas.
- **`v_acciones_latest`**: Vista optimizada con el último registro de cada acción.
- **`v_ipsa_latest`**: Vista con el último registro del IPSA.
- **`v_indicadores_latest`**: Vista con el último registro de cada indicador económico.

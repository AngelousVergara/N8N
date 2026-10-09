# 🍕 Pizzeria Italia - Aplicación Web Completa

Este proyecto contiene la solución web completa para **Pizzeria Italia**, desarrollada sobre el modelo de datos relacional de **PostgreSQL**, con un backend API en **Node.js** y un frontend reactivo en **Angular**, con estética y funcionalidades inspiradas en [pizzeriaitalia.cl](https://pizzeriaitalia.cl/).

---

## 📁 Estructura del Proyecto

```text
gestionPizzas/
├── DB/
│   ├── gestionPizzasUser.sql     # Script de creación de usuario, base de datos y permisos
│   ├── schema_pizzeria.sql       # DDL: Tablas, relaciones, tipos ENUM, índices y vistas
│   └── seed_pizzeria.sql         # Catálogo completo con promociones, pizzas, papas, helados
├── SITIO_WEB/
│   ├── demo-en-vivo.html         # 🚀 Vista previa inmediata ejecutable con doble clic en el navegador
│   ├── backend/                  # API REST con Node.js, Express y PostgreSQL (pg)
│   │   ├── src/
│   │   │   ├── config/db.js      # Conexión y Pool de PostgreSQL
│   │   │   ├── controllers/      # Controladores (productos, categorías, pedidos)
│   │   │   ├── routes/           # Rutas Express
│   │   │   └── server.js         # Servidor principal (puerto 3001)
│   │   ├── .env                  # Configuración de base de datos
│   │   └── package.json
│   └── frontend/                 # Aplicación Frontend moderna en Angular
│       ├── src/
│       │   ├── app/
│       │   │   ├── components/   # Navbar, Hero, ProductCard, CartDrawer, OrderModal
│       │   │   ├── services/     # PizzeriaService (API) y CartService (Signals)
│       │   │   ├── models/       # Interfaces TypeScript
│       │   │   └── app.component.ts
│       │   ├── index.html
│       │   └── styles.css
│       ├── angular.json
│       ├── tsconfig.json
│       └── package.json
```

---

## ⚡ 1. Vista Previa Inmediata

Puedes abrir directamente el archivo [**`SITIO_WEB/demo-en-vivo.html`**](file:///Users/angelousvergara/Desktop/workspace_all/workspace_n8n/gestionPizzas/SITIO_WEB/demo-en-vivo.html) en tu navegador (doble clic o arrastrar a Chrome/Safari).

Incluye:
* Catálogo interactivo con las 6 categorías: **Promociones & Combos, Pizzas Tradicionales, Pizzas Especiales, Papas Fritas & Acompañamientos, Bebidas y Helados & Postres**.
* Selector dinámico de tamaños (*Individual, Mediana, Familiar, 350ml, 1.5L*) con actualización de precios en vivo.
* Carrito de compras lateral con selector de *Delivery* / *Retiro en Local*.
* Formulario de checkout y pantalla de confirmación con número de orden.

---

## 🚀 2. Ejecutar el Backend (Node.js)

1. Ingresa a la carpeta del backend:
   ```bash
   cd SITIO_WEB/backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor:
   ```bash
   npm start
   # o en modo desarrollo:
   npm run dev
   ```
4. El servidor quedará disponible en `http://localhost:3001`:
   * `GET http://localhost:3001/api/categorias`
   * `GET http://localhost:3001/api/productos`
   * `POST http://localhost:3001/api/pedidos`
   * `GET http://localhost:3001/api/health`

---

## 🅰️ 3. Ejecutar el Frontend (Angular)

1. Ingresa a la carpeta del frontend:
   ```bash
   cd SITIO_WEB/frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia la aplicación Angular:
   ```bash
   npm start
   ```
4. Abre tu navegador en **`http://localhost:4200`**.

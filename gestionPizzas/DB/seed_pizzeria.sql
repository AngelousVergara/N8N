-- =============================================================================
-- DATOS DE EJEMPLO / SEED PARA PIZZERÍA (POSTGRESQL)
-- =============================================================================

-- 1. Categorías
INSERT INTO categorias (nombre, descripcion, orden_visualizacion) VALUES
('Promociones & Combos', 'Ofertas especiales para compartir y disfrutar al mejor precio', 1),
('Pizzas Tradicionales', 'Las recetas clásicas italianas favoritas de todos', 2),
('Pizzas Especiales', 'Recetas gourmet con ingredientes de alta calidad', 3),
('Papas Fritas & Acompañamientos', 'Papas crocantes, bastones de ajo y complementos', 4),
('Bebidas', 'Gaseosas, jugos y aguas', 5),
('Helados & Postres', 'Gelato artesanal italiano y postres tradicionales', 6)
ON CONFLICT (nombre) DO NOTHING;

-- 2. Tamaños / Formatos
INSERT INTO tamanos (nombre, descripcion) VALUES
('Individual', '4 porciones - 20 cm'),
('Mediana', '8 porciones - 30 cm'),
('Familiar', '12 porciones - 40 cm'),
('Lata 350ml', 'Formato individual'),
('Botella 1.5L', 'Formato familiar'),
('Porción Mediana', 'Porción para compartir 1-2 personas'),
('Porción Familiar', 'Porción para compartir 3-4 personas'),
('Pote 500ml', 'Gelato artesanal para 2-3 personas'),
('Porción Estándar', 'Unidad estándar de acompañamiento/postre')
ON CONFLICT (nombre) DO NOTHING;

-- 3. Productos
INSERT INTO productos (id_categoria, nombre, descripcion, imagen_url, es_pizza) VALUES
-- Promociones & Combos
(1, 'Promo Dúo Familiar', '2 Pizzas Familiares a elección + 1 Bebida 1.5L + Palitos de Ajo', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80', FALSE),
(1, 'Combo Italia Personal', '1 Pizza Individual Margherita o Pepperoni + 1 Porción de Papas Fritas + 1 Bebida 350ml', 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80', FALSE),

-- Pizzas Tradicionales
(2, 'Pizza Margherita', 'Salsa de tomate casera, queso mozzarella, albahaca fresca y aceite de oliva', 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80', TRUE),
(2, 'Pizza Pepperoni', 'Salsa de tomate, doble mozzarella y rodajas de pepperoni americano', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80', TRUE),

-- Pizzas Especiales
(3, 'Pizza Cuatro Quesos', 'Salsa blanca, mozzarella, gorgonzola, parmesano y queso de cabra', 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=800&q=80', TRUE),
(3, 'Pizza BBQ Pollo & Tocino', 'Salsa BBQ ahumada, mozzarella, pechuga de pollo marinada, tocino crocante y cebolla morada', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80', TRUE),

-- Papas Fritas & Acompañamientos
(4, 'Papas Fritas Rústicas Clásicas', 'Papas naturales corte grueso, doradas y crujientes con sal de mar y orégano', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80', FALSE),
(4, 'Papas Fritas Loaded Cheddar & Bacon', 'Papas rústicas cubiertas de salsa cheddar fundido y trozos crocantes de tocino', 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80', FALSE),
(4, 'Palitos de Ajo con Queso', '6 bastones de masa artesanal horneada con mantequilla de ajo y mozzarella gratinado', 'https://images.unsplash.com/photo-1619895092538-128341789043?auto=format&fit=crop&w=800&q=80', FALSE),

-- Bebidas
(5, 'Coca-Cola Original', 'Bebida gaseosa refrescante', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80', FALSE),
(5, 'Coca-Cola Sin Azúcar', 'Bebida gaseosa cero calorías', 'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=800&q=80', FALSE),
(5, 'Sprite', 'Bebida gaseosa sabor lima-limón', 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=800&q=80', FALSE),

-- Helados & Postres
(6, 'Gelato Artesanal Chocolate Belga & Avellanas', 'Cremoso helado italiano de chocolate belga con trozos de avellanas tostadas', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80', FALSE),
(6, 'Gelato Artesanal Frutos del Bosque', 'Helado italiano a base de frambuesas, moras y arándanos frescos', 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=80', FALSE),
(6, 'Tiramisú Artesanal', 'Clásico postre italiano con bizcocho empapado en café, crema mascarpone y cacao amargo', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80', FALSE);

-- 4. Presentaciones y Precios
-- Asignamos precios a las pizzas por tamaño:
-- Margherita: Individual ($5.990), Mediana ($9.990), Familiar ($13.990)
INSERT INTO producto_presentaciones (id_producto, id_tamano, precio, sku)
SELECT p.id_producto, t.id_tamano, 5990.00, 'PIZ-MAR-IND'
FROM productos p, tamanos t WHERE p.nombre = 'Pizza Margherita' AND t.nombre = 'Individual';

INSERT INTO producto_presentaciones (id_producto, id_tamano, precio, sku)
SELECT p.id_producto, t.id_tamano, 9990.00, 'PIZ-MAR-MED'
FROM productos p, tamanos t WHERE p.nombre = 'Pizza Margherita' AND t.nombre = 'Mediana';

INSERT INTO producto_presentaciones (id_producto, id_tamano, precio, sku)
SELECT p.id_producto, t.id_tamano, 13990.00, 'PIZ-MAR-FAM'
FROM productos p, tamanos t WHERE p.nombre = 'Pizza Margherita' AND t.nombre = 'Familiar';

-- Pepperoni: Individual ($6.490), Mediana ($10.990), Familiar ($14.990)
INSERT INTO producto_presentaciones (id_producto, id_tamano, precio, sku)
SELECT p.id_producto, t.id_tamano, 6490.00, 'PIZ-PEP-IND'
FROM productos p, tamanos t WHERE p.nombre = 'Pizza Pepperoni' AND t.nombre = 'Individual';

INSERT INTO producto_presentaciones (id_producto, id_tamano, precio, sku)
SELECT p.id_producto, t.id_tamano, 10990.00, 'PIZ-PEP-MED'
FROM productos p, tamanos t WHERE p.nombre = 'Pizza Pepperoni' AND t.nombre = 'Mediana';

INSERT INTO producto_presentaciones (id_producto, id_tamano, precio, sku)
SELECT p.id_producto, t.id_tamano, 14990.00, 'PIZ-PEP-FAM'
FROM productos p, tamanos t WHERE p.nombre = 'Pizza Pepperoni' AND t.nombre = 'Familiar';

-- Promociones:
INSERT INTO producto_presentaciones (id_producto, id_tamano, precio, sku)
SELECT p.id_producto, t.id_tamano, 22990.00, 'PROMO-DUO-FAM'
FROM productos p, tamanos t WHERE p.nombre = 'Promo Dúo Familiar' AND t.nombre = 'Familiar';

INSERT INTO producto_presentaciones (id_producto, id_tamano, precio, sku)
SELECT p.id_producto, t.id_tamano, 8990.00, 'COMBO-ITA-IND'
FROM productos p, tamanos t WHERE p.nombre = 'Combo Italia Personal' AND t.nombre = 'Individual';

-- Pizzas Cuatro Quesos y BBQ:
INSERT INTO producto_presentaciones (id_producto, id_tamano, precio, sku)
SELECT p.id_producto, t.id_tamano, 6990.00, 'PIZ-4Q-IND'
FROM productos p, tamanos t WHERE p.nombre = 'Pizza Cuatro Quesos' AND t.nombre = 'Individual';

INSERT INTO producto_presentaciones (id_producto, id_tamano, precio, sku)
SELECT p.id_producto, t.id_tamano, 11490.00, 'PIZ-4Q-MED'
FROM productos p, tamanos t WHERE p.nombre = 'Pizza Cuatro Quesos' AND t.nombre = 'Mediana';

INSERT INTO producto_presentaciones (id_producto, id_tamano, precio, sku)
SELECT p.id_producto, t.id_tamano, 15990.00, 'PIZ-4Q-FAM'
FROM productos p, tamanos t WHERE p.nombre = 'Pizza Cuatro Quesos' AND t.nombre = 'Familiar';

INSERT INTO producto_presentaciones (id_producto, id_tamano, precio, sku)
SELECT p.id_producto, t.id_tamano, 11490.00, 'PIZ-BBQ-MED'
FROM productos p, tamanos t WHERE p.nombre = 'Pizza BBQ Pollo & Tocino' AND t.nombre = 'Mediana';

INSERT INTO producto_presentaciones (id_producto, id_tamano, precio, sku)
SELECT p.id_producto, t.id_tamano, 15990.00, 'PIZ-BBQ-FAM'
FROM productos p, tamanos t WHERE p.nombre = 'Pizza BBQ Pollo & Tocino' AND t.nombre = 'Familiar';

-- Papas Fritas & Acompañamientos:
INSERT INTO producto_presentaciones (id_producto, id_tamano, precio, sku)
SELECT p.id_producto, t.id_tamano, 4490.00, 'PAP-RUS-MED'
FROM productos p, tamanos t WHERE p.nombre = 'Papas Fritas Rústicas Clásicas' AND t.nombre = 'Porción Mediana';

INSERT INTO producto_presentaciones (id_producto, id_tamano, precio, sku)
SELECT p.id_producto, t.id_tamano, 6490.00, 'PAP-RUS-FAM'
FROM productos p, tamanos t WHERE p.nombre = 'Papas Fritas Rústicas Clásicas' AND t.nombre = 'Porción Familiar';

INSERT INTO producto_presentaciones (id_producto, id_tamano, precio, sku)
SELECT p.id_producto, t.id_tamano, 5490.00, 'PAP-LOAD-MED'
FROM productos p, tamanos t WHERE p.nombre = 'Papas Fritas Loaded Cheddar & Bacon' AND t.nombre = 'Porción Mediana';

INSERT INTO producto_presentaciones (id_producto, id_tamano, precio, sku)
SELECT p.id_producto, t.id_tamano, 7990.00, 'PAP-LOAD-FAM'
FROM productos p, tamanos t WHERE p.nombre = 'Papas Fritas Loaded Cheddar & Bacon' AND t.nombre = 'Porción Familiar';

INSERT INTO producto_presentaciones (id_producto, id_tamano, precio, sku)
SELECT p.id_producto, t.id_tamano, 4990.00, 'ENT-PAN-AJO'
FROM productos p, tamanos t WHERE p.nombre = 'Palitos de Ajo con Queso' AND t.nombre = 'Porción Estándar';

-- Bebidas:
INSERT INTO producto_presentaciones (id_producto, id_tamano, precio, sku)
SELECT p.id_producto, t.id_tamano, 1500.00, 'BEB-CC-350'
FROM productos p, tamanos t WHERE p.nombre = 'Coca-Cola Original' AND t.nombre = 'Lata 350ml';

INSERT INTO producto_presentaciones (id_producto, id_tamano, precio, sku)
SELECT p.id_producto, t.id_tamano, 2800.00, 'BEB-CC-150'
FROM productos p, tamanos t WHERE p.nombre = 'Coca-Cola Original' AND t.nombre = 'Botella 1.5L';

INSERT INTO producto_presentaciones (id_producto, id_tamano, precio, sku)
SELECT p.id_producto, t.id_tamano, 1500.00, 'BEB-CCZ-350'
FROM productos p, tamanos t WHERE p.nombre = 'Coca-Cola Sin Azúcar' AND t.nombre = 'Lata 350ml';

INSERT INTO producto_presentaciones (id_producto, id_tamano, precio, sku)
SELECT p.id_producto, t.id_tamano, 1500.00, 'BEB-SPR-350'
FROM productos p, tamanos t WHERE p.nombre = 'Sprite' AND t.nombre = 'Lata 350ml';

-- Helados & Postres:
INSERT INTO producto_presentaciones (id_producto, id_tamano, precio, sku)
SELECT p.id_producto, t.id_tamano, 5990.00, 'HEL-CHOC-500'
FROM productos p, tamanos t WHERE p.nombre = 'Gelato Artesanal Chocolate Belga & Avellanas' AND t.nombre = 'Pote 500ml';

INSERT INTO producto_presentaciones (id_producto, id_tamano, precio, sku)
SELECT p.id_producto, t.id_tamano, 5990.00, 'HEL-FRUT-500'
FROM productos p, tamanos t WHERE p.nombre = 'Gelato Artesanal Frutos del Bosque' AND t.nombre = 'Pote 500ml';

INSERT INTO producto_presentaciones (id_producto, id_tamano, precio, sku)
SELECT p.id_producto, t.id_tamano, 3990.00, 'POS-TIR-001'
FROM productos p, tamanos t WHERE p.nombre = 'Tiramisú Artesanal' AND t.nombre = 'Porción Estándar';

-- Galería de imágenes adicionales (ejemplo: fotos secundarias o tomas en ángulo)
INSERT INTO producto_imagenes (id_producto, titulo, imagen_url, es_portada, orden)
SELECT p.id_producto, 'Primer plano horneado crujiente', 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80', FALSE, 1
FROM productos p WHERE p.nombre = 'Pizza Pepperoni';

INSERT INTO producto_imagenes (id_producto, titulo, imagen_url, es_portada, orden)
SELECT p.id_producto, 'Corte con queso derretido', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80', FALSE, 2
FROM productos p WHERE p.nombre = 'Pizza Margherita';

-- 5. Ingredientes / Extras disponibles
INSERT INTO ingredientes (nombre, precio_adicional) VALUES
('Extra Mozzarella', 1200.00),
('Champiñones Frescos', 900.00),
('Tocino Crujiente', 1200.00),
('Jalapeños en Rodajas', 800.00),
('Cebolla Caramelizada', 800.00),
('Aceitunas Negras', 700.00)
ON CONFLICT (nombre) DO NOTHING;

-- 6. Clientes y Direcciones de ejemplo
INSERT INTO clientes (nombre, apellido, telefono, email, notas) VALUES
('Carlos', 'González', '+56911223344', 'carlos.gonzalez@example.com', 'Cliente frecuente'),
('Valentina', 'Pérez', '+56999887766', 'vale.perez@example.com', 'Prefiere delivery en conserjería')
ON CONFLICT (email) DO NOTHING;

INSERT INTO direcciones_cliente (id_cliente, direccion, numero_depto_casa, referencia, es_principal)
SELECT id_cliente, 'Av. Providencia 1234', 'Depto 402', 'Frente a estación de metro', TRUE
FROM clientes WHERE email = 'carlos.gonzalez@example.com';

INSERT INTO direcciones_cliente (id_cliente, direccion, numero_depto_casa, referencia, es_principal)
SELECT id_cliente, 'Calle Los Alerces 567', 'Casa 12', 'Condominio cerrado', TRUE
FROM clientes WHERE email = 'vale.perez@example.com';

-- 7. Pedido de ejemplo completo
DO $$
DECLARE
    v_cliente_id BIGINT;
    v_direccion_id BIGINT;
    v_pedido_id BIGINT;
    v_item_pizza_id BIGINT;
    v_item_bebida_id BIGINT;
    v_pres_pizza BIGINT;
    v_pres_bebida BIGINT;
    v_precio_pizza NUMERIC(10,2);
    v_precio_bebida NUMERIC(10,2);
BEGIN
    SELECT id_cliente INTO v_cliente_id FROM clientes WHERE email = 'carlos.gonzalez@example.com';
    SELECT id_direccion INTO v_direccion_id FROM direcciones_cliente WHERE id_cliente = v_cliente_id AND es_principal = TRUE;

    -- Presentación Pizza Pepperoni Familiar
    SELECT pp.id_presentacion, pp.precio INTO v_pres_pizza, v_precio_pizza
    FROM producto_presentaciones pp
    JOIN productos p ON pp.id_producto = p.id_producto
    JOIN tamanos t ON pp.id_tamano = t.id_tamano
    WHERE p.nombre = 'Pizza Pepperoni' AND t.nombre = 'Familiar';

    -- Presentación Coca-Cola 1.5L
    SELECT pp.id_presentacion, pp.precio INTO v_pres_bebida, v_precio_bebida
    FROM producto_presentaciones pp
    JOIN productos p ON pp.id_producto = p.id_producto
    JOIN tamanos t ON pp.id_tamano = t.id_tamano
    WHERE p.nombre = 'Coca-Cola Original' AND t.nombre = 'Botella 1.5L';

    -- Crear Pedido
    INSERT INTO pedidos (
        id_cliente, id_direccion, tipo_entrega, estado, 
        subtotal, costo_envio, descuento, total, instrucciones_entrega
    ) VALUES (
        v_cliente_id, v_direccion_id, 'DELIVERY', 'EN_PREPARACION',
        (v_precio_pizza + v_precio_bebida), 2000.00, 0.00, (v_precio_pizza + v_precio_bebida + 2000.00),
        'Dejar en conserjería a nombre de Carlos'
    ) RETURNING id_pedido INTO v_pedido_id;

    -- Detalle 1: Pizza Pepperoni Familiar
    INSERT INTO detalles_pedido (id_pedido, id_presentacion, cantidad, precio_unitario, subtotal, notas_item)
    VALUES (v_pedido_id, v_pres_pizza, 1, v_precio_pizza, v_precio_pizza, 'Bien dorada por favor')
    RETURNING id_detalle INTO v_item_pizza_id;

    -- Extra: Extra Mozzarella a la Pizza
    INSERT INTO detalle_pedido_ingredientes (id_detalle, id_ingrediente, precio_adicional)
    SELECT v_item_pizza_id, id_ingrediente, precio_adicional
    FROM ingredientes WHERE nombre = 'Extra Mozzarella';

    -- Detalle 2: Coca-Cola 1.5L
    INSERT INTO detalles_pedido (id_pedido, id_presentacion, cantidad, precio_unitario, subtotal)
    VALUES (v_pedido_id, v_pres_bebida, 1, v_precio_bebida, v_precio_bebida);

    -- Registro del Pago
    INSERT INTO pagos (id_pedido, metodo_pago, monto, estado_pago, referencia_transaccion)
    VALUES (v_pedido_id, 'TARJETA_DEBITO', (v_precio_pizza + v_precio_bebida + 2000.00), 'PAGADO', 'TX-987654321');
END $$;

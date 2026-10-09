const mockCategorias = [
  { id_categoria: 1, nombre: 'Promociones & Combos', descripcion: 'Ofertas especiales para compartir y disfrutar al mejor precio', orden_visualizacion: 1 },
  { id_categoria: 2, nombre: 'Pizzas Tradicionales', descripcion: 'Las recetas clásicas italianas favoritas de todos', orden_visualizacion: 2 },
  { id_categoria: 3, nombre: 'Pizzas Especiales', descripcion: 'Recetas gourmet con ingredientes de alta calidad', orden_visualizacion: 3 },
  { id_categoria: 4, nombre: 'Papas Fritas & Acompañamientos', descripcion: 'Papas crocantes, bastones de ajo y complementos', orden_visualizacion: 4 },
  { id_categoria: 5, nombre: 'Bebidas', descripcion: 'Gaseosas, jugos y aguas', orden_visualizacion: 5 },
  { id_categoria: 6, nombre: 'Helados & Postres', descripcion: 'Gelato artesanal italiano y postres tradicionales', orden_visualizacion: 6 }
];

const mockProductos = [
  {
    id_producto: 1,
    id_categoria: 1,
    categoria: 'Promociones & Combos',
    nombre: 'Promo Dúo Familiar',
    descripcion: '2 Pizzas Familiares a elección + 1 Bebida 1.5L + Palitos de Ajo',
    imagen_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    es_pizza: false,
    presentaciones: [
      { id_presentacion: 1, tamano: 'Familiar', descripcion_tamano: '2 Pizzas 12 porciones', precio: 22990, sku: 'PROMO-DUO-FAM' }
    ]
  },
  {
    id_producto: 2,
    id_categoria: 1,
    categoria: 'Promociones & Combos',
    nombre: 'Combo Italia Personal',
    descripcion: '1 Pizza Individual Margherita o Pepperoni + 1 Porción de Papas Fritas + 1 Bebida 350ml',
    imagen_url: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80',
    es_pizza: false,
    presentaciones: [
      { id_presentacion: 2, tamano: 'Individual', descripcion_tamano: '1 persona', precio: 8990, sku: 'COMBO-ITA-IND' }
    ]
  },
  {
    id_producto: 3,
    id_categoria: 2,
    categoria: 'Pizzas Tradicionales',
    nombre: 'Pizza Margherita',
    descripcion: 'Salsa de tomate San Marzano casera, queso mozzarella fior di latte, albahaca fresca y aceite de oliva virgen extra',
    imagen_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
    es_pizza: true,
    presentaciones: [
      { id_presentacion: 3, tamano: 'Individual', descripcion_tamano: '4 porciones - 20 cm', precio: 5990, sku: 'PIZ-MAR-IND' },
      { id_presentacion: 4, tamano: 'Mediana', descripcion_tamano: '8 porciones - 30 cm', precio: 9990, sku: 'PIZ-MAR-MED' },
      { id_presentacion: 5, tamano: 'Familiar', descripcion_tamano: '12 porciones - 40 cm', precio: 13990, sku: 'PIZ-MAR-FAM' }
    ]
  },
  {
    id_producto: 4,
    id_categoria: 2,
    categoria: 'Pizzas Tradicionales',
    nombre: 'Pizza Pepperoni',
    descripcion: 'Salsa de tomate, doble mozzarella premium gratinada y abundante pepperoni americano artesanal crocante',
    imagen_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    es_pizza: true,
    presentaciones: [
      { id_presentacion: 6, tamano: 'Individual', descripcion_tamano: '4 porciones - 20 cm', precio: 6490, sku: 'PIZ-PEP-IND' },
      { id_presentacion: 7, tamano: 'Mediana', descripcion_tamano: '8 porciones - 30 cm', precio: 10990, sku: 'PIZ-PEP-MED' },
      { id_presentacion: 8, tamano: 'Familiar', descripcion_tamano: '12 porciones - 40 cm', precio: 14990, sku: 'PIZ-PEP-FAM' }
    ]
  },
  {
    id_producto: 5,
    id_categoria: 3,
    categoria: 'Pizzas Especiales',
    nombre: 'Pizza Cuatro Quesos',
    descripcion: 'Base blanca cremosa, mozzarella, gorgonzola italiano, queso provolone y lluvia de parmesano reggiano',
    imagen_url: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=800&q=80',
    es_pizza: true,
    presentaciones: [
      { id_presentacion: 9, tamano: 'Individual', descripcion_tamano: '4 porciones - 20 cm', precio: 6990, sku: 'PIZ-4Q-IND' },
      { id_presentacion: 10, tamano: 'Mediana', descripcion_tamano: '8 porciones - 30 cm', precio: 11490, sku: 'PIZ-4Q-MED' },
      { id_presentacion: 11, tamano: 'Familiar', descripcion_tamano: '12 porciones - 40 cm', precio: 15990, sku: 'PIZ-4Q-FAM' }
    ]
  },
  {
    id_producto: 6,
    id_categoria: 3,
    categoria: 'Pizzas Especiales',
    nombre: 'Pizza BBQ Pollo & Tocino',
    descripcion: 'Salsa BBQ ahumada, queso mozzarella fundido, pechuga marinada al romero, tocino ahumado crocante y cebolla morada',
    imagen_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    es_pizza: true,
    presentaciones: [
      { id_presentacion: 12, tamano: 'Mediana', descripcion_tamano: '8 porciones - 30 cm', precio: 11490, sku: 'PIZ-BBQ-MED' },
      { id_presentacion: 13, tamano: 'Familiar', descripcion_tamano: '12 porciones - 40 cm', precio: 15990, sku: 'PIZ-BBQ-FAM' }
    ]
  },
  {
    id_producto: 7,
    id_categoria: 4,
    categoria: 'Papas Fritas & Acompañamientos',
    nombre: 'Papas Fritas Rústicas Clásicas',
    descripcion: 'Papas naturales seleccionadas corte grueso, doradas y crujientes con sal marina de Cáhuil y orégano',
    imagen_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
    es_pizza: false,
    presentaciones: [
      { id_presentacion: 14, tamano: 'Porción Mediana', descripcion_tamano: '1-2 personas (300g)', precio: 4490, sku: 'PAP-RUS-MED' },
      { id_presentacion: 15, tamano: 'Porción Familiar', descripcion_tamano: '3-4 personas (600g)', precio: 6490, sku: 'PAP-RUS-FAM' }
    ]
  },
  {
    id_producto: 8,
    id_categoria: 4,
    categoria: 'Papas Fritas & Acompañamientos',
    nombre: 'Papas Fritas Loaded Cheddar & Bacon',
    descripcion: 'Papas rústicas bañadas en cremosa salsa cheddar fundido y abundante tocino crujiente picado',
    imagen_url: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80',
    es_pizza: false,
    presentaciones: [
      { id_presentacion: 16, tamano: 'Porción Mediana', descripcion_tamano: '1-2 personas (350g)', precio: 5490, sku: 'PAP-LOAD-MED' },
      { id_presentacion: 17, tamano: 'Porción Familiar', descripcion_tamano: '3-4 personas (700g)', precio: 7990, sku: 'PAP-LOAD-FAM' }
    ]
  },
  {
    id_producto: 9,
    id_categoria: 4,
    categoria: 'Papas Fritas & Acompañamientos',
    nombre: 'Palitos de Ajo con Queso',
    descripcion: '6 bastones de masa artesanal horneada al horno de leña, bañados en mantequilla de ajo y mozzarella gratinado',
    imagen_url: 'https://images.unsplash.com/photo-1619895092538-128341789043?auto=format&fit=crop&w=800&q=80',
    es_pizza: false,
    presentaciones: [
      { id_presentacion: 18, tamano: 'Porción Estándar', descripcion_tamano: '6 unidades', precio: 4990, sku: 'ENT-PAN-AJO' }
    ]
  },
  {
    id_producto: 10,
    id_categoria: 5,
    categoria: 'Bebidas',
    nombre: 'Coca-Cola Original',
    descripcion: 'Gaseosa refrescante helada',
    imagen_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    es_pizza: false,
    presentaciones: [
      { id_presentacion: 19, tamano: 'Lata 350ml', descripcion_tamano: 'Individual', precio: 1500, sku: 'BEB-CC-350' },
      { id_presentacion: 20, tamano: 'Botella 1.5L', descripcion_tamano: 'Familiar', precio: 2800, sku: 'BEB-CC-150' }
    ]
  },
  {
    id_producto: 11,
    id_categoria: 5,
    categoria: 'Bebidas',
    nombre: 'Coca-Cola Sin Azúcar',
    descripcion: 'Gaseosa refrescante helada cero calorías',
    imagen_url: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=800&q=80',
    es_pizza: false,
    presentaciones: [
      { id_presentacion: 21, tamano: 'Lata 350ml', descripcion_tamano: 'Individual', precio: 1500, sku: 'BEB-CCZ-350' }
    ]
  },
  {
    id_producto: 12,
    id_categoria: 5,
    categoria: 'Bebidas',
    nombre: 'Sprite',
    descripcion: 'Gaseosa sabor lima-limón helada',
    imagen_url: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=800&q=80',
    es_pizza: false,
    presentaciones: [
      { id_presentacion: 22, tamano: 'Lata 350ml', descripcion_tamano: 'Individual', precio: 1500, sku: 'BEB-SPR-350' }
    ]
  },
  {
    id_producto: 13,
    id_categoria: 6,
    categoria: 'Helados & Postres',
    nombre: 'Gelato Artesanal Chocolate Belga & Avellanas',
    descripcion: 'Cremoso helado italiano de chocolate belga puro con trozos crujientes de avellanas tostadas',
    imagen_url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
    es_pizza: false,
    presentaciones: [
      { id_presentacion: 23, tamano: 'Pote 500ml', descripcion_tamano: '2-3 personas (500ml)', precio: 5990, sku: 'HEL-CHOC-500' }
    ]
  },
  {
    id_producto: 14,
    id_categoria: 6,
    categoria: 'Helados & Postres',
    nombre: 'Gelato Artesanal Frutos del Bosque',
    descripcion: 'Helado italiano refrescante elaborado con frambuesas, moras y arándanos silvestres frescos',
    imagen_url: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=80',
    es_pizza: false,
    presentaciones: [
      { id_presentacion: 24, tamano: 'Pote 500ml', descripcion_tamano: '2-3 personas (500ml)', precio: 5990, sku: 'HEL-FRUT-500' }
    ]
  },
  {
    id_producto: 15,
    id_categoria: 6,
    categoria: 'Helados & Postres',
    nombre: 'Tiramisú Artesanal',
    descripcion: 'Clásico postre italiano con bizcocho savoiardi empapado en café espresso, suave crema mascarpone y cacao amargo',
    imagen_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
    es_pizza: false,
    presentaciones: [
      { id_presentacion: 25, tamano: 'Porción Estándar', descripcion_tamano: '1 porción individual', precio: 3990, sku: 'POS-TIR-001' }
    ]
  }
];

module.exports = {
  mockCategorias,
  mockProductos
};

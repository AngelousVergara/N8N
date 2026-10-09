import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Categoria } from '../models/categoria.model';
import { Producto } from '../models/producto.model';
import { PedidoRequest, PedidoResponse } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PizzeriaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3001/api';

  // Catálogo de respaldo directo en frontend si la API no está corriendo
  private mockCategorias: Categoria[] = [
    { id_categoria: 1, nombre: 'Promociones & Combos', descripcion: 'Ofertas especiales para compartir', orden_visualizacion: 1 },
    { id_categoria: 2, nombre: 'Pizzas Tradicionales', descripcion: 'Las recetas clásicas italianas', orden_visualizacion: 2 },
    { id_categoria: 3, nombre: 'Pizzas Especiales', descripcion: 'Recetas gourmet con ingredientes de alta calidad', orden_visualizacion: 3 },
    { id_categoria: 4, nombre: 'Papas Fritas & Acompañamientos', descripcion: 'Papas crocantes y complementos', orden_visualizacion: 4 },
    { id_categoria: 5, nombre: 'Bebidas', descripcion: 'Gaseosas y refrescos helados', orden_visualizacion: 5 },
    { id_categoria: 6, nombre: 'Helados & Postres', descripcion: 'Gelato artesanal italiano y postres', orden_visualizacion: 6 }
  ];

  private mockProductos: Producto[] = [
    {
      id_producto: 1,
      id_categoria: 1,
      categoria: 'Promociones & Combos',
      nombre: 'Promo Dúo Familiar',
      descripcion: '2 Pizzas Familiares a elección + 1 Bebida 1.5L + Palitos de Ajo al horno',
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
      descripcion: '1 Pizza Individual Margherita o Pepperoni + 1 Porción Papas Fritas + 1 Bebida 350ml',
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
      descripcion: 'Salsa de tomate casera San Marzano, mozzarella fior di latte, albahaca fresca y aceite de oliva virgen extra',
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
      descripcion: 'Salsa de tomate casera, doble mozzarella artesanal gratinada y láminas crocantes de pepperoni americano',
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
      descripcion: 'Base blanca cremosa, mozzarella, gorgonzola italiano, queso provolone ahumado y lluvia de parmesano reggiano',
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
      descripcion: 'Salsa BBQ ahumada, mozzarella fundido, pechuga de pollo al romero, tocino crocante y finas plumas de cebolla morada',
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
      descripcion: 'Papas naturales corte grueso, doradas y crujientes con sal marina de Cáhuil y toque de orégano',
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
      descripcion: 'Papas rústicas cubiertas de salsa cheddar fundido y abundante tocino crocante picado',
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
      descripcion: 'Bebida gaseosa helada',
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
      descripcion: 'Bebida gaseosa cero azúcar helada',
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
      descripcion: 'Bebida gaseosa lima limón refrescante',
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
      descripcion: 'Cremoso helado italiano de puro chocolate belga con trozos crocantes de avellanas tostadas',
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
      descripcion: 'Helado artesanal refrescante a base de frambuesas, moras y arándanos frescos silvestres',
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
      descripcion: 'Receta tradicional italiana: savoiardi empapados en café espresso, mascarpone batido y cacao amargo',
      imagen_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
      es_pizza: false,
      presentaciones: [
        { id_presentacion: 25, tamano: 'Porción Estándar', descripcion_tamano: '1 porción individual', precio: 3990, sku: 'POS-TIR-001' }
      ]
    }
  ];

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/categorias`).pipe(
      catchError(() => of(this.mockCategorias))
    );
  }

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/productos`).pipe(
      catchError(() => of(this.mockProductos))
    );
  }

  crearPedido(pedido: PedidoRequest): Observable<PedidoResponse> {
    return this.http.post<PedidoResponse>(`${this.apiUrl}/pedidos`, pedido).pipe(
      catchError(() => of({
        success: true,
        id_pedido: Math.floor(1000 + Math.random() * 9000),
        fecha: new Date().toISOString(),
        total: pedido.items.reduce((s, i) => s + i.subtotal, 0) + (pedido.costo_envio || 0),
        estado: 'CONFIRMADO',
        mensaje: '¡Pedido enviado a cocina exitosamente!'
      }))
    );
  }
}

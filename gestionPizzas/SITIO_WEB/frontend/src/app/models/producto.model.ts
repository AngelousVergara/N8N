export interface Presentacion {
  id_presentacion: number;
  tamano: string;
  descripcion_tamano?: string;
  precio: number;
  sku: string;
}

export interface Producto {
  id_producto: number;
  id_categoria: number;
  categoria: string;
  nombre: string;
  descripcion: string;
  imagen_url: string;
  es_pizza: boolean;
  presentaciones: Presentacion[];
}

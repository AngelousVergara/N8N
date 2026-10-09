import { Producto, Presentacion } from './producto.model';

export interface CartItem {
  producto: Producto;
  presentacion: Presentacion;
  cantidad: number;
  notas?: string;
}

export interface ClienteData {
  nombre: string;
  apellido: string;
  telefono: string;
  email?: string;
}

export interface DireccionData {
  direccion: string;
  numero_depto_casa?: string;
  referencia?: string;
  ciudad?: string;
}

export interface PedidoRequest {
  cliente: ClienteData;
  direccion?: DireccionData;
  tipo_entrega: 'DELIVERY' | 'RETIRO_LOCAL';
  items: {
    id_presentacion: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    notas_item?: string;
  }[];
  metodo_pago: 'EFECTIVO' | 'TARJETA_DEBITO' | 'TARJETA_CREDITO' | 'TRANSFERENCIA';
  costo_envio: number;
  descuento: number;
  observaciones?: string;
}

export interface PedidoResponse {
  success: boolean;
  id_pedido: number;
  fecha: string;
  total: number;
  estado: string;
  mensaje: string;
}

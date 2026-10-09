import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/pedido.model';
import { Producto, Presentacion } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  items = signal<CartItem[]>([]);
  isCartOpen = signal<boolean>(false);
  tipoEntrega = signal<'DELIVERY' | 'RETIRO_LOCAL'>('DELIVERY');
  
  // Costo de despacho fijo para delivery
  costoEnvio = computed(() => {
    return this.tipoEntrega() === 'DELIVERY' ? 2000 : 0;
  });

  // Contador total de artículos en el carrito
  totalCount = computed(() => {
    return this.items().reduce((acc, item) => acc + item.cantidad, 0);
  });

  // Subtotal en pesos chilenos
  subtotal = computed(() => {
    return this.items().reduce((acc, item) => acc + (item.presentacion.precio * item.cantidad), 0);
  });

  // Total a pagar (subtotal + envío)
  total = computed(() => {
    return this.subtotal() + this.costoEnvio();
  });

  addToCart(producto: Producto, presentacion: Presentacion, cantidad = 1, notas = '') {
    this.items.update(currentItems => {
      // Buscar si el ítem con la misma presentación ya está en el carrito
      const existingIndex = currentItems.findIndex(
        i => i.producto.id_producto === producto.id_producto && 
             i.presentacion.id_presentacion === presentacion.id_presentacion
      );

      if (existingIndex > -1) {
        const updated = [...currentItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          cantidad: updated[existingIndex].cantidad + cantidad
        };
        return updated;
      }

      return [...currentItems, { producto, presentacion, cantidad, notas }];
    });

    // Abrir automáticamente el carrito al añadir producto
    this.isCartOpen.set(true);
  }

  updateQuantity(index: number, delta: number) {
    this.items.update(currentItems => {
      const updated = [...currentItems];
      const newQty = updated[index].cantidad + delta;
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      updated[index] = { ...updated[index], cantidad: newQty };
      return updated;
    });
  }

  removeItem(index: number) {
    this.items.update(items => items.filter((_, i) => i !== index));
  }

  clearCart() {
    this.items.set([]);
  }

  toggleCart(force?: boolean) {
    if (force !== undefined) {
      this.isCartOpen.set(force);
    } else {
      this.isCartOpen.update(v => !v);
    }
  }

  setTipoEntrega(tipo: 'DELIVERY' | 'RETIRO_LOCAL') {
    this.tipoEntrega.set(tipo);
  }
}

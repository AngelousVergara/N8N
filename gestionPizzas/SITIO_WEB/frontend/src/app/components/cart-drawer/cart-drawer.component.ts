import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { PizzeriaService } from '../../services/pizzeria.service';
import { PedidoRequest, PedidoResponse } from '../../models/pedido.model';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (cart.isCartOpen()) {
      <div class="drawer-backdrop" (click)="cart.toggleCart(false)"></div>
      
      <aside class="cart-drawer">
        <!-- Header del Carrito -->
        <div class="drawer-header">
          <div class="header-title">
            <h3>Tu Pedido</h3>
            <span class="items-count">{{ cart.totalCount() }} ítems</span>
          </div>
          <button class="close-btn" (click)="cart.toggleCart(false)">&times;</button>
        </div>

        <!-- Contenido / Items -->
        <div class="drawer-content">
          @if (cart.items().length === 0) {
            <div class="empty-cart">
              <span class="empty-icon">🍕</span>
              <h4>Tu carrito está vacío</h4>
              <p>Agrega pizzas crujientes, bebidas o papas para comenzar.</p>
              <button class="explore-btn" (click)="cart.toggleCart(false)">Ver la Carta</button>
            </div>
          } @else {
            <!-- Selector de Tipo de Entrega -->
            <div class="delivery-toggle">
              <button 
                type="button"
                class="toggle-btn" 
                [class.active]="cart.tipoEntrega() === 'DELIVERY'"
                (click)="cart.setTipoEntrega('DELIVERY')"
              >
                🛵 Delivery (+ \$2.000)
              </button>
              <button 
                type="button"
                class="toggle-btn" 
                [class.active]="cart.tipoEntrega() === 'RETIRO_LOCAL'"
                (click)="cart.setTipoEntrega('RETIRO_LOCAL')"
              >
                🏪 Retiro en Local (\$0)
              </button>
            </div>

            <!-- Lista de Productos en el Carrito -->
            <div class="cart-items-list">
              @for (item of cart.items(); track $index) {
                <div class="cart-item">
                  <img [src]="item.producto.imagen_url" [alt]="item.producto.nombre" class="item-img" />
                  
                  <div class="item-details">
                    <span class="item-name">{{ item.producto.nombre }}</span>
                    <span class="item-size">{{ item.presentacion.tamano }}</span>
                    <span class="item-price">\${{ item.presentacion.precio | number:'1.0-0' }}</span>
                  </div>

                  <!-- Control de Cantidad -->
                  <div class="quantity-controls">
                    <button class="qty-btn" (click)="cart.updateQuantity($index, -1)">-</button>
                    <span class="qty-value">{{ item.cantidad }}</span>
                    <button class="qty-btn" (click)="cart.updateQuantity($index, 1)">+</button>
                  </div>
                </div>
              }
            </div>

            <!-- Formulario de Checkout / Datos del Cliente -->
            <div class="checkout-form">
              <h4 class="form-title">Datos para tu Pedido</h4>

              <div class="form-row">
                <input 
                  type="text" 
                  [(ngModel)]="clienteNombre" 
                  placeholder="Tu Nombre y Apellido *" 
                  class="form-input"
                />
              </div>

              <div class="form-row">
                <input 
                  type="tel" 
                  [(ngModel)]="clienteTelefono" 
                  placeholder="Teléfono móvil (ej. +56 9 1234 5678) *" 
                  class="form-input"
                />
              </div>

              @if (cart.tipoEntrega() === 'DELIVERY') {
                <div class="form-row">
                  <input 
                    type="text" 
                    [(ngModel)]="direccionCalle" 
                    placeholder="Dirección (Calle y Número) *" 
                    class="form-input"
                  />
                </div>
                <div class="form-row">
                  <input 
                    type="text" 
                    [(ngModel)]="direccionDepto" 
                    placeholder="Depto / Casa / Timbre (Opcional)" 
                    class="form-input"
                  />
                </div>
              }

              <!-- Método de Pago -->
              <div class="payment-section">
                <label class="form-label">Método de Pago:</label>
                <div class="payment-options">
                  <label class="radio-label">
                    <input type="radio" [(ngModel)]="metodoPago" value="TARJETA_DEBITO" name="pago" />
                    <span>Tarjeta (Débito/Crédito)</span>
                  </label>
                  <label class="radio-label">
                    <input type="radio" [(ngModel)]="metodoPago" value="EFECTIVO" name="pago" />
                    <span>Efectivo</span>
                  </label>
                  <label class="radio-label">
                    <input type="radio" [(ngModel)]="metodoPago" value="TRANSFERENCIA" name="pago" />
                    <span>Transferencia</span>
                  </label>
                </div>
              </div>

              <div class="form-row">
                <input 
                  type="text" 
                  [(ngModel)]="observaciones" 
                  placeholder="Instrucciones especiales (ej. sin cebolla, tocar timbre)" 
                  class="form-input"
                />
              </div>
            </div>
          }
        </div>

        <!-- Footer con Resumen y Botón de Pago -->
        @if (cart.items().length > 0) {
          <div class="drawer-footer">
            <div class="summary-line">
              <span>Subtotal:</span>
              <span>\${{ cart.subtotal() | number:'1.0-0' }}</span>
            </div>
            
            <div class="summary-line">
              <span>Despacho:</span>
              <span>{{ cart.costoEnvio() === 0 ? 'Gratis' : ('$' + (cart.costoEnvio() | number:'1.0-0')) }}</span>
            </div>

            <div class="summary-total">
              <span>Total a Pagar:</span>
              <span class="total-amount">\${{ cart.total() | number:'1.0-0' }}</span>
            </div>

            <button 
              class="checkout-submit-btn" 
              [disabled]="loading || !clienteNombre || !clienteTelefono || (cart.tipoEntrega() === 'DELIVERY' && !direccionCalle)"
              (click)="realizarPedido()"
            >
              @if (loading) {
                <span>Enviando a cocina...</span>
              } @else {
                <span>Confirmar Pedido (\${{ cart.total() | number:'1.0-0' }})</span>
              }
            </button>
          </div>
        }
      </aside>
    }
  `,
  styles: [`
    .drawer-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(4px);
      z-index: 150;
      animation: fadeIn 0.2s ease;
    }

    .cart-drawer {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      max-width: 440px;
      background: #18181b;
      border-left: 1px solid #27272a;
      z-index: 160;
      display: flex;
      flex-direction: column;
      animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
    }

    .drawer-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #27272a;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #121214;
    }
    .header-title h3 {
      font-size: 1.25rem;
      font-weight: 800;
      color: #fafafa;
      margin: 0;
    }
    .items-count {
      font-size: 0.75rem;
      color: #a1a1aa;
    }
    .close-btn {
      background: #27272a;
      border: none;
      color: #d4d4d8;
      font-size: 1.5rem;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      display: grid;
      place-items: center;
      transition: all 0.2s;
    }
    .close-btn:hover { background: #3f3f46; color: white; }

    .drawer-content {
      flex: 1;
      overflow-y: auto;
      padding: 1.25rem;
    }

    .empty-cart {
      text-align: center;
      padding: 4rem 1rem;
      color: #a1a1aa;
    }
    .empty-icon { font-size: 3.5rem; display: block; margin-bottom: 1rem; }
    .empty-cart h4 { color: #f4f4f5; font-size: 1.2rem; margin-bottom: 0.5rem; }
    .explore-btn {
      margin-top: 1.5rem;
      background: #e11d48;
      color: white;
      border: none;
      padding: 0.65rem 1.5rem;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
    }

    .delivery-toggle {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
      background: #121214;
      padding: 0.35rem;
      border-radius: 10px;
      border: 1px solid #27272a;
    }
    .toggle-btn {
      flex: 1;
      background: transparent;
      border: none;
      color: #a1a1aa;
      padding: 0.55rem;
      font-size: 0.8rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .toggle-btn.active {
      background: #27272a;
      color: #f43f5e;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }

    .cart-items-list {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      margin-bottom: 1.5rem;
    }
    .cart-item {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      background: #121214;
      padding: 0.75rem;
      border-radius: 12px;
      border: 1px solid #27272a;
    }
    .item-img {
      width: 54px;
      height: 54px;
      border-radius: 8px;
      object-fit: cover;
    }
    .item-details {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .item-name {
      font-weight: 700;
      font-size: 0.9rem;
      color: #fafafa;
    }
    .item-size {
      font-size: 0.75rem;
      color: #a1a1aa;
    }
    .item-price {
      font-size: 0.88rem;
      font-weight: 700;
      color: #34d399;
      margin-top: 2px;
    }
    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      background: #27272a;
      padding: 0.2rem;
      border-radius: 8px;
    }
    .qty-btn {
      background: #3f3f46;
      border: none;
      color: white;
      width: 26px;
      height: 26px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 700;
      display: grid;
      place-items: center;
    }
    .qty-value {
      font-size: 0.85rem;
      font-weight: 700;
      color: white;
      min-width: 18px;
      text-align: center;
    }

    .checkout-form {
      background: #121214;
      padding: 1.2rem;
      border-radius: 12px;
      border: 1px solid #27272a;
    }
    .form-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: #f4f4f5;
      margin-bottom: 1rem;
    }
    .form-row {
      margin-bottom: 0.75rem;
    }
    .form-input {
      width: 100%;
      background: #18181b;
      border: 1px solid #27272a;
      color: white;
      padding: 0.65rem 0.85rem;
      border-radius: 8px;
      font-size: 0.85rem;
      outline: none;
      box-sizing: border-box;
    }
    .form-input:focus {
      border-color: #e11d48;
    }

    .payment-section {
      margin: 0.85rem 0;
    }
    .form-label {
      font-size: 0.75rem;
      color: #a1a1aa;
      display: block;
      margin-bottom: 0.4rem;
    }
    .payment-options {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .radio-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: #d4d4d8;
      cursor: pointer;
    }

    .drawer-footer {
      padding: 1.25rem 1.5rem;
      background: #121214;
      border-top: 1px solid #27272a;
    }
    .summary-line {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      color: #a1a1aa;
      margin-bottom: 0.4rem;
    }
    .summary-total {
      display: flex;
      justify-content: space-between;
      font-size: 1.15rem;
      font-weight: 800;
      color: #fafafa;
      margin: 0.75rem 0 1rem;
      padding-top: 0.6rem;
      border-top: 1px dashed #27272a;
    }
    .total-amount {
      color: #34d399;
    }
    .checkout-submit-btn {
      width: 100%;
      background: linear-gradient(135deg, #e11d48, #be123c);
      color: white;
      border: none;
      padding: 0.85rem;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(225, 29, 72, 0.4);
      transition: all 0.2s;
    }
    .checkout-submit-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
  `]
})
export class CartDrawerComponent {
  cart = inject(CartService);
  pizzeriaService = inject(PizzeriaService);

  @Output() orderSuccess = new EventEmitter<PedidoResponse>();

  // Campos del formulario
  clienteNombre = '';
  clienteTelefono = '';
  direccionCalle = '';
  direccionDepto = '';
  metodoPago: 'EFECTIVO' | 'TARJETA_DEBITO' | 'TARJETA_CREDITO' | 'TRANSFERENCIA' = 'TARJETA_DEBITO';
  observaciones = '';
  loading = false;

  realizarPedido() {
    if (!this.clienteNombre || !this.clienteTelefono) {
      alert('Por favor indica tu nombre y teléfono de contacto.');
      return;
    }

    if (this.cart.tipoEntrega() === 'DELIVERY' && !this.direccionCalle) {
      alert('Por favor ingresa la dirección de entrega.');
      return;
    }

    this.loading = true;

    const [nombre, ...resto] = this.clienteNombre.split(' ');
    const apellido = resto.join(' ') || 'Cliente';

    const pedidoRequest: PedidoRequest = {
      cliente: {
        nombre,
        apellido,
        telefono: this.clienteTelefono
      },
      tipo_entrega: this.cart.tipoEntrega(),
      costo_envio: this.cart.costoEnvio(),
      descuento: 0,
      metodo_pago: this.metodoPago,
      observaciones: this.observaciones,
      items: this.cart.items().map(item => ({
        id_presentacion: item.presentacion.id_presentacion,
        cantidad: item.cantidad,
        precio_unitario: item.presentacion.precio,
        subtotal: item.presentacion.precio * item.cantidad,
        notas_item: item.notas
      }))
    };

    if (this.cart.tipoEntrega() === 'DELIVERY') {
      pedidoRequest.direccion = {
        direccion: this.direccionCalle,
        numero_depto_casa: this.direccionDepto,
        ciudad: 'Santiago'
      };
    }

    this.pizzeriaService.crearPedido(pedidoRequest).subscribe({
      next: (res) => {
        this.loading = false;
        this.cart.clearCart();
        this.cart.toggleCart(false);
        this.orderSuccess.emit(res);
      },
      error: () => {
        this.loading = false;
        alert('Hubo un problema procesando el pedido. Por favor intenta nuevamente.');
      }
    });
  }
}

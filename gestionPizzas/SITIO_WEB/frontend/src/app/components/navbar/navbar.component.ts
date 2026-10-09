import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="navbar-wrapper">
      <!-- Barra tricolor italiana decorativa -->
      <div class="tricolore-bar">
        <span class="green"></span>
        <span class="white"></span>
        <span class="red"></span>
      </div>

      <nav class="navbar-container">
        <!-- Logo y Nombre -->
        <div class="brand-section">
          <div class="brand-logo">🍕</div>
          <div class="brand-info">
            <span class="brand-title">PIZZERIA ITALIA</span>
            <span class="brand-subtitle">Auténtica Tradición Napolitana</span>
          </div>
        </div>

        <!-- Estado del local / Horario -->
        <div class="store-badge">
          <span class="status-dot"></span>
          <div class="badge-text">
            <strong>Abierto Ahora</strong>
            <small>Delivery & Retiro en Local</small>
          </div>
        </div>

        <!-- Botón del Carrito de Compras -->
        <button class="cart-btn" (click)="cart.toggleCart(true)">
          <span class="cart-icon">🛒</span>
          <span class="cart-label">Tu Pedido</span>
          @if (cart.totalCount() > 0) {
            <span class="cart-badge">{{ cart.totalCount() }}</span>
            <span class="cart-total">\${{ cart.subtotal() | number:'1.0-0' }}</span>
          }
        </button>
      </nav>
    </header>
  `,
  styles: [`
    .navbar-wrapper {
      position: sticky;
      top: 0;
      z-index: 100;
      background-color: rgba(18, 18, 20, 0.95);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid #27272a;
    }
    .tricolore-bar {
      display: flex;
      height: 4px;
      width: 100%;
    }
    .tricolore-bar .green { flex: 1; background-color: #008c45; }
    .tricolore-bar .white { flex: 1; background-color: #f4f4f4; }
    .tricolore-bar .red { flex: 1; background-color: #cd212a; }

    .navbar-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0.85rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .brand-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
    }
    .brand-logo {
      font-size: 2.2rem;
      background: #27272a;
      width: 48px;
      height: 48px;
      display: grid;
      place-items: center;
      border-radius: 12px;
      border: 1px solid #3f3f46;
    }
    .brand-info {
      display: flex;
      flex-direction: column;
    }
    .brand-title {
      font-family: 'Cinzel', serif, Georgia;
      font-size: 1.35rem;
      font-weight: 800;
      letter-spacing: 1.5px;
      color: #fafafa;
    }
    .brand-subtitle {
      font-size: 0.75rem;
      color: #a1a1aa;
      letter-spacing: 0.5px;
    }

    .store-badge {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      background: #27272a;
      padding: 0.4rem 0.9rem;
      border-radius: 9999px;
      border: 1px solid #3f3f46;
    }
    .status-dot {
      width: 10px;
      height: 10px;
      background-color: #22c55e;
      border-radius: 50%;
      box-shadow: 0 0 10px #22c55e;
      animation: pulse 2s infinite;
    }
    .badge-text {
      display: flex;
      flex-direction: column;
      font-size: 0.78rem;
      color: #e4e4e7;
      line-height: 1.2;
    }
    .badge-text small {
      color: #a1a1aa;
      font-size: 0.7rem;
    }

    .cart-btn {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      background: linear-gradient(135deg, #e11d48, #be123c);
      color: #fff;
      border: none;
      padding: 0.6rem 1.15rem;
      border-radius: 9999px;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(225, 29, 72, 0.4);
      transition: all 0.2s ease;
    }
    .cart-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(225, 29, 72, 0.6);
    }
    .cart-badge {
      background: #fff;
      color: #be123c;
      font-size: 0.75rem;
      font-weight: 800;
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
    }
    .cart-total {
      font-size: 0.85rem;
      background: rgba(0, 0, 0, 0.25);
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    @media (max-width: 680px) {
      .store-badge { display: none; }
      .brand-title { font-size: 1.1rem; }
      .cart-label { display: none; }
    }
  `]
})
export class NavbarComponent {
  cart = inject(CartService);
}

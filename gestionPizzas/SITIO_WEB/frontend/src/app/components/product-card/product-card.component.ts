import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto, Presentacion } from '../../models/producto.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-card">
      <!-- Contenedor de Imagen -->
      <div class="image-wrapper">
        <img 
          [src]="producto.imagen_url" 
          [alt]="producto.nombre"
          loading="lazy"
          class="product-image"
        />
        
        <!-- Badges según tipo -->
        @if (producto.categoria.includes('Promociones')) {
          <span class="badge promo-badge">OFERTA ESPECIAL</span>
        } @else if (producto.es_pizza) {
          <span class="badge pizza-badge">A LA LEÑA</span>
        }

        @if (selectedPresentacion) {
          <span class="price-pill">\${{ selectedPresentacion.precio | number:'1.0-0' }}</span>
        }
      </div>

      <!-- Información del Producto -->
      <div class="card-body">
        <div class="category-tag">{{ producto.categoria }}</div>
        <h3 class="product-title">{{ producto.nombre }}</h3>
        <p class="product-description">{{ producto.descripcion }}</p>

        <!-- Selector de Tamaños / Presentaciones -->
        @if (producto.presentaciones.length > 1) {
          <div class="sizes-section">
            <span class="sizes-label">Selecciona tamaño o formato:</span>
            <div class="sizes-grid">
              @for (pres of producto.presentaciones; track pres.id_presentacion) {
                <button 
                  type="button"
                  class="size-btn"
                  [class.active]="selectedPresentacion?.id_presentacion === pres.id_presentacion"
                  (click)="selectPresentacion(pres)"
                >
                  <span class="size-name">{{ pres.tamano }}</span>
                  <span class="size-price">\${{ pres.precio | number:'1.0-0' }}</span>
                </button>
              }
            </div>
          </div>
        } @else if (selectedPresentacion && selectedPresentacion.descripcion_tamano) {
          <div class="single-size-info">
            <span>Formato: <strong>{{ selectedPresentacion.tamano }}</strong> ({{ selectedPresentacion.descripcion_tamano }})</span>
          </div>
        }

        <!-- Botón para Agregar al Carrito -->
        <div class="card-footer">
          <button 
            type="button"
            class="add-btn" 
            [disabled]="!selectedPresentacion"
            (click)="addToCart()"
          >
            <span>Agregar al Pedido</span>
            <strong>\${{ selectedPresentacion?.precio | number:'1.0-0' }}</strong>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: all 0.25s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    .product-card:hover {
      transform: translateY(-4px);
      border-color: #3f3f46;
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4);
    }

    .image-wrapper {
      position: relative;
      height: 210px;
      overflow: hidden;
      background: #27272a;
    }
    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }
    .product-card:hover .product-image {
      transform: scale(1.05);
    }

    .badge {
      position: absolute;
      top: 12px;
      left: 12px;
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.5px;
      padding: 0.3rem 0.65rem;
      border-radius: 9999px;
      text-transform: uppercase;
    }
    .promo-badge {
      background: #f59e0b;
      color: #18181b;
    }
    .pizza-badge {
      background: #e11d48;
      color: white;
    }

    .price-pill {
      position: absolute;
      bottom: 12px;
      right: 12px;
      background: rgba(18, 18, 20, 0.85);
      backdrop-filter: blur(8px);
      color: #34d399;
      font-weight: 800;
      font-size: 1.05rem;
      padding: 0.35rem 0.8rem;
      border-radius: 9999px;
      border: 1px solid rgba(52, 211, 153, 0.3);
    }

    .card-body {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .category-tag {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #a1a1aa;
      font-weight: 600;
      margin-bottom: 0.35rem;
    }
    .product-title {
      font-size: 1.2rem;
      font-weight: 700;
      color: #fafafa;
      margin-bottom: 0.5rem;
      line-height: 1.3;
    }
    .product-description {
      font-size: 0.88rem;
      color: #a1a1aa;
      line-height: 1.5;
      margin-bottom: 1rem;
      flex: 1;
    }

    .sizes-section {
      margin-bottom: 1.2rem;
    }
    .sizes-label {
      font-size: 0.75rem;
      color: #71717a;
      display: block;
      margin-bottom: 0.45rem;
      font-weight: 500;
    }
    .sizes-grid {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .size-btn {
      flex: 1;
      min-width: 75px;
      background: #27272a;
      border: 1px solid #3f3f46;
      color: #d4d4d8;
      padding: 0.45rem 0.6rem;
      border-radius: 8px;
      font-size: 0.8rem;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: all 0.2s ease;
    }
    .size-btn:hover {
      background: #3f3f46;
      border-color: #52525b;
    }
    .size-btn.active {
      background: rgba(225, 29, 72, 0.15);
      border-color: #e11d48;
      color: #fb7185;
      font-weight: 700;
    }
    .size-name {
      font-size: 0.75rem;
    }
    .size-price {
      font-size: 0.8rem;
      font-weight: 700;
      margin-top: 2px;
    }

    .single-size-info {
      font-size: 0.8rem;
      color: #71717a;
      margin-bottom: 1rem;
      padding: 0.35rem 0.6rem;
      background: #27272a;
      border-radius: 6px;
    }

    .card-footer {
      margin-top: auto;
    }
    .add-btn {
      width: 100%;
      background: linear-gradient(135deg, #e11d48, #be123c);
      color: white;
      border: none;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      font-size: 0.92rem;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(225, 29, 72, 0.3);
    }
    .add-btn:hover {
      background: linear-gradient(135deg, #f43f5e, #e11d48);
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(225, 29, 72, 0.5);
    }
    .add-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
  `]
})
export class ProductCardComponent implements OnInit {
  @Input({ required: true }) producto!: Producto;
  cart = inject(CartService);

  selectedPresentacion: Presentacion | null = null;

  ngOnInit() {
    if (this.producto.presentaciones && this.producto.presentaciones.length > 0) {
      // Por defecto seleccionar la primera presentación (más económica o estándar)
      this.selectedPresentacion = this.producto.presentaciones[0];
    }
  }

  selectPresentacion(pres: Presentacion) {
    this.selectedPresentacion = pres;
  }

  addToCart() {
    if (this.selectedPresentacion) {
      this.cart.addToCart(this.producto, this.selectedPresentacion, 1);
    }
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { CartDrawerComponent } from './components/cart-drawer/cart-drawer.component';
import { OrderSuccessModalComponent } from './components/order-success-modal/order-success-modal.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { PizzeriaService } from './services/pizzeria.service';
import { Producto } from './models/producto.model';
import { Categoria } from './models/categoria.model';
import { PedidoResponse } from './models/pedido.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    ProductCardComponent,
    CartDrawerComponent,
    OrderSuccessModalComponent,
    ChatbotComponent
  ],
  template: `
    <div class="app-layout">
      <!-- Navbar fija -->
      <app-navbar></app-navbar>

      <!-- Portada Hero estilo Pizzeria Italia -->
      <app-hero (scrollToCategory)="filtrarPorNombre($event)"></app-hero>

      <!-- Barra de Filtros por Categoría -->
      <div class="filter-sticky-wrapper">
        <div class="category-tabs-container">
          <button 
            class="tab-btn" 
            [class.active]="selectedCategoriaId === null"
            (click)="selectCategoria(null)"
          >
            🔥 Ver Todo el Menú
          </button>
          @for (cat of categorias; track cat.id_categoria) {
            <button 
              class="tab-btn" 
              [class.active]="selectedCategoriaId === cat.id_categoria"
              (click)="selectCategoria(cat.id_categoria)"
            >
              {{ getCategoryIcon(cat.nombre) }} {{ cat.nombre }}
            </button>
          }
        </div>
      </div>

      <!-- Sección de Catálogo / Galería de Productos -->
      <main class="menu-container">
        @if (loading) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Cargando menú artesanal...</p>
          </div>
        } @else {
          <!-- Conteo de productos mostrados -->
          <div class="catalog-header">
            <h2>
              {{ getActiveCategoryTitle() }}
              <span class="count-tag">({{ filteredProductos.length }} opciones)</span>
            </h2>
            <p class="catalog-subtitle">Precios en pesos chilenos (CLP) con IVA incluido.</p>
          </div>

          <div class="products-grid">
            @for (prod of filteredProductos; track prod.id_producto) {
              <app-product-card [producto]="prod"></app-product-card>
            }
          </div>
        }
      </main>

      <!-- Footer elegante -->
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-col">
            <div class="footer-brand">
              <span class="brand-emoji">🍕</span>
              <strong>PIZZERIA ITALIA</strong>
            </div>
            <p>El verdadero arte de la pizza italiana en horno de piedra y leña. Calidad, ingredientes nobles y tradición.</p>
          </div>

          <div class="footer-col">
            <h4>Horarios de Atención</h4>
            <p>Lunes a Jueves: 12:30 a 23:00 hrs</p>
            <p>Viernes y Sábado: 12:30 a 00:00 hrs</p>
            <p>Domingo: 13:00 a 22:30 hrs</p>
          </div>

          <div class="footer-col">
            <h4>Contacto & Pedidos</h4>
            <p>📍 Av. Providencia / Las Condes, Santiago</p>
            <p>📞 Delivery: +56 9 8765 4321</p>
            <p>✉️ contacto&#64;pizzeriaitalia.cl</p>
          </div>
        </div>

        <div class="footer-bottom">
          <p>© 2026 Pizzeria Italia. Todos los derechos reservados. Desarrollado con Node.js, PostgreSQL y Angular.</p>
        </div>
      </footer>

      <!-- Carrito Drawer Desplegable -->
      <app-cart-drawer (orderSuccess)="onOrderSuccess($event)"></app-cart-drawer>

      <!-- Modal de Éxito al Confirmar Pedido -->
      <app-order-success-modal 
        [order]="lastOrder" 
        (close)="lastOrder = null"
      ></app-order-success-modal>

      <!-- Chatbot Flotante conectado a N8N -->
      <app-chatbot></app-chatbot>
    </div>
  `,
  styles: [`
    .app-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: #0f0f11;
      color: #fafafa;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }

    .filter-sticky-wrapper {
      position: sticky;
      top: 68px;
      z-index: 90;
      background: rgba(15, 15, 17, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid #27272a;
      padding: 0.75rem 1rem;
    }
    .category-tabs-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      gap: 0.6rem;
      overflow-x: auto;
      padding-bottom: 0.25rem;
      scrollbar-width: none;
    }
    .category-tabs-container::-webkit-scrollbar { display: none; }

    .tab-btn {
      background: #1e1e22;
      color: #a1a1aa;
      border: 1px solid #2e2e33;
      padding: 0.55rem 1.15rem;
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 600;
      white-space: nowrap;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .tab-btn:hover {
      background: #27272a;
      color: #f4f4f5;
      border-color: #3f3f46;
    }
    .tab-btn.active {
      background: #e11d48;
      color: white;
      border-color: #e11d48;
      box-shadow: 0 2px 12px rgba(225, 29, 72, 0.4);
    }

    .menu-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2.5rem 1.5rem 4rem;
      flex: 1;
      width: 100%;
      box-sizing: border-box;
    }

    .catalog-header {
      margin-bottom: 2rem;
    }
    .catalog-header h2 {
      font-size: 1.85rem;
      font-weight: 800;
      color: #fafafa;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin: 0 0 0.4rem;
    }
    .count-tag {
      font-size: 0.9rem;
      color: #71717a;
      font-weight: 500;
    }
    .catalog-subtitle {
      font-size: 0.9rem;
      color: #a1a1aa;
      margin: 0;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.75rem;
    }

    .loading-state {
      text-align: center;
      padding: 5rem 0;
      color: #a1a1aa;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #27272a;
      border-top-color: #e11d48;
      border-radius: 50%;
      margin: 0 auto 1rem;
      animation: spin 0.8s linear infinite;
    }

    .footer {
      background: #121214;
      border-top: 1px solid #27272a;
      padding: 3.5rem 1.5rem 1.5rem;
      margin-top: auto;
    }
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2.5rem;
      margin-bottom: 2.5rem;
    }
    .footer-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.25rem;
      margin-bottom: 0.75rem;
      color: #fafafa;
    }
    .brand-emoji { font-size: 1.5rem; }
    .footer-col p {
      font-size: 0.88rem;
      color: #a1a1aa;
      line-height: 1.6;
      margin: 0.4rem 0;
    }
    .footer-col h4 {
      color: #fafafa;
      font-size: 1rem;
      margin-bottom: 1rem;
      font-weight: 700;
    }

    .footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      padding-top: 1.5rem;
      border-top: 1px solid #27272a;
      text-align: center;
      font-size: 0.8rem;
      color: #71717a;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class AppComponent implements OnInit {
  private pizzeriaService = inject(PizzeriaService);

  categorias: Categoria[] = [];
  productos: Producto[] = [];
  selectedCategoriaId: number | null = null;
  loading = true;
  lastOrder: PedidoResponse | null = null;

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.loading = true;
    this.pizzeriaService.getCategorias().subscribe(cats => {
      this.categorias = cats;
    });

    this.pizzeriaService.getProductos().subscribe(prods => {
      this.productos = prods;
      this.loading = false;
    });
  }

  get filteredProductos(): Producto[] {
    if (this.selectedCategoriaId === null) {
      return this.productos;
    }
    return this.productos.filter(p => p.id_categoria === this.selectedCategoriaId);
  }

  selectCategoria(catId: number | null) {
    this.selectedCategoriaId = catId;
  }

  filtrarPorNombre(nombreCat: string) {
    const cat = this.categorias.find(c => c.nombre.toLowerCase().includes(nombreCat.toLowerCase()));
    if (cat) {
      this.selectedCategoriaId = cat.id_categoria;
    }
  }

  getActiveCategoryTitle(): string {
    if (this.selectedCategoriaId === null) {
      return 'Carta Completa';
    }
    const cat = this.categorias.find(c => c.id_categoria === this.selectedCategoriaId);
    return cat ? cat.nombre : 'Menú';
  }

  getCategoryIcon(nombre: string): string {
    const n = nombre.toLowerCase();
    if (n.includes('promo') || n.includes('combo')) return '🔥';
    if (n.includes('tradicional')) return '🍕';
    if (n.includes('especial')) return '⭐';
    if (n.includes('papa') || n.includes('acompaña')) return '🍟';
    if (n.includes('bebida')) return '🥤';
    if (n.includes('helado') || n.includes('postre')) return '🍨';
    return '🍽️';
  }

  onOrderSuccess(order: PedidoResponse) {
    this.lastOrder = order;
  }
}

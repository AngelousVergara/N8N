import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-tag">🔥 HORNO A LA LEÑA 450°C • SANTIAGO, CHILE</div>
        <h1 class="hero-title">
          Auténtica Pizza Italiana
          <span class="gradient-text">Artesanal & Crujiente</span>
        </h1>
        <p class="hero-description">
          Elaboradas con masa madre de 48 horas de fermentación lenta, salsa de tomates San Marzano D.O.P. y mozzarella fior di latte gratinada a la perfección.
        </p>

        <!-- Botones de Acción Rápida -->
        <div class="hero-actions">
          <button class="btn-primary" (click)="scrollToCategory.emit('Promociones & Combos')">
            Ver Promociones 🔥
          </button>
          <button class="btn-secondary" (click)="scrollToCategory.emit('Pizzas Tradicionales')">
            Nuestras Pizzas 🍕
          </button>
        </div>

        <!-- Badges de Calidad -->
        <div class="quality-badges">
          <div class="badge-item">
            <span class="badge-icon">🌿</span>
            <span>Masa Madre 48h</span>
          </div>
          <div class="badge-item">
            <span class="badge-icon">🇮🇹</span>
            <span>Ingredientes Importados</span>
          </div>
          <div class="badge-item">
            <span class="badge-icon">⚡</span>
            <span>Delivery 35-45 min</span>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      position: relative;
      background: url('https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1800&q=80') center/cover no-repeat;
      padding: 5rem 1.5rem 4rem;
      border-bottom: 1px solid #27272a;
      overflow: hidden;
    }
    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(18, 18, 20, 0.82) 0%, rgba(18, 18, 20, 0.96) 100%);
    }
    .hero-content {
      position: relative;
      max-width: 900px;
      margin: 0 auto;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .hero-tag {
      display: inline-block;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: #f59e0b;
      background: rgba(245, 158, 11, 0.12);
      border: 1px solid rgba(245, 158, 11, 0.3);
      padding: 0.35rem 1rem;
      border-radius: 9999px;
      margin-bottom: 1.25rem;
    }
    .hero-title {
      font-size: clamp(2.2rem, 5vw, 3.8rem);
      font-weight: 900;
      color: #fafafa;
      line-height: 1.15;
      margin-bottom: 1.2rem;
      letter-spacing: -0.5px;
    }
    .gradient-text {
      display: block;
      background: linear-gradient(135deg, #fb7185, #f43f5e, #f59e0b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-description {
      font-size: 1.1rem;
      color: #d4d4d8;
      max-width: 680px;
      margin-bottom: 2rem;
      line-height: 1.6;
    }
    .hero-actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 2.5rem;
      flex-wrap: wrap;
      justify-content: center;
    }
    .btn-primary {
      background: linear-gradient(135deg, #e11d48, #be123c);
      color: white;
      border: none;
      padding: 0.85rem 1.75rem;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 18px rgba(225, 29, 72, 0.4);
      transition: all 0.2s ease;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(225, 29, 72, 0.6);
    }
    .btn-secondary {
      background: #27272a;
      color: #f4f4f5;
      border: 1px solid #3f3f46;
      padding: 0.85rem 1.75rem;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-secondary:hover {
      background: #3f3f46;
      color: white;
    }

    .quality-badges {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
      justify-content: center;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      width: 100%;
    }
    .badge-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.88rem;
      color: #a1a1aa;
      font-weight: 500;
    }
    .badge-icon {
      font-size: 1.15rem;
    }
  `]
})
export class HeroComponent {
  @Output() scrollToCategory = new EventEmitter<string>();
}

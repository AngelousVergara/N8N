import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoResponse } from '../../models/pedido.model';

@Component({
  selector: 'app-order-success-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (order) {
      <div class="modal-backdrop" (click)="close.emit()">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="success-icon">🎉</div>
          <h2 class="modal-title">¡Pedido Recibido con Éxito!</h2>
          <p class="modal-subtitle">Tu orden ya está en la cocina de Pizzeria Italia.</p>

          <div class="order-box">
            <div class="order-id-badge">
              <span>NÚMERO DE ORDEN</span>
              <strong>#{{ order.id_pedido }}</strong>
            </div>

            <div class="order-detail-row">
              <span>Estado:</span>
              <span class="status-tag">🔥 En Preparación</span>
            </div>

            <div class="order-detail-row">
              <span>Tiempo Estimado:</span>
              <strong>35 - 45 minutos</strong>
            </div>

            <div class="order-detail-row">
              <span>Total:</span>
              <strong class="total-text">\${{ order.total | number:'1.0-0' }}</strong>
            </div>
          </div>

          <div class="tracking-timeline">
            <div class="step active">
              <span class="dot"></span>
              <small>Confirmado</small>
            </div>
            <div class="step active">
              <span class="dot"></span>
              <small>Al Horno</small>
            </div>
            <div class="step">
              <span class="dot"></span>
              <small>En Camino</small>
            </div>
            <div class="step">
              <span class="dot"></span>
              <small>Entregado</small>
            </div>
          </div>

          <button class="accept-btn" (click)="close.emit()">Entendido, ¡gracias!</button>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.82);
      backdrop-filter: blur(8px);
      z-index: 200;
      display: grid;
      place-items: center;
      padding: 1rem;
      animation: fadeIn 0.2s ease;
    }
    .modal-card {
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 20px;
      max-width: 460px;
      width: 100%;
      padding: 2.2rem 1.8rem;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
      animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .success-icon {
      font-size: 3.5rem;
      margin-bottom: 0.8rem;
    }
    .modal-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: #fafafa;
      margin-bottom: 0.4rem;
    }
    .modal-subtitle {
      font-size: 0.9rem;
      color: #a1a1aa;
      margin-bottom: 1.5rem;
    }
    .order-box {
      background: #121214;
      border: 1px solid #27272a;
      border-radius: 12px;
      padding: 1.25rem;
      margin-bottom: 1.5rem;
    }
    .order-id-badge {
      display: flex;
      flex-direction: column;
      border-bottom: 1px dashed #27272a;
      padding-bottom: 0.75rem;
      margin-bottom: 0.75rem;
    }
    .order-id-badge span {
      font-size: 0.72rem;
      letter-spacing: 1px;
      color: #a1a1aa;
      font-weight: 600;
    }
    .order-id-badge strong {
      font-size: 1.8rem;
      color: #fb7185;
      font-family: monospace;
    }
    .order-detail-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.88rem;
      color: #d4d4d8;
      margin-bottom: 0.5rem;
    }
    .status-tag {
      background: rgba(245, 158, 11, 0.15);
      color: #f59e0b;
      padding: 0.2rem 0.6rem;
      border-radius: 6px;
      font-weight: 700;
      font-size: 0.8rem;
    }
    .total-text {
      color: #34d399;
      font-size: 1.1rem;
    }

    .tracking-timeline {
      display: flex;
      justify-content: space-between;
      position: relative;
      margin-bottom: 1.8rem;
      padding: 0 0.5rem;
    }
    .tracking-timeline::before {
      content: '';
      position: absolute;
      top: 9px;
      left: 1.5rem;
      right: 1.5rem;
      height: 2px;
      background: #27272a;
      z-index: 1;
    }
    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      position: relative;
      z-index: 2;
    }
    .step .dot {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #27272a;
      border: 3px solid #18181b;
      transition: all 0.3s;
    }
    .step.active .dot {
      background: #e11d48;
      box-shadow: 0 0 10px #e11d48;
    }
    .step small {
      font-size: 0.7rem;
      color: #71717a;
    }
    .step.active small {
      color: #f4f4f5;
      font-weight: 600;
    }

    .accept-btn {
      width: 100%;
      background: linear-gradient(135deg, #e11d48, #be123c);
      color: white;
      border: none;
      padding: 0.85rem;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  `]
})
export class OrderSuccessModalComponent {
  @Input() order: PedidoResponse | null = null;
  @Output() close = new EventEmitter<void>();
}

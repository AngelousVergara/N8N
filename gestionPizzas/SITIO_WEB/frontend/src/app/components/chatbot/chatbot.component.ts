import { Component, ElementRef, ViewChild, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { ChatMessage } from '../../models/chat.model';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Botón Flotante para Abrir/Cerrar el Chatbot -->
    <div class="chatbot-trigger-wrapper">
      @if (!chatService.isOpen()) {
        <div class="chat-greeting-bubble" (click)="chatService.toggleChat(true)">
          <span>🍕 ¿Hambre? ¡Pide tu pizza aquí!</span>
        </div>
      }

      <button 
        class="chatbot-fab" 
        [class.active]="chatService.isOpen()"
        (click)="chatService.toggleChat()"
        aria-label="Abrir chat de pedidos con N8N"
        title="Chatbot de Pedidos Pizzería Italia"
      >
        @if (chatService.isOpen()) {
          <span class="fab-icon close-icon">✕</span>
        } @else {
          <span class="fab-icon">💬</span>
          @if (chatService.hasUnread()) {
            <span class="unread-badge">1</span>
          }
        }
      </button>
    </div>

    <!-- Ventana Principal del Chatbot -->
    @if (chatService.isOpen()) {
      <div class="chatbot-window" role="dialog" aria-label="Chat de Pedidos">
        <!-- Encabezado de la Ventana -->
        <header class="chat-header">
          <div class="header-info">
            <div class="bot-avatar">🍕</div>
            <div class="bot-details">
              <div class="bot-name">Nino <span>• Asistente IA</span></div>
              <div class="bot-status">
                <span class="status-indicator"></span>
                <span>En línea con N8N</span>
              </div>
            </div>
          </div>

          <div class="header-actions">
            <button 
              class="icon-btn" 
              (click)="chatService.clearChat()" 
              title="Reiniciar conversación"
              aria-label="Reiniciar conversación"
            >
              🔄
            </button>
            <button 
              class="icon-btn" 
              (click)="chatService.toggleChat(false)" 
              title="Cerrar ventana"
              aria-label="Cerrar ventana"
            >
              ✕
            </button>
          </div>
        </header>

        <!-- Chips de sugerencias rápidas -->
        <div class="quick-chips-wrapper">
          <button class="chip-btn" (click)="enviarSugerencia('¿Cuáles son las promociones de hoy?')">
            🔥 Promos
          </button>
          <button class="chip-btn" (click)="enviarSugerencia('¿Qué pizzas tradicionales tienen y qué precios?')">
            🍕 Pizzas Tradicionales
          </button>
          <button class="chip-btn" (click)="enviarSugerencia('Quiero pedir una Pizza Margherita Familiar para delivery')">
            🛵 Pedir Margherita
          </button>
          <button class="chip-btn" (click)="enviarSugerencia('¿Tienen opciones de postres o bebidas?')">
            🥤 Bebidas y Postres
          </button>
        </div>

        <!-- Lista de Mensajes -->
        <div class="chat-messages" #scrollContainer>
          @for (msg of chatService.messages(); track msg.id) {
            <div 
              class="message-row" 
              [class.user-row]="msg.sender === 'user'" 
              [class.bot-row]="msg.sender === 'bot'"
            >
              @if (msg.sender === 'bot') {
                <div class="avatar-small">🍕</div>
              }

              <div 
                class="message-bubble" 
                [class.bubble-user]="msg.sender === 'user'"
                [class.bubble-bot]="msg.sender === 'bot'"
                [class.bubble-error]="msg.isError"
              >
                <div class="message-content" [innerHTML]="formatMessageText(msg.text)"></div>
                <span class="message-time">
                  {{ msg.timestamp | date:'HH:mm' }}
                </span>
              </div>
            </div>
          }

          <!-- Indicador de tipeo / Esperando N8N -->
          @if (chatService.isTyping()) {
            <div class="message-row bot-row typing-row">
              <div class="avatar-small">🍕</div>
              <div class="message-bubble bubble-bot typing-bubble">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
              </div>
            </div>
          }
        </div>

        <!-- Barra inferior de entrada de texto -->
        <footer class="chat-input-bar">
          <input 
            #inputField
            type="text" 
            [(ngModel)]="currentText" 
            (keydown.enter)="enviar()"
            placeholder="Escribe tu pedido o consulta..."
            [disabled]="chatService.isTyping()"
            maxlength="600"
          />

          <button 
            class="send-btn" 
            [disabled]="!currentText.trim() || chatService.isTyping()"
            (click)="enviar()"
            aria-label="Enviar mensaje a N8N"
            title="Enviar mensaje"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </button>
        </footer>
      </div>
    }
  `,
  styles: [`
    /* Botón Flotante (FAB) */
    .chatbot-trigger-wrapper {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 10px;
    }

    .chat-greeting-bubble {
      background: #1e1e22;
      color: #fafafa;
      border: 1px solid #3f3f46;
      padding: 0.55rem 0.95rem;
      border-radius: 14px 14px 2px 14px;
      font-size: 0.82rem;
      font-weight: 600;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.45);
      cursor: pointer;
      animation: floatBubble 3s ease-in-out infinite;
      white-space: nowrap;
      transition: transform 0.2s;
    }
    .chat-greeting-bubble:hover {
      transform: scale(1.03);
      border-color: #e11d48;
    }

    .chatbot-fab {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #e11d48, #be123c);
      color: #fff;
      border: 2px solid rgba(255, 255, 255, 0.15);
      cursor: pointer;
      display: grid;
      place-items: center;
      box-shadow: 0 6px 24px rgba(225, 29, 72, 0.45);
      position: relative;
      transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .chatbot-fab:hover {
      transform: scale(1.08);
      box-shadow: 0 8px 30px rgba(225, 29, 72, 0.65);
    }
    .chatbot-fab.active {
      background: #27272a;
      border-color: #3f3f46;
      box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    }

    .fab-icon {
      font-size: 1.7rem;
      line-height: 1;
    }
    .close-icon {
      font-size: 1.25rem;
      font-weight: 700;
      color: #fafafa;
    }

    .unread-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      background: #22c55e;
      color: #fff;
      font-size: 0.7rem;
      font-weight: 800;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      border: 2px solid #0f0f11;
    }

    /* Ventana del Chatbot */
    .chatbot-window {
      position: fixed;
      bottom: 96px;
      right: 24px;
      width: 380px;
      max-width: calc(100vw - 32px);
      height: 560px;
      max-height: calc(100vh - 120px);
      background: #141417;
      border: 1px solid #2e2e33;
      border-radius: 20px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.7);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 1000;
      animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Encabezado */
    .chat-header {
      background: #1a1a1e;
      border-bottom: 1px solid #27272a;
      padding: 0.85rem 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .header-info {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }
    .bot-avatar {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: #27272a;
      border: 1px solid #3f3f46;
      display: grid;
      place-items: center;
      font-size: 1.4rem;
    }
    .bot-details {
      display: flex;
      flex-direction: column;
    }
    .bot-name {
      font-size: 0.95rem;
      font-weight: 700;
      color: #fafafa;
    }
    .bot-name span {
      font-size: 0.75rem;
      font-weight: 500;
      color: #e11d48;
    }
    .bot-status {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.72rem;
      color: #a1a1aa;
    }
    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 6px #22c55e;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }
    .icon-btn {
      background: transparent;
      border: none;
      color: #a1a1aa;
      font-size: 1rem;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      cursor: pointer;
      display: grid;
      place-items: center;
      transition: all 0.2s;
    }
    .icon-btn:hover {
      background: #27272a;
      color: #fafafa;
    }

    /* Quick Chips */
    .quick-chips-wrapper {
      display: flex;
      gap: 0.4rem;
      padding: 0.55rem 0.85rem;
      background: #18181c;
      border-bottom: 1px solid #222226;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .quick-chips-wrapper::-webkit-scrollbar { display: none; }

    .chip-btn {
      background: #222226;
      color: #d4d4d8;
      border: 1px solid #2e2e33;
      padding: 0.35rem 0.7rem;
      border-radius: 9999px;
      font-size: 0.74rem;
      font-weight: 500;
      white-space: nowrap;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .chip-btn:hover {
      background: #27272a;
      color: #ffffff;
      border-color: #e11d48;
    }

    /* Mensajes */
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      background: #141417;
    }

    .message-row {
      display: flex;
      align-items: flex-end;
      gap: 0.5rem;
      max-width: 88%;
    }
    .user-row {
      align-self: flex-end;
      flex-direction: row-reverse;
    }
    .bot-row {
      align-self: flex-start;
    }

    .avatar-small {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: #222226;
      border: 1px solid #333338;
      display: grid;
      place-items: center;
      font-size: 0.95rem;
      flex-shrink: 0;
    }

    .message-bubble {
      padding: 0.75rem 0.95rem;
      border-radius: 16px;
      font-size: 0.88rem;
      line-height: 1.45;
      position: relative;
      word-break: break-word;
    }

    .bubble-user {
      background: linear-gradient(135deg, #e11d48, #be123c);
      color: #fff;
      border-bottom-right-radius: 4px;
      box-shadow: 0 2px 10px rgba(225, 29, 72, 0.25);
    }

    .bubble-bot {
      background: #1e1e22;
      color: #f4f4f5;
      border: 1px solid #2e2e33;
      border-bottom-left-radius: 4px;
    }

    .bubble-error {
      background: #2a1519;
      border-color: #7f1d1d;
      color: #fecaca;
    }

    .message-content {
      white-space: pre-wrap;
    }

    .message-time {
      display: block;
      font-size: 0.68rem;
      opacity: 0.7;
      text-align: right;
      margin-top: 0.35rem;
    }

    /* Indicador de Tipeo */
    .typing-bubble {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 0.75rem 1rem;
    }
    .typing-dot {
      width: 6px;
      height: 6px;
      background-color: #a1a1aa;
      border-radius: 50%;
      animation: bounceDot 1.4s infinite ease-in-out both;
    }
    .typing-dot:nth-child(1) { animation-delay: -0.32s; }
    .typing-dot:nth-child(2) { animation-delay: -0.16s; }

    /* Barra Inferior */
    .chat-input-bar {
      padding: 0.75rem 1rem;
      background: #18181c;
      border-top: 1px solid #27272a;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .chat-input-bar input {
      flex: 1;
      background: #121214;
      border: 1px solid #2e2e33;
      border-radius: 12px;
      padding: 0.65rem 0.9rem;
      color: #fafafa;
      font-size: 0.88rem;
      outline: none;
      transition: border-color 0.2s;
    }
    .chat-input-bar input:focus {
      border-color: #e11d48;
    }
    .chat-input-bar input:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .send-btn {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: #e11d48;
      border: none;
      color: white;
      cursor: pointer;
      display: grid;
      place-items: center;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }
    .send-btn svg {
      width: 18px;
      height: 18px;
    }
    .send-btn:hover:not(:disabled) {
      background: #be123c;
      transform: scale(1.05);
    }
    .send-btn:disabled {
      background: #27272a;
      color: #52525b;
      cursor: not-allowed;
      transform: none;
    }

    /* Animaciones */
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes floatBubble {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }

    @keyframes bounceDot {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }

    @media (max-width: 480px) {
      .chatbot-window {
        bottom: 84px;
        right: 12px;
        left: 12px;
        width: auto;
        height: calc(100vh - 100px);
      }
      .chat-greeting-bubble {
        display: none;
      }
    }
  `]
})
export class ChatbotComponent {
  chatService = inject(ChatService);
  currentText = '';

  @ViewChild('scrollContainer') private scrollContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('inputField') private inputField?: ElementRef<HTMLInputElement>;

  constructor() {
    // Auto-scroll al recibir mensajes o cambiar de estado de tipeo
    effect(() => {
      // Registrar dependencias de signals
      this.chatService.messages();
      this.chatService.isTyping();
      this.chatService.isOpen();

      setTimeout(() => this.scrollToBottom(), 60);
    });
  }

  enviar(): void {
    if (!this.currentText.trim() || this.chatService.isTyping()) return;
    const textToSend = this.currentText;
    this.currentText = '';
    this.chatService.sendMessage(textToSend);
    setTimeout(() => this.scrollToBottom(), 50);
  }

  enviarSugerencia(texto: string): void {
    this.chatService.sendMessage(texto);
    setTimeout(() => this.scrollToBottom(), 50);
  }

  private scrollToBottom(): void {
    if (this.scrollContainer?.nativeElement) {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    }
  }

  /**
   * Formatea texto para destacar negritas (**texto**), saltos de línea y emojis
   */
  formatMessageText(text: string): string {
    if (!text) return '';
    
    // Escapar etiquetas HTML para evitar inyección
    let safe = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Negrita **texto**
    safe = safe.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Código en línea `codigo`
    safe = safe.replace(/`([^`]+)`/g, '<code style="background:#27272a;padding:2px 4px;border-radius:4px;font-size:0.85em;color:#f43f5e;">$1</code>');

    // Saltos de línea
    safe = safe.replace(/\n/g, '<br/>');

    return safe;
  }
}


import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { URL_WEBHOOK_CHAT } from '../config/chat.config';
import { ChatMessage, ChatPayload, ChatN8nResponse } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);

  // URL del webhook extraída de la constante de configuración
  readonly webhookUrl = URL_WEBHOOK_CHAT;

  // Identificador de sesión persistente para memoria conversacional en N8N
  private sessionId = this.getOrCreateSessionId();

  // Estados reactivos (Signals)
  messages = signal<ChatMessage[]>([
    {
      id: 'welcome-1',
      text: '¡Ciao! 🍕 Bienvenido a Pizzería Italia. Soy tu asistente virtual para pedidos y consultas. ¿En qué te puedo ayudar hoy?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);

  isTyping = signal<boolean>(false);
  isOpen = signal<boolean>(false);
  hasUnread = signal<boolean>(false);

  /**
   * Envía un mensaje del usuario al webhook de N8N
   */
  sendMessage(text: string): void {
    const trimmed = text.trim();
    if (!trimmed || this.isTyping()) return;

    // 1. Agregar mensaje del usuario
    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      text: trimmed,
      sender: 'user',
      timestamp: new Date()
    };
    this.messages.update(msgs => [...msgs, userMessage]);
    this.isTyping.set(true);

    // 2. Preparar payload compatible con N8N Webhook y N8N Chat Trigger
    const payload: ChatPayload = {
      message: trimmed,
      chatInput: trimmed,
      sessionId: this.sessionId
    };

    // 3. Ejecutar POST al webhook
    this.http.post<ChatN8nResponse | string | ChatN8nResponse[]>(
      this.webhookUrl,
      payload,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).subscribe({
      next: (res) => {
        const botText = this.extractResponseText(res);
        const botMessage: ChatMessage = {
          id: 'bot-' + Date.now(),
          text: botText,
          sender: 'bot',
          timestamp: new Date()
        };
        this.messages.update(msgs => [...msgs, botMessage]);
        this.isTyping.set(false);

        if (!this.isOpen()) {
          this.hasUnread.set(true);
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al comunicarse con N8N:', err);
        const errorText = this.buildErrorMessage(err);
        const botErrorMessage: ChatMessage = {
          id: 'bot-err-' + Date.now(),
          text: errorText,
          sender: 'bot',
          timestamp: new Date(),
          isError: true
        };
        this.messages.update(msgs => [...msgs, botErrorMessage]);
        this.isTyping.set(false);
      }
    });
  }

  /**
   * Extrae el texto de las diversas respuestas posibles de N8N
   */
  private extractResponseText(res: unknown): string {
    if (!res) {
      return 'Mensaje recibido sin contenido por parte de N8N.';
    }

    if (typeof res === 'string') {
      return res;
    }

    if (Array.isArray(res) && res.length > 0) {
      return this.extractResponseText(res[0]);
    }

    if (typeof res === 'object') {
      const obj = res as Record<string, unknown>;
      if (typeof obj['output'] === 'string') return obj['output'];
      if (typeof obj['response'] === 'string') return obj['response'];
      if (typeof obj['text'] === 'string') return obj['text'];
      if (typeof obj['message'] === 'string') return obj['message'];
      if (typeof obj['content'] === 'string') return obj['content'];

      return JSON.stringify(res, null, 2);
    }

    return String(res);
  }

  /**
   * Genera un mensaje comprensible en caso de error de conexión o CORS
   */
  private buildErrorMessage(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return '⚠️ **Error de conexión / CORS**: No se pudo comunicar con N8N en `' + this.webhookUrl + '`.\n\n' +
        '**Posibles causas:**\n' +
        '1. El contenedor Docker de N8N no está corriendo en el puerto 5678.\n' +
        '2. Bloqueo de CORS: Recuerda configurar `N8N_CORS_ALLOWED_ORIGIN=*` en Docker o permitir CORS en el nodo Webhook de N8N.\n' +
        '3. El Webhook está inactivo o en modo "Test" esperando que se presione "Listen for test event".';
    }

    if (err.status === 404) {
      return `⚠️ **Error 404**: No se encontró el Webhook en N8N. Verifica que la URL \`${this.webhookUrl}\` sea correcta y que el flujo esté activo en N8N.`;
    }

    return `⚠️ **Error ${err.status}**: Ocurrió un error al procesar el mensaje (${err.statusText || 'Error del servidor'}).`;
  }

  /**
   * Abre o cierra la ventana de chat
   */
  toggleChat(force?: boolean): void {
    const nextState = force !== undefined ? force : !this.isOpen();
    this.isOpen.set(nextState);
    if (nextState) {
      this.hasUnread.set(false);
    }
  }

  /**
   * Reinicia la conversación y genera una nueva sesión
   */
  clearChat(): void {
    this.sessionId = this.generateNewSessionId();
    this.messages.set([
      {
        id: 'welcome-reset-' + Date.now(),
        text: '¡Conversación reiniciada! 🍕 ¿En qué te puedo colaborar ahora con tu pedido?',
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  }

  private getOrCreateSessionId(): string {
    try {
      const stored = localStorage.getItem('pizzeria_chat_session_id');
      if (stored) return stored;
    } catch {
      // Ignorar si localStorage no está disponible
    }
    return this.generateNewSessionId();
  }

  private generateNewSessionId(): string {
    const id = 'sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
    try {
      localStorage.setItem('pizzeria_chat_session_id', id);
    } catch {
      // Fallback
    }
    return id;
  }
}


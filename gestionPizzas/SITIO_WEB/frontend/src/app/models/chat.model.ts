export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isError?: boolean;
}

export interface ChatPayload {
  message: string;
  chatInput: string;
  sessionId: string;
}

export interface ChatN8nResponse {
  output?: string;
  response?: string;
  message?: string;
  text?: string;
  [key: string]: unknown;
}


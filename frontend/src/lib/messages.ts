// src/lib/messages.ts
import { api } from './api';

export interface ClassifiedMessage {
  id: number;
  content: string;
  isSpam: boolean;
  label: 'spam' | 'ham' | string;
  classifiedAt: string | null;
  // opcional: si tu backend serializa el usuario completo, puedes agregar:
  // user?: {
  //   id: number;
  //   firstName: string;
  //   lastName: string;
  //   email: string;
  // };
}

/**
 * Enviar un mensaje para clasificarlo como spam/ham.
 * Internamente pega a POST /api/messages/send-and-classify
 */
export async function sendAndClassifyMessage(message: string) {
  return api.http<ClassifiedMessage>('/api/messages/send-and-classify', {
    method: 'POST',
    body: JSON.stringify({ message }),
    // Si luego agregas JWT/Bearer:
    // headers: { ...getAuthHeader() },
  });
}

/**
 * Obtener historial de mensajes clasificados del usuario autenticado.
 * GET /api/messages/classification-history
 */
export async function getClassificationHistory() {
  return api.http<ClassifiedMessage[]>('/api/messages/classification-history', {
    method: 'GET',
    // headers: { ...getAuthHeader() },
  });
}

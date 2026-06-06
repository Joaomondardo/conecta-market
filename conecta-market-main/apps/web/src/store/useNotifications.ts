import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';
import { useEffect } from 'react';

export interface NotificationPayload {
  id?: string;
  message?: string;
  type?: string;
  [key: string]: unknown;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'ORDER_UPDATE' | 'PAYMENT_UPDATE' | 'PROMOTION' | 'SYSTEM' | 'REVIEW' | 'MESSAGE';
  title: string;
  message: string;
  data?: NotificationPayload;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  eventSource: EventSource | null;
  fetchNotifications: () => Promise<void>;
  connectStream: () => void;
  disconnectStream: () => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  eventSource: null,

  fetchNotifications: async () => {
    const accessToken = useAuthStore.getState().accessToken;
    if (!accessToken) return;

    set({ loading: true });
    try {
      const response = await fetch(`${API_URL}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        set({
          notifications: result.data || [],
          unreadCount: result.unreadCount || 0,
        });
      }
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    } finally {
      set({ loading: false });
    }
  },

  connectStream: () => {
    const { eventSource, fetchNotifications } = get();
    if (eventSource) return; // Já conectado

    const accessToken = useAuthStore.getState().accessToken;
    if (!accessToken) return;

    // Busca inicial de notificações antigas
    fetchNotifications();

    const url = `${API_URL}/api/notifications/stream?token=${accessToken}`;
    const es = new EventSource(url);

    es.addEventListener('notification', (event) => {
      try {
        const notification = JSON.parse(event.data);
        set((state) => {
          // Evitar itens duplicados
          const exists = state.notifications.some((n) => n.id === notification.id);
          if (exists) return state;

          const updatedNotifications = [notification, ...state.notifications];
          return {
            notifications: updatedNotifications,
            unreadCount: state.unreadCount + 1,
          };
        });
      } catch (error) {
        console.error('Erro ao processar notificação via SSE:', error);
      }
    });

    es.onerror = (err) => {
      console.error('Erro na conexão SSE:', err);
    };

    set({ eventSource: es });
  },

  disconnectStream: () => {
    const { eventSource } = get();
    if (eventSource) {
      eventSource.close();
      set({ eventSource: null });
    }
  },

  markAsRead: async (id: string) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (!accessToken) return;

    try {
      const response = await fetch(`${API_URL}/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        set((state) => {
          const updated = state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
          );
          const newUnreadCount = Math.max(0, state.unreadCount - 1);
          return { notifications: updated, unreadCount: newUnreadCount };
        });
      }
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  },

  markAllAsRead: async () => {
    const accessToken = useAuthStore.getState().accessToken;
    if (!accessToken) return;

    try {
      const response = await fetch(`${API_URL}/api/notifications/read-all`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        set((state) => {
          const updated = state.notifications.map((n) => ({
            ...n,
            isRead: true,
            readAt: new Date().toISOString(),
          }));
          return { notifications: updated, unreadCount: 0 };
        });
      }
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
    }
  },
}));

export function useNotifications() {
  const {
    notifications,
    unreadCount,
    loading,
    connectStream,
    disconnectStream,
    markAsRead,
    markAllAsRead,
  } = useNotificationsStore();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      connectStream();
    } else {
      disconnectStream();
    }

    return () => {
      disconnectStream();
    };
  }, [isAuthenticated, connectStream, disconnectStream]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
  };
}

import { useAuthStore } from '../store/useAuthStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

function getAuthHeaders() {
  const token = useAuthStore.getState().accessToken;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  sku?: string;
  image?: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  storeId: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  customer?: {
    name: string;
    email: string;
  };
  store?: {
    name: string;
    slug: string;
  };
  address?: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  payment?: {
    method: string;
    status: string;
  };
}

export const ordersService = {
  async getMyOrders(): Promise<Order[]> {
    try {
      const res = await fetch(`${API_URL}/orders`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Falha ao buscar pedidos');
      const data = await res.json();
      return data.data || data || [];
    } catch (error) {
      console.error('Error in getMyOrders:', error);
      return [];
    }
  },

  async getOrderById(id: string): Promise<Order> {
    const res = await fetch(`${API_URL}/orders/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Falha ao buscar pedido por ID');
    const data = await res.json();
    return data;
  },

  async cancelOrder(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/orders/${id}/cancel`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason: 'Cancelado pelo usuário' }),
    });
    if (!res.ok) throw new Error('Falha ao cancelar pedido');
  },

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const res = await fetch(`${API_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Falha ao atualizar status do pedido');
    return res.json();
  },

  async getSellerAnalytics(): Promise<{ totalOrders: number; totalRevenue: number; pendingOrders: number }> {
    try {
      const res = await fetch(`${API_URL}/analytics/seller`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Falha ao buscar analytics do lojista');
      return await res.json();
    } catch (error) {
      console.error('Error in getSellerAnalytics:', error);
      return { totalOrders: 0, totalRevenue: 0, pendingOrders: 0 };
    }
  }
};

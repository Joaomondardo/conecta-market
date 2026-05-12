import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  stock: number;
  isB2B: boolean;
  storeId: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => set((state) => {
        const existingItem = state.items.find(item => item.productId === newItem.productId);
        if (existingItem) {
          return {
            items: state.items.map(item =>
              item.productId === newItem.productId
                ? { ...item, quantity: Math.min(item.quantity + newItem.quantity, item.stock) }
                : item
            )
          };
        }
        return { items: [...state.items, newItem] };
      }),
      removeItem: (productId) => set((state) => ({
        items: state.items.filter(item => item.productId !== productId)
      })),
      updateQuantity: (productId, quantity) => set((state) => ({
        items: state.items.map(item =>
          item.productId === productId
            ? { ...item, quantity: Math.min(Math.max(1, quantity), item.stock) }
            : item
        )
      })),
      clearCart: () => set({ items: [] }),
      getCartTotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      getCartCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'conecta-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

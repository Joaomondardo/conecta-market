const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Product {
  id: string;
  name: string;
  price: number;
  slug: string;
  [key: string]: unknown;
}

export const productService = {
  async findAll(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_URL}/products`, { 
        next: { revalidate: 60 },
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.status}`);
      }
      
      const data = await res.json();
      return data.data || [];
    } catch (error) {
      console.error('Error in productService.findAll:', error);
      return [];
    }
  },

  async findOne(identifier: string): Promise<Product | null> {
    try {
      const res = await fetch(`${API_URL}/products/${identifier}`, {
        next: { revalidate: 60 }
      });
      
      if (!res.ok) return null;
      return res.json();
    } catch (error) {
      console.error(`Error fetching product ${identifier}:`, error);
      return null;
    }
  }
};

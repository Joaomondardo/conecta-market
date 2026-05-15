"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, Package, Briefcase } from "lucide-react";
import { useState } from "react";
import { MarketplaceCard } from "@/components/marketplace/marketplace-card";

// Mock data (será substituído pela API na próxima fase)
const mockItems: any[] = [
  {
    id: "1",
    name: "Smartphone Recondicionado Modelo X",
    store: "TechSustentável",
    price: 899.90,
    priceB2B: 750.00,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500",
    type: 'PRODUCT',
  },
  {
    id: "2",
    name: "Consultoria em Gestão de MEI",
    store: "Gestão Amiga",
    price: 150.00,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1454165833767-1316b2848721?q=80&w=500",
    type: 'SERVICE',
  },
  {
    id: "3",
    name: "Camiseta Algodão Orgânico",
    store: "EcoModa",
    price: 59.90,
    priceB2B: 35.00,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=500",
    type: 'PRODUCT',
  },
  {
    id: "4",
    name: "Cadeira de Escritório Ergonômica",
    store: "Móveis B2B",
    price: 450.00,
    priceB2B: 320.00,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=500",
    type: 'PRODUCT',
  },
  {
    id: "5",
    name: "Manutenção de Computadores",
    store: "TechSustentável",
    price: 120.00,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1591405351990-4726e331f141?q=80&w=500",
    type: 'SERVICE',
  },
  {
    id: "6",
    name: "Kit Utensílios de Bambu",
    store: "Casa Eco",
    price: 89.90,
    priceB2B: 50.00,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1584362917165-526a968579e8?q=80&w=500",
    type: 'PRODUCT',
  },
];

export default function CatalogoPage() {
  const [filterType, setFilterType] = useState<'ALL' | 'PRODUCT' | 'SERVICE'>('ALL');
  const [search, setSearch] = useState('');

  const filteredItems = mockItems.filter(item => {
    const matchesType = filterType === 'ALL' || item.type === filterType;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.store.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <>
      <Header />
      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="font-sora text-3xl font-bold">Marketplace Comunitário</h1>
            <p className="text-muted-foreground mt-1">Produtos e serviços de impacto local e sustentável.</p>
          </div>
          
          <div className="flex bg-muted p-1 rounded-lg">
            <Button 
              variant={filterType === 'ALL' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setFilterType('ALL')}
              className="text-xs h-8"
            >
              Todos
            </Button>
            <Button 
              variant={filterType === 'PRODUCT' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setFilterType('PRODUCT')}
              className="text-xs h-8"
            >
              <Package className="h-3.5 w-3.5 mr-1.5" /> Produtos
            </Button>
            <Button 
              variant={filterType === 'SERVICE' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setFilterType('SERVICE')}
              className="text-xs h-8"
            >
              <Briefcase className="h-3.5 w-3.5 mr-1.5" /> Serviços
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 space-y-6 shrink-0 hidden md:block">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Filtros
              </h3>
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Categorias</h4>
                <div className="space-y-2">
                  {['Todos', 'Eletrônicos', 'Moda Sustentável', 'Serviços Digitais', 'Manutenção'].map(cat => (
                    <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
                      <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium">Faixa de Preço</h4>
                <div className="flex items-center gap-2">
                  <Input type="number" placeholder="Min" className="h-9 text-sm" />
                  <span className="text-muted-foreground">-</span>
                  <Input type="number" placeholder="Max" className="h-9 text-sm" />
                </div>
              </div>

              <Button className="w-full font-semibold">Aplicar Filtros</Button>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="O que você está procurando hoje?" 
                  className="pl-10 h-11 bg-background border-muted-foreground/20 focus:border-primary shadow-sm" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <MarketplaceCard key={item.id} {...item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed border-muted">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <h3 className="font-semibold text-lg">Nenhum resultado encontrado</h3>
                <p className="text-muted-foreground mt-1">Tente ajustar seus filtros ou busca.</p>
              </div>
            )}
            
            {filteredItems.length > 0 && (
              <div className="mt-12 flex justify-center">
                <Button variant="outline" className="min-w-[220px] font-semibold border-2 hover:bg-muted">
                  Carregar Mais Itens
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
oter />
    </>
  );
}

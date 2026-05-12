import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mock data (será substituído pela API na próxima fase)
const mockProducts = [
  {
    id: "1",
    name: "Smartphone Recondicionado Modelo X",
    store: "TechSustentável",
    price: 899.90,
    priceB2B: 750.00,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500",
  },
  {
    id: "2",
    name: "Camiseta Algodão Orgânico",
    store: "EcoModa",
    price: 59.90,
    priceB2B: 35.00,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=500",
  },
  {
    id: "3",
    name: "Cadeira de Escritório Ergonômica",
    store: "Móveis B2B",
    price: 450.00,
    priceB2B: 320.00,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=500",
  },
  {
    id: "4",
    name: "Kit Utensílios de Bambu",
    store: "Casa Eco",
    price: 89.90,
    priceB2B: 50.00,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1584362917165-526a968579e8?q=80&w=500",
  },
  {
    id: "5",
    name: "Fones de Ouvido Bluetooth",
    store: "Eletrônicos SP",
    price: 129.90,
    priceB2B: 90.00,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500",
  },
  {
    id: "6",
    name: "Mochila de Lona Reciclada",
    store: "Acessórios Sustentáveis",
    price: 199.90,
    priceB2B: 140.00,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500",
  },
];

export default function CatalogoPage() {
  return (
    <>
      <Header />
      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="font-sora text-3xl font-bold">Catálogo de Produtos</h1>
            <p className="text-muted-foreground mt-1">Encontre os melhores produtos com foco sustentável e inclusivo.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar de Filtros (Simplificada para MVP) */}
          <aside className="w-full md:w-64 space-y-6 shrink-0 hidden md:block">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Filtros
              </h3>
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Categorias</h4>
                <div className="space-y-2">
                  {['Todos', 'Eletrônicos', 'Moda Sustentável', 'Móveis', 'Casa e Decoração'].map(cat => (
                    <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary">
                      <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium">Faixa de Preço</h4>
                <div className="flex items-center gap-2">
                  <Input type="number" placeholder="Min" className="h-8 text-sm" />
                  <span>-</span>
                  <Input type="number" placeholder="Max" className="h-8 text-sm" />
                </div>
              </div>

              <Button className="w-full">Aplicar Filtros</Button>
            </div>
          </aside>

          {/* Grid de Produtos */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar no catálogo..." className="pl-9 bg-background" />
              </div>
              <Button variant="outline" className="md:hidden">
                <SlidersHorizontal className="h-4 w-4 mr-2" /> Filtros
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockProducts.map((product) => (
                <Card key={product.id} className="group overflow-hidden flex flex-col h-full hover:shadow-md transition-all border-muted/60">
                  <Link href={`/produto/${product.id}`} className="block relative aspect-square overflow-hidden bg-muted">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105 duration-500"
                    />
                    <Badge className="absolute top-2 right-2 bg-background/80 text-foreground backdrop-blur-sm border-0 font-semibold">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                      {product.rating}
                    </Badge>
                  </Link>
                  <CardContent className="p-4 flex flex-col flex-1">
                    <div className="text-xs text-muted-foreground mb-1 font-medium truncate">{product.store}</div>
                    <Link href={`/produto/${product.id}`} className="font-semibold text-sm leading-tight hover:text-primary transition-colors line-clamp-2 mb-3">
                      {product.name}
                    </Link>
                    <div className="mt-auto">
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-xs text-muted-foreground">Varejo</div>
                          <div className="font-sora font-bold text-lg text-primary">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider bg-muted px-1.5 py-0.5 rounded">Atacado (B2B)</div>
                          <div className="font-sora font-semibold text-sm text-foreground mt-0.5">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.priceB2B)}
                          </div>
                        </div>
                      </div>
                      <Button className="w-full mt-4" size="sm">
                        <ShoppingCart className="h-4 w-4 mr-2" /> Adicionar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-12 flex justify-center">
              <Button variant="outline" className="min-w-[200px]">Carregar Mais Produtos</Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

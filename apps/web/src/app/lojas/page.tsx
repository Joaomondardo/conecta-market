"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Star, Store, Search } from "lucide-react";
import Link from "next/link";

interface MockStore {
  id: string;
  name: string;
  category: string;
  rating: number;
  productsCount: number;
  description: string;
}

const mockStores: MockStore[] = [
  {
    id: "1",
    name: "TechSustentável",
    category: "Tecnologia",
    rating: 4.8,
    productsCount: 32,
    description: "Dispositivos recondicionados e eletrônicos de baixo impacto ambiental com garantia.",
  },
  {
    id: "2",
    name: "Artesanato Criativo",
    category: "Artesanato",
    rating: 4.9,
    productsCount: 18,
    description: "Decorações e utilitários feitos à mão com materiais reciclados e sustentáveis.",
  },
  {
    id: "3",
    name: "Horta do Bairro",
    category: "Alimentos",
    rating: 4.7,
    productsCount: 24,
    description: "Hortaliças e frutas orgânicas cultivadas localmente na região de Criciúma.",
  },
  {
    id: "4",
    name: "Moda Circular",
    category: "Vestuário",
    rating: 4.6,
    productsCount: 45,
    description: "Brechó curado e roupas reformadas com foco em moda consciente e acessível.",
  },
  {
    id: "5",
    name: "Serviços Gerais Cristo Redentor",
    category: "Serviços",
    rating: 4.9,
    productsCount: 12,
    description: "Manutenção residencial, encanamento, elétrica e reparos rápidos de confiança.",
  },
  {
    id: "6",
    name: "Sabores da Comunidade",
    category: "Alimentos",
    rating: 4.8,
    productsCount: 15,
    description: "Pães artesanais, bolos, doces caseiros e salgados feitos com amor e tradição.",
  },
];

const categories = ["Todos", "Tecnologia", "Alimentos", "Artesanato", "Vestuário", "Serviços"];

function getSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export default function LojasPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredStores = mockStores.filter((store) => {
    const matchesSearch = store.name.toLowerCase().includes(search.toLowerCase()) || 
      store.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || store.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Header />
      <main className="flex-1 bg-background py-12">
        <div className="container space-y-10">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
            <div className="space-y-2">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs border-0 px-3 py-1 rounded-full font-semibold">
                Parceiros Conecta
              </Badge>
              <h1 className="font-sora text-3xl md:text-4xl font-extrabold tracking-tight">
                Lojas do Marketplace
              </h1>
              <p className="text-muted-foreground">
                Conheça os empreendedores locais e cooperativas que fazem a diferença na economia circular.
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar loja ou especialidade..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Stores Grid */}
          {filteredStores.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStores.map((store) => {
                const slug = getSlug(store.name);
                return (
                  <Card key={store.id} className="flex flex-col justify-between hover:border-primary/40 transition-colors">
                    <CardHeader className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {store.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-yellow-500 font-semibold text-sm">
                          <Star className="h-4 w-4 fill-yellow-500 stroke-yellow-500" />
                          <span>{store.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <div>
                        <CardTitle className="font-sora text-xl font-bold flex items-center gap-2">
                          <Store className="h-5 w-5 text-primary" />
                          {store.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 mt-2">
                          {store.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{store.productsCount}</span> produtos cadastrados
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Link href={`/loja/${slug}`} className="w-full">
                        <Button className="w-full font-semibold" variant="outline">
                          Ver Loja
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <Store className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
              <p className="text-muted-foreground text-lg">Nenhuma loja encontrada para a busca selecionada.</p>
              <Button onClick={() => { setSearch(""); setSelectedCategory("Todos"); }} variant="link">
                Limpar filtros
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

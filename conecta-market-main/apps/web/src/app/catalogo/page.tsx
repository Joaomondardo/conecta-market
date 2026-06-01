"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  SlidersHorizontal,
  Package,
  Briefcase,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import {
  MarketplaceCard,
  type ItemType,
  type MarketplaceCardProps,
} from "@/components/marketplace/marketplace-card";
import Link from "next/link";

// ── Mock data (substituído pela API na próxima fase) ─────────────────────────

const mockItems: MarketplaceCardProps[] = [
  {
    id: "1",
    name: "Smartphone Recondicionado Modelo X",
    store: "TechSustentável",
    price: 899.9,
    priceB2B: 750.0,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500",
    type: "PRODUCT",
  },
  {
    id: "2",
    name: "Consultoria em Gestão de MEI",
    store: "Gestão Amiga",
    price: 150.0,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1454165833767-1316b2848721?q=80&w=500",
    type: "SERVICE",
  },
  {
    id: "3",
    name: "Camiseta Algodão Orgânico",
    store: "EcoModa",
    price: 59.9,
    priceB2B: 35.0,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=500",
    type: "PRODUCT",
  },
  {
    id: "4",
    name: "Cadeira de Escritório Ergonômica",
    store: "Móveis B2B",
    price: 450.0,
    priceB2B: 320.0,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=500",
    type: "PRODUCT",
  },
  {
    id: "5",
    name: "Manutenção de Computadores",
    store: "TechSustentável",
    price: 120.0,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1591405351990-4726e331f141?q=80&w=500",
    type: "SERVICE",
  },
  {
    id: "6",
    name: "Kit Utensílios de Bambu",
    store: "Casa Eco",
    price: 89.9,
    priceB2B: 50.0,
    rating: 4.2,
    image:
      "https://images.unsplash.com/photo-1584362917165-526a968579e8?q=80&w=500",
    type: "PRODUCT",
  },
  {
    id: "7",
    name: "Design de Logotipo Profissional",
    store: "Estúdio Criativo",
    price: 250.0,
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=500",
    type: "SERVICE",
  },
  {
    id: "8",
    name: "Fone de Ouvido Sem Fio",
    store: "TechSustentável",
    price: 199.9,
    priceB2B: 160.0,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500",
    type: "PRODUCT",
  },
];

// ── Tab config ────────────────────────────────────────────────────────────────

type FilterType = "ALL" | ItemType;

interface Tab {
  value: FilterType;
  label: string;
  Icon: React.ElementType;
  activeClass: string;
  count: (items: MarketplaceCardProps[]) => number;
}

const TABS: Tab[] = [
  {
    value: "ALL",
    label: "Tudo",
    Icon: LayoutGrid,
    activeClass:
      "bg-foreground text-background shadow-md",
    count: (items) => items.length,
  },
  {
    value: "PRODUCT",
    label: "Produtos",
    Icon: Package,
    activeClass:
      "bg-primary text-primary-foreground shadow-md",
    count: (items) => items.filter((i) => i.type === "PRODUCT").length,
  },
  {
    value: "SERVICE",
    label: "Serviços",
    Icon: Briefcase,
    activeClass:
      "bg-violet-600 text-white shadow-md",
    count: (items) => items.filter((i) => i.type === "SERVICE").length,
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CatalogoPage() {
  const [filterType, setFilterType] = useState<FilterType>("ALL");
  const [search, setSearch] = useState("");

  const filteredItems = mockItems.filter((item) => {
    const matchesType = filterType === "ALL" || item.type === filterType;
    const q = search.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(q) ||
      item.store.toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  return (
    <>
      <Header />
      <main className="flex-1 container py-8">

        {/* Page header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <h1 className="font-sora text-3xl font-bold">
              Marketplace Comunitário
            </h1>
            <p className="text-muted-foreground mt-1">
              Produtos e serviços de impacto local e sustentável.
            </p>
          </div>

          {/* CTA onboarding */}
          <Link href="/onboarding">
            <Button
              variant="outline"
              size="sm"
              className="border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground font-semibold gap-2 shrink-0"
            >
              <Sparkles className="h-4 w-4" />
              Quero vender aqui
            </Button>
          </Link>
        </div>

        {/* ── Tabs toggle (Tudo / Produtos / Serviços) ─────────────── */}
        <div className="relative flex items-center gap-1 bg-muted p-1 rounded-xl w-fit mb-8 shadow-inner">
          {TABS.map((tab) => {
            const isActive = filterType === tab.value;
            const Icon = tab.Icon;
            return (
              <button
                key={tab.value}
                id={`tab-${tab.value.toLowerCase()}`}
                onClick={() => setFilterType(tab.value)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                  ${isActive
                    ? `${tab.activeClass} scale-[1.02]`
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-0.5 transition-all
                    ${isActive
                      ? "bg-white/20 text-inherit"
                      : "bg-muted-foreground/10 text-muted-foreground"
                    }`}
                >
                  {tab.count(mockItems)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Layout: sidebar + grid */}
        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar filtros */}
          <aside className="w-full md:w-60 space-y-6 shrink-0 hidden md:block">
            <div className="space-y-4">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Filtros
              </h3>

              <div className="space-y-3">
                <h4 className="text-sm font-medium">Categorias</h4>
                <div className="space-y-2">
                  {[
                    "Eletrônicos",
                    "Moda Sustentável",
                    "Serviços Digitais",
                    "Manutenção",
                    "Artesanato",
                  ].map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-muted-foreground/30 text-primary focus:ring-primary h-4 w-4 accent-primary"
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium">Faixa de Preço</h4>
                <div className="flex items-center gap-2">
                  <Input type="number" placeholder="Mín" className="h-9 text-sm" />
                  <span className="text-muted-foreground shrink-0">–</span>
                  <Input type="number" placeholder="Máx" className="h-9 text-sm" />
                </div>
              </div>

              <Button className="w-full font-semibold" size="sm">
                Aplicar Filtros
              </Button>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Search */}
            <div className="flex items-center gap-2 mb-6">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="busca-catalogo"
                  placeholder="O que você está procurando hoje?"
                  className="pl-10 h-11 bg-background border-muted-foreground/20 focus:border-primary shadow-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <span className="text-sm text-muted-foreground hidden sm:block shrink-0">
                {filteredItems.length} resultado{filteredItems.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Grid */}
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
                <p className="text-muted-foreground mt-1 text-sm">
                  Tente ajustar seus filtros ou termos de busca.
                </p>
              </div>
            )}

            {/* Load more */}
            {filteredItems.length > 0 && (
              <div className="mt-12 flex justify-center">
                <Button
                  id="btn-carregar-mais"
                  variant="outline"
                  className="min-w-[220px] font-semibold border-2 hover:bg-muted"
                >
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

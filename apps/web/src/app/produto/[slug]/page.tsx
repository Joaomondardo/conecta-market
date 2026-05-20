import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Store, Truck, ShieldCheck, Star } from "lucide-react";

// Mock data aligned with catalog items
const mockItems = [
  {
    id: "1",
    name: "Smartphone Recondicionado Modelo X",
    store: "TechSustentável",
    price: 899.9,
    priceB2B: 750.0,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500",
    type: "PRODUCT",
  },
  {
    id: "2",
    name: "Consultoria em Gestão de MEI",
    store: "Gestão Amiga",
    price: 150.0,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1454165833767-1316b2848721?q=80&w=500",
    type: "SERVICE",
  },
  {
    id: "3",
    name: "Camiseta Algodão Orgânico",
    store: "EcoModa",
    price: 59.9,
    priceB2B: 35.0,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=500",
    type: "PRODUCT",
  },
  {
    id: "4",
    name: "Cadeira de Escritório Ergonômica",
    store: "Móveis B2B",
    price: 450.0,
    priceB2B: 320.0,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=500",
    type: "PRODUCT",
  },
  {
    id: "5",
    name: "Manutenção de Computadores",
    store: "TechSustentável",
    price: 120.0,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1591405351990-4726e331f141?q=80&w=500",
    type: "SERVICE",
  },
  {
    id: "6",
    name: "Kit Utensílios de Bambu",
    store: "Casa Eco",
    price: 89.9,
    priceB2B: 50.0,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1584362917165-526a968579e8?q=80&w=500",
    type: "PRODUCT",
  },
  {
    id: "7",
    name: "Design de Logotipo Profissional",
    store: "Estúdio Criativo",
    price: 250.0,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=500",
    type: "SERVICE",
  },
  {
    id: "8",
    name: "Fone de Ouvido Sem Fio",
    store: "TechSustentável",
    price: 199.9,
    priceB2B: 160.0,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500",
    type: "PRODUCT",
  },
];

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = mockItems.find((item) => item.id === params.slug);

  if (!product) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-background py-16 flex items-center justify-center">
          <div className="container max-w-md text-center space-y-6">
            <h1 className="font-sora text-3xl font-bold">Produto não encontrado</h1>
            <p className="text-muted-foreground">O produto ou serviço que você está procurando não existe ou foi removido.</p>
            <Link href="/catalogo">
              <Button size="lg" className="w-full">
                Voltar ao Catálogo
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Header />
      <main className="flex-1 bg-background py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Galeria de Imagens */}
            <div className="flex-1 space-y-4">
              <div className="aspect-square bg-muted rounded-2xl border flex items-center justify-center text-muted-foreground overflow-hidden relative">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 w-24 flex-shrink-0 bg-muted rounded-lg border cursor-pointer hover:border-primary transition-colors overflow-hidden relative">
                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Informações do Produto */}
            <div className="flex-1 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {product.type === "PRODUCT" ? "Produto" : "Serviço"}
                  </Badge>
                  <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 text-xs border-0">
                    {product.type === "PRODUCT" ? "Em Estoque" : "Disponível"}
                  </Badge>
                </div>
                <h1 className="font-sora text-3xl font-bold mb-2">{product.name}</h1>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center text-yellow-500">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} className={`h-4 w-4 ${idx < Math.round(product.rating) ? 'fill-current' : ''}`} />
                    ))}
                    <span className="text-foreground ml-2 font-medium">{product.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground ml-1">(128 avaliações)</span>
                  </div>
                  <span>•</span>
                  <span>+1000 vendidos</span>
                </div>
              </div>

              <div className="bg-muted/30 p-6 rounded-2xl border">
                <div className="mb-6">
                  <span className="text-sm text-muted-foreground line-through">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price * 1.25)}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold font-sora">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                    </span>
                    <span className="text-sm text-muted-foreground">à vista</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    ou 10x de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price / 10)} sem juros
                  </p>
                </div>
                
                {/* Preço B2B */}
                {product.priceB2B && (
                  <div className="mb-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
                    <p className="text-sm font-medium text-primary mb-1">Preço para Atacado (B2B)</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.priceB2B)} / un
                      </span>
                      <span className="text-xs text-muted-foreground">Pedido mínimo: 10 un</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <Button size="lg" className="h-14 text-lg font-bold">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {product.type === "PRODUCT" ? "Adicionar ao Carrinho" : "Contratar Serviço"}
                  </Button>
                  <Button size="lg" variant="outline" className="h-14">
                    <Heart className="mr-2 h-5 w-5" /> Salvar nos Favoritos
                  </Button>
                </div>
              </div>

              {/* Loja Info */}
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center border">
                      <Store className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Vendido e entregue por</p>
                      <p className="font-bold">{product.store}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Ver loja</Button>
                </CardContent>
              </Card>

              {/* Garantias */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="h-8 w-8 text-muted-foreground" />
                  <span>Entrega rápida para todo o Brasil</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <ShieldCheck className="h-8 w-8 text-muted-foreground" />
                  <span>Compra 100% segura e garantida</span>
                </div>
              </div>
            </div>
          </div>

          {/* Descrição do Produto */}
          <div className="mt-16">
            <h2 className="font-sora text-2xl font-bold mb-6 border-b pb-4">Descrição do {product.type === "PRODUCT" ? "Produto" : "Serviço"}</h2>
            <div className="prose max-w-none text-muted-foreground">
              {product.type === "PRODUCT" ? (
                <>
                  <p>O {product.name} é o companheiro ideal para o seu dia a dia. Com design elegante e durável, ele atende às necessidades mais exigentes com alta performance.</p>
                  <ul>
                    <li>Alta durabilidade e excelente acabamento</li>
                    <li>Design moderno, elegante e ergonômico</li>
                    <li>Garantia de satisfação de uso</li>
                    <li>Custo-benefício otimizado para o mercado</li>
                  </ul>
                </>
              ) : (
                <>
                  <p>A contratação do serviço de {product.name} é realizada de forma simples e rápida pela plataforma Conecta Market, assegurando a entrega por prestadores avaliados da nossa rede.</p>
                  <ul>
                    <li>Atendimento ágil e personalizado</li>
                    <li>Profissionais experientes do mercado local</li>
                    <li>Certificação de qualidade de entrega</li>
                    <li>Suporte dedicado durante toda a prestação</li>
                  </ul>
                </>
              )}
              <p>Adquira ou contrate agora e transforme sua rotina com mais tecnologia e praticidade.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

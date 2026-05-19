import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

// Mock data (será substituído pelo Zustand / API)
const mockCartItems = [
  {
    id: "1",
    name: "Smartphone Recondicionado Modelo X",
    store: "TechSustentável",
    price: 899.90,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500",
  },
  {
    id: "2",
    name: "Camiseta Algodão Orgânico",
    store: "EcoModa",
    price: 59.90,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=500",
  }
];

export default function CarrinhoPage() {
  const subtotal = mockCartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const frete = 25.00; // Mock fixo
  const total = subtotal + frete;

  return (
    <>
      <Header />
      <main className="flex-1 bg-muted/20 py-8">
        <div className="container max-w-6xl">
          <h1 className="font-sora text-3xl font-bold mb-8">Meu Carrinho</h1>

          {mockCartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Lista de Itens */}
              <div className="lg:col-span-2 space-y-4">
                {mockCartItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-0 flex flex-col sm:flex-row">
                      <div className="relative w-full sm:w-32 aspect-square sm:aspect-auto sm:h-32 bg-muted shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <div className="text-xs text-muted-foreground font-medium mb-1">{item.store}</div>
                            <h3 className="font-semibold text-sm sm:text-base leading-tight mb-2 line-clamp-2">{item.name}</h3>
                          </div>
                          <div className="font-sora font-bold text-primary whitespace-nowrap">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                          </div>
                        </div>
                        
                        <div className="mt-auto pt-4 flex items-center justify-between">
                          <div className="flex items-center border rounded-md">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none">
                              <Minus className="h-3 w-3" />
                            </Button>
                            <div className="w-10 text-center text-sm font-medium border-x h-8 flex items-center justify-center">
                              {item.quantity}
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none">
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" /> Remover
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Resumo do Pedido */}
              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="font-sora">Resumo do Pedido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal ({mockCartItems.length} itens)</span>
                        <span className="font-medium">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Frete estimado</span>
                        <span className="font-medium">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(frete)}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">Cupom de Desconto</label>
                      <div className="flex gap-2">
                        <Input placeholder="Digite seu cupom" className="h-9" />
                        <Button variant="outline" size="sm" className="h-9">Aplicar</Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center py-2">
                      <span className="font-sora font-semibold text-lg">Total</span>
                      <span className="font-sora font-bold text-xl text-primary">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                      </span>
                    </div>

                    <Button className="w-full h-12 text-base font-semibold" asChild>
                      <Link href="/checkout">
                        Finalizar Compra <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <div className="text-center">
                      <Link href="/catalogo" className="text-sm font-medium text-primary hover:underline">
                        Continuar Comprando
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-background rounded-xl border border-dashed">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
                <ShoppingBag className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold font-sora mb-2">Seu carrinho está vazio</h2>
              <p className="text-muted-foreground mb-8 max-w-[400px] mx-auto">
                Explore nosso catálogo e encontre produtos incríveis de pequenos empreendedores.
              </p>
              <Button size="lg" asChild>
                <Link href="/catalogo">Explorar Catálogo</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Store, Truck, ShieldCheck, Star } from "lucide-react";

export default function ProductPage({ params }: { params: { slug: string } }) {
  // Em uma aplicação real, aqui buscaríamos os dados do produto pelo slug (params.slug) via SSR/RSC
  
  return (
    <>
      <Header />
      <main className="flex-1 bg-background py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Galeria de Imagens */}
            <div className="flex-1 space-y-4">
              <div className="aspect-square bg-muted rounded-2xl border flex items-center justify-center text-muted-foreground overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000" 
                  alt="Produto" 
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 w-24 flex-shrink-0 bg-muted rounded-lg border cursor-pointer hover:border-primary transition-colors"></div>
                ))}
              </div>
            </div>

            {/* Informações do Produto */}
            <div className="flex-1 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">Tecnologia</Badge>
                  <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 text-xs border-0">Em Estoque</Badge>
                </div>
                <h1 className="font-sora text-3xl font-bold mb-2">Smartwatch Premium Series X</h1>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-foreground ml-2 font-medium">5.0</span>
                    <span className="text-muted-foreground ml-1">(128 avaliações)</span>
                  </div>
                  <span>•</span>
                  <span>+1000 vendidos</span>
                </div>
              </div>

              <div className="bg-muted/30 p-6 rounded-2xl border">
                <div className="mb-6">
                  <span className="text-sm text-muted-foreground line-through">R$ 599,90</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold font-sora">R$ 399,90</span>
                    <span className="text-sm text-muted-foreground">à vista</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    ou 10x de R$ 39,99 sem juros
                  </p>
                </div>
                
                {/* Preço B2B */}
                <div className="mb-6 p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <p className="text-sm font-medium text-primary mb-1">Preço para Atacado (B2B)</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">R$ 299,90 / un</span>
                    <span className="text-xs text-muted-foreground">Pedido mínimo: 10 un</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button size="lg" className="h-14 text-lg font-bold">
                    <ShoppingCart className="mr-2 h-5 w-5" /> Adicionar ao Carrinho
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
                      <p className="font-bold">TechStore Oficial</p>
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
            <h2 className="font-sora text-2xl font-bold mb-6 border-b pb-4">Descrição do Produto</h2>
            <div className="prose max-w-none text-muted-foreground">
              <p>O Smartwatch Premium Series X é o companheiro ideal para o seu dia a dia. Com design elegante e tela AMOLED de alta resolução, ele oferece diversas funcionalidades para monitorar sua saúde e atividades físicas.</p>
              <ul>
                <li>Monitoramento cardíaco 24/7</li>
                <li>Resistência à água até 50 metros</li>
                <li>Bateria com duração de até 14 dias</li>
                <li>Mais de 100 modos de esporte</li>
              </ul>
              <p>Adquira agora e transforme sua rotina com mais tecnologia e praticidade.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

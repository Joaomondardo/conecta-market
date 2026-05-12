import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star, Trash2 } from "lucide-react";

export default function FavoritosPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/20 py-8">
        <div className="container max-w-5xl">
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* Sidebar Conta */}
            <aside className="w-full md:w-64 space-y-2 flex-shrink-0">
              <div className="bg-background rounded-xl border p-4 mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                    J
                  </div>
                  <div>
                    <p className="font-semibold text-sm">João Silva</p>
                    <p className="text-xs text-muted-foreground">joao@exemplo.com</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <Button variant="ghost" className="justify-start font-normal text-muted-foreground hover:bg-muted">Meu Perfil</Button>
                <Button variant="ghost" className="justify-start font-normal text-muted-foreground hover:bg-muted">Meus Pedidos</Button>
                <Button variant="secondary" className="justify-start font-medium bg-primary/5 text-primary hover:bg-primary/10">Favoritos</Button>
                <Button variant="ghost" className="justify-start font-normal text-red-500 hover:text-red-600 hover:bg-red-50">Sair</Button>
              </div>
            </aside>

            {/* Conteúdo Principal */}
            <div className="flex-1 space-y-6">
              <h1 className="font-sora text-2xl font-bold flex items-center gap-2">
                <Heart className="h-6 w-6 text-red-500 fill-current" />
                Meus Favoritos
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <Card key={item} className="overflow-hidden group">
                    <div className="flex">
                      <div className="w-1/3 bg-muted aspect-square flex items-center justify-center relative">
                        <Heart className="h-12 w-12 text-muted-foreground/30" />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-2 left-2 bg-background/50 hover:bg-red-50 hover:text-red-500 h-8 w-8 rounded-full"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="w-2/3 p-4 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                            Produto Premium Exemplo {item}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" /> 5.0
                          </div>
                          <p className="font-sora font-bold">R$ 199,90</p>
                        </div>
                        <Button size="sm" className="w-full mt-2">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

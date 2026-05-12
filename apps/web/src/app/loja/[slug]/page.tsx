import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Store, MapPin, Mail, Phone, Star, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function StorePage({ params }: { params: { slug: string } }) {
  // Em uma aplicação real, aqui buscaríamos os dados da loja pelo slug (params.slug) via SSR/RSC

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Banner da Loja */}
      <div className="h-48 md:h-64 bg-muted relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 z-0"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-20 z-0">
           {/* Placeholder for banner image */}
        </div>
      </div>

      <main className="flex-1 bg-background pb-12">
        <div className="container relative">
          {/* Perfil da Loja Flutuante */}
          <div className="bg-background rounded-2xl shadow-lg border p-6 -mt-20 relative z-10 flex flex-col md:flex-row gap-6 items-center md:items-start mb-12">
            <div className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-background bg-muted flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
               <Store className="h-12 w-12 text-muted-foreground" />
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <h1 className="font-sora text-2xl md:text-3xl font-bold">TechStore Oficial</h1>
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20">Verificada</Badge>
                  </div>
                  <p className="text-muted-foreground">Especialistas em tecnologia e acessórios inteligentes.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button>Seguir Loja</Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground pt-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium text-foreground">4.9</span> (342 avaliações)
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>São Paulo, SP</span>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="font-normal text-xs">Varejo (B2C)</Badge>
                  <Badge variant="outline" className="font-normal text-xs">Atacado (B2B)</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Produtos da Loja */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="font-sora text-2xl font-bold">Produtos da Loja</h2>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar nesta loja..." className="pl-9" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <Card key={item} className="overflow-hidden group hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="aspect-square bg-muted relative overflow-hidden">
                    {/* Imagem Placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
                      <Store className="h-12 w-12" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                        Produto de Exemplo {item}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" /> 5.0
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-sora font-bold text-lg">R$ 99,90</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-center mt-8">
              <Button variant="outline" size="lg">Carregar Mais Produtos</Button>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}

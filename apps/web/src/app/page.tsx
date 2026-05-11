import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Store, Users, TrendingUp, ShieldCheck, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-muted overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 z-0" />
          <div className="container relative z-10 py-20 md:py-32 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                Inclusão digital para todos
              </div>
              <h1 className="font-sora text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                O Marketplace feito para <span className="text-primary">conectar</span> você ao sucesso.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-[600px] leading-relaxed">
                Compre diretamente de pequenos produtores ou venda seus produtos para milhares de clientes, tudo em um ambiente seguro, intuitivo e acessível.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="h-12 px-8 font-semibold rounded-full shadow-lg shadow-primary/20" asChild>
                  <Link href="/catalogo">
                    Explorar Produtos <ShoppingBag className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 font-semibold rounded-full bg-background/50 backdrop-blur-sm" asChild>
                  <Link href="/cadastro">
                    Começar a Vender <Store className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 relative hidden md:block">
              <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[2.5rem] rotate-3 transform origin-bottom-right"></div>
                <div className="absolute inset-0 bg-background rounded-[2.5rem] shadow-2xl border overflow-hidden -rotate-2 transform origin-bottom-right transition-transform hover:rotate-0 duration-500">
                  <Image
                    src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1000"
                    alt="Pessoas comprando e vendendo"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {/* Floating Badges */}
                <div className="absolute -left-6 top-20 bg-background rounded-xl p-4 shadow-xl border flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="bg-primary/10 p-2 rounded-lg text-primary"><TrendingUp className="h-5 w-5" /></div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Vendas B2B</p>
                    <p className="text-sm font-bold">+150% cresc.</p>
                  </div>
                </div>
                <div className="absolute -right-6 bottom-32 bg-background rounded-xl p-4 shadow-xl border flex items-center gap-3 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                  <div className="bg-blue-500/10 p-2 rounded-lg text-blue-500"><ShieldCheck className="h-5 w-5" /></div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Compra Segura</p>
                    <p className="text-sm font-bold">100% Garantido</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features / Por que escolher */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center max-w-[800px] mx-auto mb-16">
              <h2 className="font-sora text-3xl md:text-4xl font-bold mb-4">Por que escolher o Conecta Market?</h2>
              <p className="text-muted-foreground text-lg">Nossa plataforma foi desenhada pensando nas reais necessidades de pequenos negócios e consumidores exigentes.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-muted/50 rounded-2xl p-8 border hover:border-primary/50 transition-colors group">
                <div className="h-14 w-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <HeartHandshake className="h-7 w-7" />
                </div>
                <h3 className="font-sora text-xl font-semibold mb-3">Inclusão Real</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Interface simplificada com foco em baixo letramento digital. Qualquer pessoa pode vender ou comprar sem dificuldades técnicas.
                </p>
              </div>
              <div className="bg-muted/50 rounded-2xl p-8 border hover:border-blue-500/50 transition-colors group">
                <div className="h-14 w-14 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="h-7 w-7" />
                </div>
                <h3 className="font-sora text-xl font-semibold mb-3">Híbrido B2B e B2C</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Compre no varejo ou atacado. Vendedores podem definir preços especiais e quantidades mínimas para vendas empresariais.
                </p>
              </div>
              <div className="bg-muted/50 rounded-2xl p-8 border hover:border-orange-500/50 transition-colors group">
                <div className="h-14 w-14 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-7 w-7" />
                </div>
                <h3 className="font-sora text-xl font-semibold mb-3">Crescimento Apoiado</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Oferecemos métricas simplificadas, campanhas promocionais integradas (cashback, cupons) e ferramentas para escalar seu negócio.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary z-0" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=2000')] opacity-10 mix-blend-multiply z-0" />
          <div className="container relative z-10 text-center text-primary-foreground">
            <h2 className="font-sora text-3xl md:text-5xl font-bold mb-6">Pronto para fazer parte desta comunidade?</h2>
            <p className="text-primary-foreground/80 text-lg md:text-xl max-w-[700px] mx-auto mb-10">
              Junte-se a milhares de usuários que já estão comprando com impacto e vendendo com propósito.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-bold rounded-full text-primary" asChild>
                <Link href="/cadastro">Criar minha conta grátis</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

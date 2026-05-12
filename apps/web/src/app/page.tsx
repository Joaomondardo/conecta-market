import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Store, Users, TrendingUp, ShieldCheck, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { productService } from "@/services/api/products.service";

export default async function Home() {
  const products = await productService.findAll();

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
              <h1 className="font-sora text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]" id="hero-title">
                O Marketplace feito para <span className="text-primary">conectar</span> você ao sucesso.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-[600px] leading-relaxed">
                Compre diretamente de pequenos produtores ou venda seus produtos para milhares de clientes, tudo em um ambiente seguro, intuitivo e acessível.
              </p>
            </div>
            
            {/* Products List (Mocked Integration) */}
            <div className="flex-1 bg-background rounded-3xl p-8 border shadow-xl">
              <h3 className="font-sora text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" /> Destaques do Dia
              </h3>
              <div className="space-y-4">
                {products.length > 0 ? (
                  products.slice(0, 2).map((product: any) => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-transparent hover:border-primary/20 transition-all cursor-pointer">
                      <div>
                        <p className="font-bold">{product.name}</p>
                        <p className="text-sm text-muted-foreground">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm py-8 text-center">Nenhum produto em destaque no momento.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Rest of the page... */}

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

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, HeartHandshake, Sparkles, Landmark } from "lucide-react";

export default function SobrePage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        {/* Hero Section */}
        <section className="relative bg-muted overflow-hidden py-20 md:py-32 border-b">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent z-0" />
          <div className="container relative z-10 text-center max-w-3xl mx-auto space-y-6">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs border-0 px-4 py-1.5 rounded-full font-semibold">
              Sobre Nós
            </Badge>
            <h1 className="font-sora text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Tecnologia com <span className="text-primary">Propósito Social</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              O Conecta Market nasceu para digitalizar pequenos negócios e impulsionar a economia local, promovendo inclusão real de forma justa e acessível.
            </p>
          </div>
        </section>

        {/* Parceria ABADEUS */}
        <section className="py-20 bg-background border-b">
          <div className="container">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                <Badge variant="outline" className="text-xs">
                  Parceiro Institucional
                </Badge>
                <h2 className="font-sora text-3xl md:text-4xl font-bold tracking-tight">
                  Parceria ABADEUS: Inovação Social e Comunidade
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  A <strong>ABADEUS</strong> é uma organização do terceiro setor em Criciúma/SC, com atuação destacada em programas de capacitação profissional, inclusão social e fomento ao empreendedorismo periférico.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Por meio dessa parceria, o Conecta Market atua como a infraestrutura digital que conecta os talentos e negócios locais gerados nos bairros <strong>Cristo Redentor</strong> e <strong>Ana Maria</strong> diretamente à comunidade regional de Criciúma. Auxiliamos no letramento digital e fornecemos ferramentas de e-commerce robustas e amigáveis para quem mais precisa.
                </p>
                <div className="pt-2">
                  <a href="https://abadeus.org.br" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <Landmark className="mr-2 h-4 w-4" /> Conhecer a ABADEUS
                    </Button>
                  </a>
                </div>
              </div>
              <div className="flex-1 w-full">
                <Card className="bg-muted/30 border-2 border-primary/10 rounded-2xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-primary/5 blur-3xl" />
                  <CardHeader className="p-0 pb-6">
                    <CardTitle className="font-sora text-2xl font-bold">O Impacto da Parceria</CardTitle>
                    <CardDescription>Fortalecendo o ecossistema econômico periférico</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 space-y-4 text-sm text-muted-foreground">
                    <div className="flex items-start gap-3">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs mt-0.5">✓</span>
                      <p><strong>Acompanhamento ativo:</strong> Workshops de formação sobre gestão de produtos e marketing digital.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs mt-0.5">✓</span>
                      <p><strong>Letramento Digital:</strong> Acesso simplificado ao aplicativo móvel sem barreiras técnicas complexas.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs mt-0.5">✓</span>
                      <p><strong>Autonomia Econômica:</strong> Integração de carteira de cashback e vendas corporativas B2B.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Impacto (Números) */}
        <section className="py-20 bg-muted/30 border-b">
          <div className="container text-center space-y-12">
            <div className="max-w-2xl mx-auto space-y-4">
              <Badge variant="outline" className="text-xs">Impacto Real</Badge>
              <h2 className="font-sora text-3xl md:text-4xl font-bold tracking-tight">O Projeto em Números</h2>
              <p className="text-muted-foreground">Nosso alcance e impacto gerados na região a partir da tecnologia local.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover:border-primary/30 transition-colors">
                <CardContent className="pt-8 text-center space-y-2">
                  <div className="text-5xl font-black font-sora text-primary">400+</div>
                  <p className="font-bold text-lg">Negócios Locais</p>
                  <p className="text-xs text-muted-foreground">Empreendedores capacitados e cadastrados ativamente na plataforma.</p>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/30 transition-colors">
                <CardContent className="pt-8 text-center space-y-2">
                  <div className="text-5xl font-black font-sora text-primary">2</div>
                  <p className="font-bold text-lg">Bairros Atendidos</p>
                  <p className="text-xs text-muted-foreground">Foco no desenvolvimento social dos bairros Cristo Redentor e Ana Maria.</p>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/30 transition-colors">
                <CardContent className="pt-8 text-center space-y-2">
                  <div className="text-5xl font-black font-sora text-primary">60+</div>
                  <p className="font-bold text-lg">Anos de ABADEUS</p>
                  <p className="text-xs text-muted-foreground">Décadas de história promovendo inovação social em Criciúma/SC.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Nossos Valores */}
        <section className="py-20 bg-background">
          <div className="container space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <Badge variant="outline" className="text-xs">Princípios</Badge>
              <h2 className="font-sora text-3xl md:text-4xl font-bold tracking-tight">Nossos Valores</h2>
              <p className="text-muted-foreground">Bases éticas e operacionais que orientam a nossa tecnologia e operações cotidianas.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center space-y-4 p-6 bg-muted/20 rounded-2xl border">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="font-sora text-xl font-bold">Inclusão Digital</h3>
                <p className="text-muted-foreground text-sm">
                  Criamos interfaces pensadas para usuários de baixo letramento digital, garantindo acessibilidade a todos.
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-4 p-6 bg-muted/20 rounded-2xl border">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="font-sora text-xl font-bold">Economia Local</h3>
                <p className="text-muted-foreground text-sm">
                  Retemos o capital e os lucros dentro das comunidades, estimulando negócios circulares sustentáveis.
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-4 p-6 bg-muted/20 rounded-2xl border">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <HeartHandshake className="h-6 w-6" />
                </div>
                <h3 className="font-sora text-xl font-bold">Comunidade</h3>
                <p className="text-muted-foreground text-sm">
                  Fomentamos a união local entre cooperativas, produtores e consumidores para um desenvolvimento social integrado.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

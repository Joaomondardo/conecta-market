import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, FileText, BookOpen, Users, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

const sections = [
  { id: "webinars", label: "Webinars e Treinamentos" },
  { id: "guias", label: "Guias em PDF" },
  { id: "praticas", label: "Melhores Práticas" },
  { id: "comunidade", label: "Comunidade de Vendedores" },
  { id: "contato", label: "Mais Informações" },
];

const webinars = [
  { titulo: "Como criar uma loja de sucesso", data: "Em breve", status: "Aguardando" },
  { titulo: "Marketing digital para pequenos negócios", data: "Em breve", status: "Aguardando" },
  { titulo: "Fotografia de produtos com celular", data: "Em breve", status: "Aguardando" },
  { titulo: "Gestão financeira básica para MEIs", data: "Em breve", status: "Aguardando" },
];

const guias = [
  { titulo: "Guia Completo do Vendedor", desc: "Do cadastro à primeira venda", paginas: "32 páginas" },
  { titulo: "Como tirar fotos incríveis dos seus produtos", desc: "Técnicas simples para fotos profissionais", paginas: "18 páginas" },
  { titulo: "Estratégias de precificação", desc: "Como definir o preço certo para o seu produto", paginas: "24 páginas" },
  { titulo: "Atendimento ao cliente 5 estrelas", desc: "Construindo a reputação da sua loja", paginas: "16 páginas" },
];

export default function CapacitacaoPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        {/* Hero */}
        <section className="relative bg-muted overflow-hidden py-20 md:py-28 border-b">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent z-0" />
          <div className="container relative z-10 text-center max-w-3xl mx-auto space-y-6">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs border-0 px-4 py-1.5 rounded-full font-semibold">
              Capacitação
            </Badge>
            <h1 className="font-sora text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.15] text-foreground">
              Recursos de <span className="text-primary">Capacitação</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Aprenda, cresça e venda mais. Conteúdos gratuitos criados para empreendedores como você.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container flex flex-col lg:flex-row gap-12">
            {/* Sidebar */}
            <aside className="lg:w-64 shrink-0">
              <div className="sticky top-6 bg-muted/30 border rounded-2xl p-5 space-y-2">
                <p className="font-sora font-semibold text-sm text-foreground mb-3">Nesta página</p>
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1 border-l-2 border-transparent hover:border-primary pl-3"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </aside>

            <div className="flex-1 space-y-12">
              <div id="webinars" className="scroll-mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Video className="h-5 w-5" />
                  </div>
                  <h2 className="font-sora text-2xl font-bold">Webinars e Treinamentos</h2>
                </div>
                <div className="space-y-3">
                  {webinars.map((w) => (
                    <Card key={w.titulo} className="hover:border-primary/30 transition-colors">
                      <CardContent className="pt-5 pb-5 flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-foreground">{w.titulo}</p>
                          <p className="text-sm text-muted-foreground mt-1">{w.data}</p>
                        </div>
                        <Badge variant="secondary" className="shrink-0">{w.status}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Inscreva-se para ser notificado quando novos treinamentos forem disponibilizados.</p>
              </div>

              <div id="guias" className="scroll-mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h2 className="font-sora text-2xl font-bold">Guias em PDF para Download</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {guias.map((g) => (
                    <Card key={g.titulo} className="hover:border-primary/30 transition-colors cursor-pointer">
                      <CardContent className="pt-5 pb-5 space-y-2">
                        <p className="font-semibold text-foreground text-sm">{g.titulo}</p>
                        <p className="text-xs text-muted-foreground">{g.desc}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">{g.paginas}</span>
                          <Button variant="outline" size="sm" className="text-xs h-7">
                            Download PDF
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div id="praticas" className="scroll-mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h2 className="font-sora text-2xl font-bold">Melhores Práticas para Lojistas</h2>
                </div>
                <Card>
                  <CardContent className="pt-6 text-muted-foreground space-y-3">
                    <ul className="space-y-3">
                      {[
                        "Use fotos de alta qualidade com fundo neutro e boa iluminação",
                        "Responda mensagens de clientes em até 2 horas durante o horário comercial",
                        "Mantenha o estoque atualizado para evitar frustração dos compradores",
                        "Descreva os produtos com detalhes: materiais, dimensões, modo de uso",
                        "Ofereça embalagens cuidadosas para transmitir profissionalismo",
                        "Solicite avaliações após cada entrega bem-sucedida",
                        "Participe dos programas de promoção da plataforma para maior visibilidade",
                      ].map((p) => (
                        <li key={p} className="flex items-start gap-2 text-sm">
                          <span className="h-4 w-4 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5">✓</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div id="comunidade" className="scroll-mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                  <h2 className="font-sora text-2xl font-bold">Comunidade de Vendedores</h2>
                </div>
                <Card>
                  <CardContent className="pt-6 text-muted-foreground space-y-3">
                    <p>
                      Faça parte da nossa comunidade de empreendedores no WhatsApp e Telegram. Troque experiências, tire dúvidas e descubra estratégias com outros lojistas da plataforma.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <Button variant="outline" size="sm">Grupo WhatsApp (em breve)</Button>
                      <Button variant="outline" size="sm">Canal Telegram (em breve)</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div id="contato" className="scroll-mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Mail className="h-5 w-5" />
                  </div>
                  <h2 className="font-sora text-2xl font-bold">Contato para Mais Informações</h2>
                </div>
                <Card>
                  <CardContent className="pt-6 text-muted-foreground space-y-2">
                    <p>Para solicitar treinamentos personalizados ou parcerias de capacitação com a ABADEUS:</p>
                    <p className="font-semibold text-foreground">📧 capacitacao@conectamarket.com</p>
                    <p>📞 (11) 4000-0001 — Seg. a Sex., 9h às 17h</p>
                  </CardContent>
                </Card>
              </div>

              {/* CTA */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center space-y-4">
                <h3 className="font-sora text-2xl font-bold">Comece a vender com confiança</h3>
                <p className="text-muted-foreground">Use nossos recursos e transforme seu negócio com o Conecta Market.</p>
                <Link href="/como-vender">
                  <Button size="lg" className="gap-2">
                    Como vender na plataforma <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

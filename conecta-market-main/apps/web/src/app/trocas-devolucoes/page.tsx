import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, ListOrdered, Wallet, HeadphonesIcon, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";

const sections = [
  { id: "prazo", label: "Prazo para devolução" },
  { id: "passo-a-passo", label: "Passo a passo da troca" },
  { id: "reembolso", label: "Reembolso e ressarcimento" },
  { id: "contato", label: "Contato para suporte" },
  { id: "politica", label: "Política de 30 dias" },
];

export default function TrocasDevolucoesPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        {/* Hero */}
        <section className="relative bg-muted overflow-hidden py-20 md:py-28 border-b">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent z-0" />
          <div className="container relative z-10 text-center max-w-3xl mx-auto space-y-6">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs border-0 px-4 py-1.5 rounded-full font-semibold">
              Pós-venda
            </Badge>
            <h1 className="font-sora text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.15] text-foreground">
              Trocas e <span className="text-primary">Devoluções</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Compre com tranquilidade. Nossa política de 30 dias garante que você ficará satisfeito com cada compra.
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
              <div id="prazo" className="scroll-mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <h2 className="font-sora text-2xl font-bold">Prazo para Solicitar Devolução</h2>
                </div>
                <Card>
                  <CardContent className="pt-6 text-muted-foreground space-y-3">
                    <p>
                      Você tem até <strong className="text-foreground">30 dias corridos</strong> após o recebimento do produto para solicitar uma devolução ou troca, conforme o Código de Defesa do Consumidor.
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Produto com defeito: até 30 dias (bens não duráveis) ou 90 dias (bens duráveis)</li>
                      <li>Arrependimento: até 7 dias após o recebimento (CDC)</li>
                      <li>Produto errado ou não correspondente: 30 dias</li>
                      <li>Avaria no transporte: notifique em até 48h após recebimento</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div id="passo-a-passo" className="scroll-mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <ListOrdered className="h-5 w-5" />
                  </div>
                  <h2 className="font-sora text-2xl font-bold">Passo a Passo da Troca</h2>
                </div>
                <div className="space-y-3">
                  {[
                    { step: "1", title: "Acesse Minha Conta", desc: "Entre na plataforma, vá em Pedidos e localize o pedido com problema." },
                    { step: "2", title: "Solicite a devolução", desc: 'Clique em "Solicitar devolução/troca" e descreva o motivo detalhadamente.' },
                    { step: "3", title: "Aguarde aprovação", desc: "O vendedor tem até 3 dias úteis para aceitar e fornecer a etiqueta de devolução." },
                    { step: "4", title: "Envie o produto", desc: "Embale o produto com segurança e envie usando a etiqueta fornecida." },
                    { step: "5", title: "Troca ou reembolso", desc: "Após o recebimento e verificação, a troca ou reembolso é processado em até 5 dias úteis." },
                  ].map((item) => (
                    <Card key={item.step} className="hover:border-primary/30 transition-colors">
                      <CardContent className="pt-5 pb-5 flex gap-4">
                        <span className="h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center shrink-0">
                          {item.step}
                        </span>
                        <div>
                          <p className="font-semibold text-foreground">{item.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div id="reembolso" className="scroll-mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <h2 className="font-sora text-2xl font-bold">Reembolso e Ressarcimento</h2>
                </div>
                <Card>
                  <CardContent className="pt-6 text-muted-foreground space-y-3">
                    <p>O reembolso é feito pelo mesmo método de pagamento utilizado na compra:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong className="text-foreground">Pix:</strong> até 1 dia útil</li>
                      <li><strong className="text-foreground">Cartão de crédito:</strong> até 2 faturas subsequentes</li>
                      <li><strong className="text-foreground">Boleto:</strong> depósito em conta em até 5 dias úteis</li>
                    </ul>
                    <p>Você também pode optar por crédito em carteira digital na plataforma, com processamento imediato.</p>
                  </CardContent>
                </Card>
              </div>

              <div id="contato" className="scroll-mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <HeadphonesIcon className="h-5 w-5" />
                  </div>
                  <h2 className="font-sora text-2xl font-bold">Contato para Suporte</h2>
                </div>
                <Card>
                  <CardContent className="pt-6 text-muted-foreground space-y-2">
                    <p className="font-semibold text-foreground">Central de Atendimento</p>
                    <p>📧 contato@conectamarket.com</p>
                    <p>📞 (11) 4000-0000 — Seg. a Sex., das 8h às 18h</p>
                    <p>💬 Chat online disponível na plataforma (em breve)</p>
                  </CardContent>
                </Card>
              </div>

              <div id="politica" className="scroll-mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Shield className="h-5 w-5" />
                  </div>
                  <h2 className="font-sora text-2xl font-bold">Política de 30 Dias</h2>
                </div>
                <Card className="border-primary/30">
                  <CardContent className="pt-6 text-muted-foreground space-y-3">
                    <p className="text-foreground font-semibold">Sua satisfação é nossa prioridade.</p>
                    <p>
                      Acreditamos em relações de confiança. Por isso, garantimos que qualquer problema com sua compra será resolvido dentro de 30 dias, sem burocracia e com total transparência.
                    </p>
                    <p>
                      Caso o vendedor não responda em 3 dias úteis, nossa equipe assume o caso diretamente e garante o ressarcimento.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* CTA */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center space-y-4">
                <h3 className="font-sora text-2xl font-bold">Precisa solicitar uma devolução?</h3>
                <p className="text-muted-foreground">Acesse sua conta e inicie o processo agora mesmo.</p>
                <Link href="/login">
                  <Button size="lg" className="gap-2">
                    Ir para Minha Conta <ArrowRight className="h-4 w-4" />
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

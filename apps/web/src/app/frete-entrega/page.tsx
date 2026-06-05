import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Clock, MapPin, RotateCcw, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";

const sections = [
  { id: "calculo", label: "Cálculo de frete" },
  { id: "prazos", label: "Prazos por região" },
  { id: "rastreamento", label: "Rastreamento em tempo real" },
  { id: "devolucao", label: "Devolução e reembolso" },
  { id: "retorno", label: "Endereço de retorno" },
];

const regioes = [
  { regiao: "Capital (SP)", prazo: "1–2 dias úteis", frete: "A partir de R$ 8,90" },
  { regiao: "Sul (SC/RS/PR)", prazo: "2–4 dias úteis", frete: "A partir de R$ 12,90" },
  { regiao: "Sudeste", prazo: "2–5 dias úteis", frete: "A partir de R$ 14,90" },
  { regiao: "Centro-Oeste", prazo: "3–6 dias úteis", frete: "A partir de R$ 17,90" },
  { regiao: "Norte/Nordeste", prazo: "5–10 dias úteis", frete: "A partir de R$ 22,90" },
];

export default function FreteEntregaPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        {/* Hero */}
        <section className="relative bg-muted overflow-hidden py-20 md:py-28 border-b">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent z-0" />
          <div className="container relative z-10 text-center max-w-3xl mx-auto space-y-6">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs border-0 px-4 py-1.5 rounded-full font-semibold">
              Logística
            </Badge>
            <h1 className="font-sora text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.15] text-foreground">
              Frete e <span className="text-primary">Entrega</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Saiba tudo sobre o cálculo de frete, prazos de entrega e como rastrear seus pedidos em tempo real.
            </p>
          </div>
        </section>

        {/* Conteúdo + Sidebar */}
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
              <div id="calculo" className="scroll-mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <h2 className="font-sora text-2xl font-bold">Cálculo de Frete</h2>
                </div>
                <Card>
                  <CardContent className="pt-6 text-muted-foreground space-y-3">
                    <p>O frete é calculado automaticamente no checkout com base no CEP de entrega, peso e dimensões dos produtos. O cálculo leva em conta:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Peso total dos itens no carrinho</li>
                      <li>Distância entre a loja e o destino</li>
                      <li>Tipo de entrega (padrão ou expressa)</li>
                      <li>Promoções de frete grátis ativas</li>
                    </ul>
                    <p className="text-sm">Frete grátis para compras acima de <strong className="text-foreground">R$ 150,00</strong> em lojas participantes.</p>
                  </CardContent>
                </Card>
              </div>

              <div id="prazos" className="scroll-mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Clock className="h-5 w-5" />
                  </div>
                  <h2 className="font-sora text-2xl font-bold">Prazos de Entrega por Região</h2>
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 font-semibold text-foreground">Região</th>
                            <th className="text-left py-3 font-semibold text-foreground">Prazo estimado</th>
                            <th className="text-left py-3 font-semibold text-foreground">Frete a partir de</th>
                          </tr>
                        </thead>
                        <tbody>
                          {regioes.map((r) => (
                            <tr key={r.regiao} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                              <td className="py-3 text-muted-foreground">{r.regiao}</td>
                              <td className="py-3 text-muted-foreground">{r.prazo}</td>
                              <td className="py-3 text-primary font-semibold">{r.frete}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">* Prazos contados a partir da confirmação do pagamento. Podem variar em períodos de alta demanda.</p>
                  </CardContent>
                </Card>
              </div>

              <div id="rastreamento" className="scroll-mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <h2 className="font-sora text-2xl font-bold">Rastreamento em Tempo Real</h2>
                </div>
                <Card>
                  <CardContent className="pt-6 text-muted-foreground space-y-3">
                    <p>Após o envio, você receberá um código de rastreio por email. Acompanhe seu pedido:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Na área <strong className="text-foreground">Minha conta → Pedidos</strong> na plataforma</li>
                      <li>Diretamente no site dos Correios (correios.com.br)</li>
                      <li>Por notificação push se habilitada no celular</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div id="devolucao" className="scroll-mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <RotateCcw className="h-5 w-5" />
                  </div>
                  <h2 className="font-sora text-2xl font-bold">Devolução e Reembolso</h2>
                </div>
                <Card>
                  <CardContent className="pt-6 text-muted-foreground space-y-3">
                    <p>
                      Em caso de produtos com defeito ou não conformidade, você tem até <strong className="text-foreground">30 dias</strong> para solicitar a devolução. O frete de retorno é custeado pelo vendedor nesses casos.
                    </p>
                    <p>O reembolso é processado em até 5 dias úteis após o recebimento e verificação do produto devolvido.</p>
                  </CardContent>
                </Card>
              </div>

              <div id="retorno" className="scroll-mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <h2 className="font-sora text-2xl font-bold">Endereço de Retorno (ABADEUS)</h2>
                </div>
                <Card>
                  <CardContent className="pt-6 text-muted-foreground space-y-3">
                    <p>As devoluções são encaminhadas através da parceira ABADEUS:</p>
                    <div className="bg-muted/30 rounded-xl p-4 space-y-1 text-sm">
                      <p className="font-semibold text-foreground">ABADEUS — Associação Beneficente</p>
                      <p>Rua da Comunidade, 456 — Bairro Cristo Redentor</p>
                      <p>Criciúma, SC — CEP: 88800-000</p>
                      <p>contato@abadeus.org.br | (48) 3000-0000</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* CTA */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center space-y-4">
                <h3 className="font-sora text-2xl font-bold">Precisa de ajuda com entrega?</h3>
                <p className="text-muted-foreground">Fale com nossa equipe de suporte para resolver qualquer situação.</p>
                <Link href="/central-ajuda">
                  <Button size="lg" className="gap-2">
                    Acessar Central de Ajuda <ArrowRight className="h-4 w-4" />
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

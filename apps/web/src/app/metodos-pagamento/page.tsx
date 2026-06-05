import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Barcode, Smartphone, Layers, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

const sections = [
  { id: "cartao", label: "Cartão de crédito/débito" },
  { id: "boleto", label: "Boleto bancário" },
  { id: "pix", label: "Pix" },
  { id: "parcelamento", label: "Parcelamento" },
  { id: "seguranca", label: "Segurança de pagamento" },
];

const methods = [
  {
    id: "cartao",
    icon: CreditCard,
    title: "Cartão de Crédito / Débito",
    badge: "Mais popular",
    desc: "Aceitos os principais cartões: Visa, Mastercard, Elo, Hipercard e American Express. O pagamento é processado de forma instantânea e você recebe a confirmação do pedido imediatamente.",
    details: [
      "Aprovação imediata em segundos",
      "Débito: desconto imediato na conta",
      "Crédito: cobrança na fatura mensal",
      "Ambiente 100% seguro com criptografia SSL",
    ],
  },
  {
    id: "boleto",
    icon: Barcode,
    title: "Boleto Bancário",
    badge: "Sem cartão",
    desc: "Gere um boleto bancário com vencimento em 3 dias úteis. Após o pagamento, aguarde até 2 dias úteis para compensação.",
    details: [
      "Válido por 3 dias úteis",
      "Pague em qualquer banco ou lotérica",
      "Confirmação em até 2 dias úteis",
      "Não precisa de conta bancária",
    ],
  },
  {
    id: "pix",
    icon: Smartphone,
    title: "Pix",
    badge: "Instantâneo",
    desc: "Pague com Pix e tenha seu pedido confirmado em segundos, 24 horas por dia, 7 dias por semana — inclusive feriados.",
    details: [
      "Confirmação instantânea",
      "Disponível 24h/7 dias",
      "Use qualquer banco com Pix",
      "Não há taxas adicionais",
    ],
  },
  {
    id: "parcelamento",
    icon: Layers,
    title: "Parcelamento",
    badge: "Flexível",
    desc: "Parcelamento disponível para compras com cartão de crédito. As condições variam conforme o valor da compra e as configurações de cada loja.",
    details: [
      "Parcelamento em até 12x",
      "Parcelas a partir de R$ 10,00",
      "Juros definidos pela operadora do cartão",
      "Disponível nas principais bandeiras",
    ],
  },
  {
    id: "seguranca",
    icon: ShieldCheck,
    title: "Segurança de Pagamento",
    badge: "Protegido",
    desc: "Todas as transações no Conecta Market são protegidas por criptografia de ponta a ponta e certificação SSL, garantindo a segurança dos seus dados.",
    details: [
      "Certificação SSL 256-bit",
      "Dados nunca armazenados localmente",
      "Conformidade com PCI DSS",
      "Monitoramento antifraude em tempo real",
    ],
  },
];

export default function MetodosPagamentoPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        {/* Hero */}
        <section className="relative bg-muted overflow-hidden py-20 md:py-28 border-b">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent z-0" />
          <div className="container relative z-10 text-center max-w-3xl mx-auto space-y-6">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs border-0 px-4 py-1.5 rounded-full font-semibold">
              Pagamentos
            </Badge>
            <h1 className="font-sora text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.15] text-foreground">
              Métodos de{" "}
              <span className="text-primary">Pagamento</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Escolha a forma de pagamento mais conveniente para você. Aceitamos as principais opções do mercado com total segurança.
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

            {/* Content */}
            <div className="flex-1 space-y-8">
              {methods.map((m) => (
                <div key={m.id} id={m.id} className="scroll-mt-6">
                  <Card className="hover:border-primary/30 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <m.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="font-sora text-xl font-bold">{m.title}</h2>
                            <Badge variant="secondary" className="text-xs">{m.badge}</Badge>
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed">{m.desc}</p>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                            {m.details.map((d) => (
                              <li key={d} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="h-4 w-4 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0">✓</span>
                                {d}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}

              {/* CTA */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center space-y-4">
                <h3 className="font-sora text-2xl font-bold">Dúvidas sobre pagamentos?</h3>
                <p className="text-muted-foreground">Nossa Central de Ajuda está disponível para te apoiar.</p>
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

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

const planos = [
  {
    nome: "Básico",
    comissao: "8%",
    listagens: "20 produtos",
    suporte: "Email",
    preco: "Grátis",
    destaque: false,
    recursos: [
      "Vitrine personalizada",
      "Painel de vendas",
      "Relatórios básicos",
      "Pagamentos integrados",
      "Suporte por email",
    ],
  },
  {
    nome: "Profissional",
    comissao: "5%",
    listagens: "100 produtos",
    suporte: "Email + Chat",
    preco: "R$ 49/mês",
    destaque: true,
    recursos: [
      "Tudo do plano Básico",
      "Campanhas e cupons",
      "Analytics avançado",
      "Integração com redes sociais",
      "Suporte via chat",
      "Destaque nos resultados",
    ],
  },
  {
    nome: "Premium",
    comissao: "3%",
    listagens: "Ilimitado",
    suporte: "Prioritário",
    preco: "R$ 149/mês",
    destaque: false,
    recursos: [
      "Tudo do plano Profissional",
      "Suporte prioritário 24/7",
      "Gerente de conta dedicado",
      "API personalizada",
      "Relatórios personalizados",
      "Programa B2B incluso",
    ],
  },
];

export default function PlanosTaxasPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        {/* Hero */}
        <section className="relative bg-muted overflow-hidden py-20 md:py-28 border-b">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent z-0" />
          <div className="container relative z-10 text-center max-w-3xl mx-auto space-y-6">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs border-0 px-4 py-1.5 rounded-full font-semibold">
              Preços
            </Badge>
            <h1 className="font-sora text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.15] text-foreground">
              Planos e <span className="text-primary">Taxas</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Escolha o plano ideal para o seu negócio. Comece grátis e cresça no seu ritmo.
            </p>
          </div>
        </section>

        {/* Tabela Comparativa */}
        <section className="py-16">
          <div className="container max-w-5xl mx-auto space-y-12">
            {/* Cards de plano */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {planos.map((plano) => (
                <Card
                  key={plano.nome}
                  className={`relative flex flex-col ${plano.destaque ? "border-primary border-2 shadow-lg" : ""}`}
                >
                  {plano.destaque && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground text-xs px-3 py-1">Mais popular</Badge>
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <p className="text-sm text-muted-foreground font-medium">{plano.nome}</p>
                    <CardTitle className="font-sora text-3xl font-black">{plano.preco}</CardTitle>
                    {plano.preco !== "Grátis" && <p className="text-xs text-muted-foreground">+ {plano.comissao} por venda</p>}
                    {plano.preco === "Grátis" && <p className="text-xs text-muted-foreground">{plano.comissao} de comissão por venda</p>}
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1">
                    <ul className="space-y-3 flex-1 mb-6">
                      {plano.recursos.map((r) => (
                        <li key={r} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          {r}
                        </li>
                      ))}
                    </ul>
                    <Link href="/onboarding">
                      <Button
                        className="w-full gap-2"
                        variant={plano.destaque ? "default" : "outline"}
                      >
                        Escolher plano <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Tabela comparativa detalhada */}
            <div>
              <h2 className="font-sora text-2xl font-bold text-center mb-8">Comparativo Completo</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 font-semibold text-foreground">Recurso</th>
                          {planos.map((p) => (
                            <th key={p.nome} className={`text-center py-3 font-semibold ${p.destaque ? "text-primary" : "text-foreground"}`}>
                              {p.nome}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { label: "Comissão por venda", values: ["8%", "5%", "3%"] },
                          { label: "Produtos listados", values: ["20", "100", "Ilimitado"] },
                          { label: "Suporte", values: ["Email", "Email + Chat", "Prioritário 24/7"] },
                          { label: "Campanhas/Cupons", values: ["—", "✓", "✓"] },
                          { label: "Analytics avançado", values: ["—", "✓", "✓"] },
                          { label: "Gerente de conta", values: ["—", "—", "✓"] },
                          { label: "B2B incluso", values: ["—", "—", "✓"] },
                        ].map((row) => (
                          <tr key={row.label} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                            <td className="py-3 text-muted-foreground">{row.label}</td>
                            {row.values.map((v, i) => (
                              <td key={i} className={`py-3 text-center ${planos[i].destaque ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                                {v}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CTA */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center space-y-4">
              <h3 className="font-sora text-2xl font-bold">Dúvidas sobre qual plano escolher?</h3>
              <p className="text-muted-foreground">Nossa equipe está pronta para te ajudar a encontrar o plano certo para o seu negócio.</p>
              <Link href="/central-ajuda">
                <Button size="lg" variant="outline" className="gap-2">
                  Falar com especialista <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

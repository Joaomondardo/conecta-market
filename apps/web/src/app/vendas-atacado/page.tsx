import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, TrendingDown, Handshake, UserCheck, Mail, ArrowRight } from "lucide-react";

const sections = [
  { id: "o-que-e", label: "O que é o programa B2B" },
  { id: "descontos", label: "Descontos por volume" },
  { id: "termos", label: "Termos de pagamento" },
  { id: "cadastro", label: "Cadastro de atacadistas" },
  { id: "contato", label: "Contato comercial" },
];

const faixas = [
  { quantidade: "10–50 unid.", desconto: "10%", prazo: "À vista ou 15 dias" },
  { quantidade: "51–200 unid.", desconto: "18%", prazo: "Até 30 dias" },
  { quantidade: "201–500 unid.", desconto: "25%", prazo: "Até 45 dias" },
  { quantidade: "500+ unid.", desconto: "Sob consulta", prazo: "Negociável" },
];

export default function VendasAtacadoPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        {/* Hero */}
        <section className="relative bg-muted overflow-hidden py-20 md:py-28 border-b">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent z-0" />
          <div className="container relative z-10 text-center max-w-3xl mx-auto space-y-6">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs border-0 px-4 py-1.5 rounded-full font-semibold">
              B2B
            </Badge>
            <h1 className="font-sora text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.15] text-foreground">
              Vendas Atacado <span className="text-primary">(B2B)</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Compras em grande volume com descontos progressivos e condições de pagamento diferenciadas para empresas e revendedores.
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
              <div id="o-que-e" className="scroll-mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <h2 className="font-sora text-2xl font-bold">O que é o Programa B2B</h2>
                </div>
                <Card>
                  <CardContent className="pt-6 text-muted-foreground space-y-3">
                    <p>
                      O programa <strong className="text-foreground">Business-to-Business (B2B)</strong> do Conecta Market é voltado para empresas, revendedores, distribuidores e cooperativas que desejam comprar produtos em maior volume diretamente dos nossos produtores e vendedores locais.
                    </p>
                    <p>
                      Diferente das compras individuais, o B2B oferece condições comerciais diferenciadas, acesso a catálogos exclusivos e um canal de atendimento dedicado para negociações de grande porte.
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Disponível para CNPJ ativo</li>
                      <li>Mínimo de 10 unidades por pedido</li>
                      <li>Faturamento com NF-e</li>
                      <li>Integrável a sistemas de compras corporativos</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div id="descontos" className="scroll-mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <TrendingDown className="h-5 w-5" />
                  </div>
                  <h2 className="font-sora text-2xl font-bold">Descontos Progressivos por Volume</h2>
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 font-semibold text-foreground">Quantidade</th>
                            <th className="text-left py-3 font-semibold text-foreground">Desconto</th>
                            <th className="text-left py-3 font-semibold text-foreground">Prazo de Pagamento</th>
                          </tr>
                        </thead>
                        <tbody>
                          {faixas.map((f) => (
                            <tr key={f.quantidade} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                              <td className="py-3 text-muted-foreground">{f.quantidade}</td>
                              <td className="py-3 text-primary font-bold">{f.desconto}</td>
                              <td className="py-3 text-muted-foreground">{f.prazo}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div id="termos" className="scroll-mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Handshake className="h-5 w-5" />
                  </div>
                  <h2 className="font-sora text-2xl font-bold">Termos de Pagamento Diferenciados</h2>
                </div>
                <Card>
                  <CardContent className="pt-6 text-muted-foreground space-y-3">
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong className="text-foreground">Pix / Transferência:</strong> Aprovação imediata com desconto adicional de 2%</li>
                      <li><strong className="text-foreground">Boleto 15/30 dias:</strong> Para parceiros cadastrados e aprovados em análise de crédito</li>
                      <li><strong className="text-foreground">Cartão corporativo:</strong> Crédito em até 6x sem juros adicionais</li>
                      <li><strong className="text-foreground">NF-e:</strong> Emissão automática em todos os pedidos B2B</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div id="cadastro" className="scroll-mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <h2 className="font-sora text-2xl font-bold">Cadastro para Atacadistas</h2>
                </div>
                <Card>
                  <CardContent className="pt-6 text-muted-foreground space-y-3">
                    <p>O cadastro B2B é separado do cadastro de clientes comuns. Para se tornar um comprador atacadista:</p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Entre em contato via email ou telefone com nossa equipe comercial</li>
                      <li>Envie CNPJ, contrato social e documentos do responsável</li>
                      <li>Análise de crédito em até 3 dias úteis</li>
                      <li>Acesso liberado ao catálogo B2B e condições exclusivas</li>
                    </ol>
                  </CardContent>
                </Card>
              </div>

              <div id="contato" className="scroll-mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Mail className="h-5 w-5" />
                  </div>
                  <h2 className="font-sora text-2xl font-bold">Contato Comercial</h2>
                </div>
                <Card>
                  <CardContent className="pt-6 text-muted-foreground space-y-2">
                    <p className="font-semibold text-foreground">Equipe Comercial B2B</p>
                    <p>📧 comercial@conectamarket.com</p>
                    <p>📞 (11) 4000-0002 — Seg. a Sex., 8h às 18h</p>
                    <p className="text-sm mt-3">Atendemos também por WhatsApp para agilizar as negociações. Informe sua empresa e volume estimado no primeiro contato.</p>
                  </CardContent>
                </Card>
              </div>

              {/* CTA */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center space-y-4">
                <h3 className="font-sora text-2xl font-bold">Interessado em comprar no atacado?</h3>
                <p className="text-muted-foreground">Entre em contato com nossa equipe comercial e obtenha uma proposta personalizada.</p>
                <a href="mailto:comercial@conectamarket.com">
                  <Button size="lg" className="gap-2">
                    Solicitar proposta comercial <ArrowRight className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

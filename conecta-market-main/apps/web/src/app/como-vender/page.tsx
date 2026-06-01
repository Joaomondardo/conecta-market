import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ClipboardList, UserCheck, LayoutDashboard, Percent, ArrowRight } from "lucide-react";
import Link from "next/link";

const sections = [
  { id: "beneficios", label: "Benefícios para vendedores" },
  { id: "requisitos", label: "Requisitos para se cadastrar" },
  { id: "onboarding", label: "Passo a passo do onboarding" },
  { id: "painel", label: "Painel do vendedor" },
  { id: "comissoes", label: "Comissões e taxas" },
];

export default function ComoVenderPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        {/* Hero */}
        <section className="relative bg-muted overflow-hidden py-20 md:py-28 border-b">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent z-0" />
          <div className="container relative z-10 text-center max-w-3xl mx-auto space-y-6">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs border-0 px-4 py-1.5 rounded-full font-semibold">
              Para Vendedores
            </Badge>
            <h1 className="font-sora text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.15] text-foreground">
              Como Vender no <span className="text-primary">Conecta Market</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Leve seu negócio para o digital. Nossa plataforma foi criada para você empreendedor que quer crescer.
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
              <div id="beneficios" className="scroll-mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <h2 className="font-sora text-2xl font-bold">Benefícios para Vendedores</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: "Vitrine Digital", desc: "Crie sua loja personalizada e alcance clientes da sua região e do Brasil todo." },
                    { title: "Pagamento Seguro", desc: "Receba com segurança via Pix, cartão ou boleto. Repasse automático em até 2 dias úteis." },
                    { title: "Painel Completo", desc: "Gerencie produtos, pedidos, estoque e relatórios em um só lugar." },
                    { title: "Capacitação ABADEUS", desc: "Acesso a treinamentos gratuitos em parceria com a ABADEUS para impulsionar suas vendas." },
                    { title: "Visibilidade Local", desc: "Prioridade para empreendedores dos bairros Cristo Redentor e Ana Maria em Criciúma." },
                    { title: "Suporte Dedicado", desc: "Atendimento humanizado para ajudar na configuração da sua loja e dúvidas operacionais." },
                  ].map((b) => (
                    <Card key={b.title} className="hover:border-primary/30 transition-colors">
                      <CardContent className="pt-5 pb-5">
                        <p className="font-semibold text-foreground">{b.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{b.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div id="requisitos" className="scroll-mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <h2 className="font-sora text-2xl font-bold">Requisitos para se Cadastrar</h2>
                </div>
                <Card>
                  <CardContent className="pt-6 text-muted-foreground space-y-3">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Ser maior de 18 anos ou ter representante legal</li>
                      <li>CPF ou CNPJ válido e em situação regular</li>
                      <li>Conta bancária em nome do titular (PF ou PJ)</li>
                      <li>Celular com WhatsApp para confirmação de identidade</li>
                      <li>Produtos dentro das categorias permitidas pela plataforma</li>
                    </ul>
                    <p className="text-sm">MEIs e informais também são aceitos. Nossa equipe analisa cada caso individualmente.</p>
                  </CardContent>
                </Card>
              </div>

              <div id="onboarding" className="scroll-mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <h2 className="font-sora text-2xl font-bold">Passo a Passo do Onboarding</h2>
                </div>
                <div className="space-y-3">
                  {[
                    { step: "1", title: "Crie sua conta", desc: "Cadastre-se com email e senha. Selecione 'Quero ser vendedor'." },
                    { step: "2", title: "Envie seus documentos", desc: "CPF/CNPJ, comprovante bancário e de endereço para verificação." },
                    { step: "3", title: "Configure sua loja", desc: "Adicione nome, logo, banner, descrição e categorias da sua loja." },
                    { step: "4", title: "Cadastre seus produtos", desc: "Fotos, preços, estoque e descrição detalhada de cada item." },
                    { step: "5", title: "Comece a vender!", desc: "Sua loja fica ativa após aprovação (até 48h úteis). Boas vendas!" },
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

              <div id="painel" className="scroll-mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <LayoutDashboard className="h-5 w-5" />
                  </div>
                  <h2 className="font-sora text-2xl font-bold">Painel do Vendedor — Funcionalidades</h2>
                </div>
                <Card>
                  <CardContent className="pt-6 text-muted-foreground">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {["Gestão de produtos e estoque", "Acompanhamento de pedidos", "Relatórios de vendas e receita", "Campanhas e cupons de desconto", "Avaliações dos clientes", "Perfil e configurações da loja", "Painel de analytics", "Integrações de pagamento"].map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm">
                          <span className="h-4 w-4 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0">✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div id="comissoes" className="scroll-mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Percent className="h-5 w-5" />
                  </div>
                  <h2 className="font-sora text-2xl font-bold">Comissões e Taxas</h2>
                </div>
                <Card>
                  <CardContent className="pt-6 text-muted-foreground space-y-3">
                    <p>Trabalhamos com um modelo de comissão sobre as vendas realizadas. Não há taxa de mensalidade no plano básico.</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong className="text-foreground">Plano Básico:</strong> 8% de comissão por venda</li>
                      <li><strong className="text-foreground">Plano Profissional:</strong> 5% de comissão + funcionalidades extras</li>
                      <li><strong className="text-foreground">Plano Premium:</strong> 3% de comissão + suporte prioritário</li>
                    </ul>
                    <p className="text-sm">Sem taxas de adesão, cancelamento ou manutenção. Veja os planos completos em Planos e Taxas.</p>
                    <Link href="/planos-taxas">
                      <Button variant="outline" size="sm" className="mt-2">
                        Ver planos completos
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>

              {/* CTA */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center space-y-4">
                <h3 className="font-sora text-2xl font-bold">Pronto para começar a vender?</h3>
                <p className="text-muted-foreground">Crie sua conta gratuitamente e abra sua loja em minutos.</p>
                <Link href="/onboarding">
                  <Button size="lg" className="gap-2">
                    Começar a vender agora <ArrowRight className="h-4 w-4" />
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

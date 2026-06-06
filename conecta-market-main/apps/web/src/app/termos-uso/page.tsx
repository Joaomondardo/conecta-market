import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const sections = [
  { id: "aceitacao", label: "Aceitação dos termos" },
  { id: "direitos", label: "Direitos e responsabilidades" },
  { id: "proibicoes", label: "Proibições" },
  { id: "responsabilidade", label: "Limitação de responsabilidade" },
  { id: "modificacoes", label: "Modificações dos termos" },
  { id: "lei", label: "Lei aplicável" },
];

export default function TermosUsoPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        {/* Hero */}
        <section className="relative bg-muted overflow-hidden py-20 md:py-28 border-b">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent z-0" />
          <div className="container relative z-10 text-center max-w-3xl mx-auto space-y-6">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs border-0 px-4 py-1.5 rounded-full font-semibold">
              Legal
            </Badge>
            <h1 className="font-sora text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15] text-foreground">
              Termos de <span className="text-primary">Uso</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Última atualização: Janeiro de 2025. Ao usar a plataforma, você concorda com os termos descritos abaixo.
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

            <div className="flex-1 space-y-8 max-w-3xl">
              <Card id="aceitacao" className="scroll-mt-6">
                <CardContent className="pt-6 space-y-3">
                  <h2 className="font-sora text-xl font-bold text-foreground">1. Aceitação dos Termos</h2>
                  <div className="text-muted-foreground text-sm leading-relaxed space-y-2">
                    <p>
                      Ao acessar ou utilizar a plataforma Conecta Market, você concorda com estes Termos de Uso e com nossa Política de Privacidade. Se você não concordar com qualquer parte destes termos, não deverá utilizar os serviços.
                    </p>
                    <p>
                      O uso da plataforma por menores de 18 anos está sujeito à autorização e supervisão dos responsáveis legais. Ao se cadastrar, você declara ser maior de 18 anos ou ter autorização de responsável.
                    </p>
                    <p>
                      Estes termos constituem um acordo juridicamente vinculante entre você ("Usuário") e o Conecta Market ("Plataforma").
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card id="direitos" className="scroll-mt-6">
                <CardContent className="pt-6 space-y-3">
                  <h2 className="font-sora text-xl font-bold text-foreground">2. Direitos e Responsabilidades dos Usuários</h2>
                  <div className="text-muted-foreground text-sm leading-relaxed space-y-2">
                    <p><strong className="text-foreground">Direitos do usuário:</strong></p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Acessar e usar todos os recursos disponíveis conforme o plano contratado</li>
                      <li>Receber suporte técnico e atendimento dentro dos prazos estabelecidos</li>
                      <li>Ter seus dados protegidos conforme a Política de Privacidade</li>
                      <li>Cancelar sua conta a qualquer momento</li>
                    </ul>
                    <p className="mt-2"><strong className="text-foreground">Responsabilidades do usuário:</strong></p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Manter suas credenciais de acesso em segredo</li>
                      <li>Fornecer informações verídicas e atualizadas no cadastro</li>
                      <li>Usar a plataforma apenas para fins lícitos e legítimos</li>
                      <li>Cumprir as leis de defesa do consumidor como comprador ou vendedor</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card id="proibicoes" className="scroll-mt-6">
                <CardContent className="pt-6 space-y-3">
                  <h2 className="font-sora text-xl font-bold text-foreground">3. Proibições</h2>
                  <div className="text-muted-foreground text-sm leading-relaxed space-y-2">
                    <p>É expressamente proibido na plataforma Conecta Market:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Reproduzir, copiar ou redistribuir conteúdo da plataforma sem autorização</li>
                      <li>Enviar spam, correntes ou comunicações não solicitadas a outros usuários</li>
                      <li>Criar contas falsas ou utilizar dados de terceiros sem autorização</li>
                      <li>Anunciar produtos ilegais, falsificados, perigosos ou proibidos por lei</li>
                      <li>Manipular avaliações, comentários ou rankings de produtos e lojas</li>
                      <li>Realizar engenharia reversa ou tentar obter acesso não autorizado ao sistema</li>
                      <li>Praticar qualquer ato de discriminação, assédio ou intimidação</li>
                    </ul>
                    <p>O descumprimento pode resultar em suspensão ou exclusão permanente da conta, sem direito a reembolso.</p>
                  </div>
                </CardContent>
              </Card>

              <Card id="responsabilidade" className="scroll-mt-6">
                <CardContent className="pt-6 space-y-3">
                  <h2 className="font-sora text-xl font-bold text-foreground">4. Limitação de Responsabilidade</h2>
                  <div className="text-muted-foreground text-sm leading-relaxed space-y-2">
                    <p>
                      O Conecta Market atua como intermediador entre compradores e vendedores. Não somos responsáveis pela qualidade, autenticidade ou conformidade dos produtos anunciados pelos vendedores, exceto nos casos em que assumimos responsabilidade explícita.
                    </p>
                    <p>
                      Não nos responsabilizamos por danos indiretos, incidentais ou consequenciais decorrentes do uso ou impossibilidade de uso da plataforma, incluindo lucros cessantes.
                    </p>
                    <p>
                      Nossa responsabilidade máxima fica limitada ao valor pago pelo usuário pelo serviço no período de 12 meses anteriores ao evento.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card id="modificacoes" className="scroll-mt-6">
                <CardContent className="pt-6 space-y-3">
                  <h2 className="font-sora text-xl font-bold text-foreground">5. Modificações dos Termos</h2>
                  <div className="text-muted-foreground text-sm leading-relaxed space-y-2">
                    <p>
                      Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. Alterações significativas serão comunicadas com pelo menos 30 dias de antecedência por email ou notificação na plataforma.
                    </p>
                    <p>
                      O uso continuado da plataforma após a notificação de alterações constituirá sua aceitação dos novos termos. Caso não concorde, você deverá encerrar sua conta antes da data de vigência das alterações.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card id="lei" className="scroll-mt-6">
                <CardContent className="pt-6 space-y-3">
                  <h2 className="font-sora text-xl font-bold text-foreground">6. Lei Aplicável</h2>
                  <div className="text-muted-foreground text-sm leading-relaxed space-y-2">
                    <p>
                      Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil, especialmente o Código Civil Brasileiro, o Código de Defesa do Consumidor (Lei 8.078/1990), o Marco Civil da Internet (Lei 12.965/2014) e a Lei Geral de Proteção de Dados (Lei 13.709/2018).
                    </p>
                    <p>
                      Para resolução de conflitos, fica eleito o foro da Comarca de Criciúma, Santa Catarina, com renúncia a qualquer outro, por mais privilegiado que seja.
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-4">
                      Conecta Market LTDA — CNPJ: 00.000.000/0001-00 — Criciúma, SC
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center space-y-4">
                <h3 className="font-sora text-xl font-bold">Também leia nossa Política de Privacidade</h3>
                <p className="text-muted-foreground text-sm">Saiba como seus dados pessoais são coletados e protegidos.</p>
                <Link href="/politica-privacidade">
                  <Button variant="outline" size="lg" className="gap-2">
                    Ler Política de Privacidade <ArrowRight className="h-4 w-4" />
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

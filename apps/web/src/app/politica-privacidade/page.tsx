import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const sections = [
  { id: "coleta", label: "Coleta de dados pessoais" },
  { id: "uso", label: "Uso e compartilhamento" },
  { id: "cookies", label: "Cookies" },
  { id: "seguranca", label: "Segurança dos dados" },
  { id: "direitos", label: "Direitos do usuário" },
  { id: "lgpd", label: "Contato para LGPD" },
];

export default function PoliticaPrivacidadePage() {
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
              Política de <span className="text-primary">Privacidade</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Última atualização: Janeiro de 2025. Leia com atenção como coletamos, usamos e protegemos seus dados pessoais.
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
              <Card id="coleta" className="scroll-mt-6">
                <CardContent className="pt-6 space-y-3">
                  <h2 className="font-sora text-xl font-bold text-foreground">1. Coleta de Dados Pessoais</h2>
                  <div className="text-muted-foreground text-sm leading-relaxed space-y-2">
                    <p>O Conecta Market coleta dados pessoais necessários para a prestação dos serviços oferecidos na plataforma. Os dados coletados incluem:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong className="text-foreground">Dados de identificação:</strong> nome completo, CPF, data de nascimento</li>
                      <li><strong className="text-foreground">Dados de contato:</strong> email, telefone, WhatsApp</li>
                      <li><strong className="text-foreground">Dados de endereço:</strong> CEP, rua, número, complemento, cidade e estado</li>
                      <li><strong className="text-foreground">Dados financeiros:</strong> dados bancários para repasse (vendedores), histórico de transações</li>
                      <li><strong className="text-foreground">Dados de navegação:</strong> endereço IP, cookies, páginas acessadas, tempo de sessão</li>
                    </ul>
                    <p>A coleta ocorre apenas mediante consentimento explícito do usuário no momento do cadastro ou uso dos serviços.</p>
                  </div>
                </CardContent>
              </Card>

              <Card id="uso" className="scroll-mt-6">
                <CardContent className="pt-6 space-y-3">
                  <h2 className="font-sora text-xl font-bold text-foreground">2. Uso e Compartilhamento de Informações</h2>
                  <div className="text-muted-foreground text-sm leading-relaxed space-y-2">
                    <p>Seus dados são utilizados exclusivamente para:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Processamento de pedidos e transações financeiras</li>
                      <li>Comunicação sobre status de pedidos e atualizações da conta</li>
                      <li>Personalização da experiência na plataforma</li>
                      <li>Prevenção a fraudes e segurança da plataforma</li>
                      <li>Cumprimento de obrigações legais e fiscais</li>
                    </ul>
                    <p><strong className="text-foreground">Compartilhamento:</strong> Dados são compartilhados apenas com parceiros essenciais (processadores de pagamento, transportadoras) e nunca são vendidos a terceiros. Todo compartilhamento segue os termos da LGPD (Lei 13.709/2018).</p>
                  </div>
                </CardContent>
              </Card>

              <Card id="cookies" className="scroll-mt-6">
                <CardContent className="pt-6 space-y-3">
                  <h2 className="font-sora text-xl font-bold text-foreground">3. Cookies</h2>
                  <div className="text-muted-foreground text-sm leading-relaxed space-y-2">
                    <p>Utilizamos cookies para melhorar a experiência de navegação. Os tipos de cookies usados são:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong className="text-foreground">Essenciais:</strong> Necessários para o funcionamento básico da plataforma (sessão, autenticação)</li>
                      <li><strong className="text-foreground">Analíticos:</strong> Coletam dados de uso para melhorias (ex: Google Analytics, anonimizados)</li>
                      <li><strong className="text-foreground">Preferências:</strong> Salvam configurações como idioma e tema escolhidos pelo usuário</li>
                    </ul>
                    <p>Você pode gerenciar ou recusar cookies nas configurações do seu navegador. A recusa de cookies essenciais pode afetar o funcionamento da plataforma.</p>
                  </div>
                </CardContent>
              </Card>

              <Card id="seguranca" className="scroll-mt-6">
                <CardContent className="pt-6 space-y-3">
                  <h2 className="font-sora text-xl font-bold text-foreground">4. Segurança dos Dados</h2>
                  <div className="text-muted-foreground text-sm leading-relaxed space-y-2">
                    <p>Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Criptografia SSL/TLS em todas as transmissões de dados</li>
                      <li>Armazenamento seguro com criptografia em repouso</li>
                      <li>Acesso restrito a dados por colaboradores autorizados</li>
                      <li>Monitoramento contínuo contra atividades suspeitas</li>
                      <li>Conformidade com padrões PCI DSS para dados financeiros</li>
                    </ul>
                    <p>Em caso de incidente de segurança, notificaremos os usuários afetados e a ANPD dentro dos prazos legais.</p>
                  </div>
                </CardContent>
              </Card>

              <Card id="direitos" className="scroll-mt-6">
                <CardContent className="pt-6 space-y-3">
                  <h2 className="font-sora text-xl font-bold text-foreground">5. Direitos do Usuário</h2>
                  <div className="text-muted-foreground text-sm leading-relaxed space-y-2">
                    <p>Conforme a LGPD, você possui os seguintes direitos sobre seus dados:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Confirmar a existência de tratamento de dados</li>
                      <li>Acessar os dados que temos sobre você</li>
                      <li>Corrigir dados incorretos ou desatualizados</li>
                      <li>Solicitar a exclusão de dados desnecessários</li>
                      <li>Revogar o consentimento a qualquer momento</li>
                      <li>Portabilidade dos dados para outro serviço</li>
                      <li>Opor-se ao tratamento em casos previstos em lei</li>
                    </ul>
                    <p>Para exercer qualquer um desses direitos, entre em contato com nossa equipe de privacidade.</p>
                  </div>
                </CardContent>
              </Card>

              <Card id="lgpd" className="scroll-mt-6">
                <CardContent className="pt-6 space-y-3">
                  <h2 className="font-sora text-xl font-bold text-foreground">6. Contato para LGPD</h2>
                  <div className="text-muted-foreground text-sm leading-relaxed space-y-2">
                    <p>Para solicitações relacionadas à proteção de dados pessoais:</p>
                    <div className="bg-muted/30 rounded-xl p-4 space-y-1">
                      <p className="font-semibold text-foreground">Encarregado de Dados (DPO)</p>
                      <p>📧 privacidade@conectamarket.com</p>
                      <p>📞 (11) 4000-0003</p>
                      <p>Resposta em até 15 dias úteis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center space-y-4">
                <h3 className="font-sora text-xl font-bold">Também leia nossos Termos de Uso</h3>
                <p className="text-muted-foreground text-sm">Conheça as regras gerais de uso da plataforma.</p>
                <Link href="/termos-uso">
                  <Button variant="outline" size="lg" className="gap-2">
                    Ler Termos de Uso <ArrowRight className="h-4 w-4" />
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

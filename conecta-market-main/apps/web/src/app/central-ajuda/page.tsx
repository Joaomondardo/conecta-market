"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, MessageCircle, Phone, Mail, ArrowRight } from "lucide-react";

const sections = [
  { id: "faq", label: "Perguntas Frequentes" },
  { id: "contato", label: "Fale Conosco" },
  { id: "canais", label: "Canais de Suporte" },
];

const faqs = [
  {
    q: "Como faço meu primeiro cadastro?",
    a: "Clique em 'Criar conta' no canto superior direito, preencha seus dados (nome, email e senha) e confirme pelo email que você receberá. Em minutos você já poderá comprar!",
  },
  {
    q: "Como faço para rastrear meu pedido?",
    a: "Acesse 'Minha Conta → Pedidos' e localize o pedido desejado. Você verá o status atual e o código de rastreio quando o produto for despachado.",
  },
  {
    q: "Posso cancelar um pedido?",
    a: "Sim, enquanto o status for 'Confirmado' ou 'Em preparação'. Após o envio, é necessário abrir uma solicitação de devolução.",
  },
  {
    q: "Quais formas de pagamento são aceitas?",
    a: "Aceitamos cartão de crédito (parcelado em até 12x), débito, Pix (aprovação instantânea) e boleto bancário (prazo de compensação de 1–2 dias úteis).",
  },
  {
    q: "Como me torno um vendedor na plataforma?",
    a: "Acesse a página 'Como Vender', clique em 'Quero ser vendedor' e siga o processo de onboarding. Nossa equipe valida o cadastro em até 48h úteis.",
  },
  {
    q: "Quais são os prazos de devolução?",
    a: "Você tem até 30 dias corridos após o recebimento para solicitar devolução ou troca por qualquer motivo, conforme o Código de Defesa do Consumidor.",
  },
  {
    q: "O Pix tem alguma taxa adicional?",
    a: "Não. Pagamentos via Pix são processados gratuitamente, sem taxas adicionais para o comprador.",
  },
  {
    q: "Como funciona o cashback?",
    a: "A cada compra elegível, você acumula pontos na sua Carteira Conecta. Esses pontos podem ser usados como desconto em compras futuras dentro da plataforma.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border rounded-xl overflow-hidden cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between p-5 hover:bg-muted/30 transition-colors">
        <p className="font-semibold text-foreground pr-4">{q}</p>
        {open ? (
          <ChevronUp className="h-5 w-5 text-primary shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
        )}
      </div>
      {open && (
        <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t bg-muted/10 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

export default function CentralAjudaPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        {/* Hero */}
        <section className="relative bg-muted overflow-hidden py-20 md:py-28 border-b">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent z-0" />
          <div className="container relative z-10 text-center max-w-3xl mx-auto space-y-6">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs border-0 px-4 py-1.5 rounded-full font-semibold">
              Suporte
            </Badge>
            <h1 className="font-sora text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.15] text-foreground">
              Central de <span className="text-primary">Ajuda</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Encontre respostas rápidas ou entre em contato com nossa equipe. Estamos aqui para te ajudar.
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
              {/* FAQ */}
              <div id="faq" className="scroll-mt-6 space-y-4">
                <h2 className="font-sora text-2xl font-bold">Perguntas Frequentes</h2>
                <div className="space-y-3">
                  {faqs.map((item) => (
                    <FaqItem key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              </div>

              {/* Formulário de Contato */}
              <div id="contato" className="scroll-mt-6 space-y-4">
                <h2 className="font-sora text-2xl font-bold">Fale Conosco</h2>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Nome</label>
                        <input
                          type="text"
                          placeholder="Seu nome completo"
                          className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Email</label>
                        <input
                          type="email"
                          placeholder="seu@email.com"
                          className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Assunto</label>
                      <input
                        type="text"
                        placeholder="Descreva brevemente o assunto"
                        className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Mensagem</label>
                      <textarea
                        rows={5}
                        placeholder="Descreva sua dúvida ou problema em detalhes..."
                        className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                      />
                    </div>
                    <Button className="w-full gap-2">
                      Enviar mensagem <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Canais */}
              <div id="canais" className="scroll-mt-6 space-y-4">
                <h2 className="font-sora text-2xl font-bold">Canais de Suporte</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="text-center hover:border-primary/30 transition-colors">
                    <CardContent className="pt-6 space-y-3">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                        <Mail className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-base">Email</CardTitle>
                      <p className="text-sm text-muted-foreground">contato@conectamarket.com</p>
                      <p className="text-xs text-muted-foreground">Resposta em até 24h úteis</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center hover:border-primary/30 transition-colors">
                    <CardContent className="pt-6 space-y-3">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                        <Phone className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-base">Telefone</CardTitle>
                      <p className="text-sm text-muted-foreground">(11) 4000-0000</p>
                      <p className="text-xs text-muted-foreground">Seg.–Sex., 8h às 18h</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center hover:border-primary/30 transition-colors">
                    <CardContent className="pt-6 space-y-3">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                        <MessageCircle className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-base">Chat Online</CardTitle>
                      <p className="text-sm text-muted-foreground">Em breve na plataforma</p>
                      <p className="text-xs text-muted-foreground">Atendimento em tempo real</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

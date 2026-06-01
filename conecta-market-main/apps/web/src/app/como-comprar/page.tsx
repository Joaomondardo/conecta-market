import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, UserPlus, Search, CreditCard, PackageCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

const sections = [
  { id: "o-que-e", label: "O que é o Conecta Market" },
  { id: "cadastro", label: "Passo a passo do cadastro" },
  { id: "buscar-produtos", label: "Como buscar produtos" },
  { id: "checkout", label: "Carrinho e checkout" },
  { id: "rastreamento", label: "Rastreamento de pedido" },
];

export default function ComoComprarPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        {/* Hero */}
        <section className="relative bg-muted overflow-hidden py-20 md:py-28 border-b">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent z-0" />
          <div className="container relative z-10 text-center max-w-3xl mx-auto space-y-6">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs border-0 px-4 py-1.5 rounded-full font-semibold">
              Guia do Comprador
            </Badge>
            <h1 className="font-sora text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.15] text-foreground">
              Como Comprar no{" "}
              <span className="text-primary">Conecta Market</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Tudo que você precisa saber para fazer suas compras com segurança e praticidade na nossa plataforma.
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
            <div className="flex-1 space-y-12">
              <div id="o-que-e" className="scroll-mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5" />
                  </div>
                  <h2 className="font-sora text-2xl font-bold">O que é o Conecta Market</h2>
                </div>
                <Card>
                  <CardContent className="pt-6 text-muted-foreground leading-relaxed space-y-3">
                    <p>
                      O <strong>Conecta Market</strong> é um marketplace híbrido B2B e B2C voltado para a inclusão digital de pequenos empreendedores locais. Nossa plataforma conecta negócios do bairro a compradores de toda a região.
                    </p>
                    <p>
                      Aqui você encontra produtos artesanais, alimentos, roupas, serviços e muito mais — tudo produzido por empreendedores reais da sua comunidade. Cada compra fortalece a economia local.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div id="cadastro" className="scroll-mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <h2 className="font-sora text-2xl font-bold">Passo a passo do cadastro</h2>
                </div>
                <div className="grid gap-4">
                  {[
                    { step: "1", title: "Acesse o site", desc: "Visite conectamarket.com e clique em 'Criar conta' no canto superior direito." },
                    { step: "2", title: "Preencha seus dados", desc: "Informe seu nome completo, email e crie uma senha segura." },
                    { step: "3", title: "Confirme o email", desc: "Acesse sua caixa de entrada e clique no link de confirmação enviado." },
                    { step: "4", title: "Complete o perfil", desc: "Adicione seu endereço de entrega e pronto — você já pode comprar!" },
                  ].map((item) => (
                    <Card key={item.step} className="hover:border-primary/30 transition-colors">
                      <CardContent className="pt-6 flex gap-4">
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

              <div id="buscar-produtos" className="scroll-mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Search className="h-5 w-5" />
                  </div>
                  <h2 className="font-sora text-2xl font-bold">Como buscar produtos</h2>
                </div>
                <Card>
                  <CardContent className="pt-6 text-muted-foreground space-y-3">
                    <p>Utilize a barra de busca no topo da página para encontrar produtos por nome, categoria ou loja. Você também pode filtrar por:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Categoria (alimentos, roupas, artesanato, etc.)</li>
                      <li>Faixa de preço</li>
                      <li>Avaliação dos vendedores</li>
                      <li>Localização da loja</li>
                      <li>Disponibilidade de estoque</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div id="checkout" className="scroll-mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <h2 className="font-sora text-2xl font-bold">Carrinho e checkout</h2>
                </div>
                <Card>
                  <CardContent className="pt-6 text-muted-foreground space-y-3">
                    <p>
                      Ao encontrar um produto, clique em <strong>"Adicionar ao carrinho"</strong>. Você pode continuar comprando e adicionar itens de diferentes lojas. No checkout:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Revise os itens no carrinho</li>
                      <li>Confirme ou adicione o endereço de entrega</li>
                      <li>Calcule o frete</li>
                      <li>Escolha o método de pagamento</li>
                      <li>Finalize com segurança</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div id="rastreamento" className="scroll-mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <PackageCheck className="h-5 w-5" />
                  </div>
                  <h2 className="font-sora text-2xl font-bold">Rastreamento de pedido</h2>
                </div>
                <Card>
                  <CardContent className="pt-6 text-muted-foreground space-y-3">
                    <p>
                      Após finalizar a compra, você receberá um email de confirmação com o número do pedido. Acompanhe o status em <strong>Minha conta → Pedidos</strong>. Os status são:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Confirmado:</strong> pedido recebido pelo vendedor</li>
                      <li><strong>Em preparação:</strong> produto sendo embalado</li>
                      <li><strong>Enviado:</strong> a caminho com código de rastreio</li>
                      <li><strong>Entregue:</strong> pedido finalizado com sucesso</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* CTA */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center space-y-4">
                <h3 className="font-sora text-2xl font-bold">Pronto para comprar?</h3>
                <p className="text-muted-foreground">Cadastre-se agora e apoie os empreendedores da sua comunidade.</p>
                <Link href="/cadastro">
                  <Button size="lg" className="gap-2">
                    Criar minha conta <ArrowRight className="h-4 w-4" />
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

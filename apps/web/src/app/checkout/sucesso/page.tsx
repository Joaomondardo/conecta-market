import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center bg-muted/20 py-20">
        <div className="container max-w-lg">
          <div className="bg-background rounded-2xl shadow-xl border p-8 md:p-12 text-center space-y-6 relative overflow-hidden">
            {/* Decoração de fundo */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              
              <h1 className="font-sora text-3xl font-bold mb-2">Pedido Confirmado!</h1>
              <p className="text-muted-foreground text-lg mb-8">
                Obrigado por comprar no Conecta Market. Seu pedido <strong>#12345678</strong> foi recebido com sucesso.
              </p>
              
              <div className="w-full bg-muted/50 rounded-xl p-6 text-left space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-background rounded-lg shadow-sm border">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">O que acontece agora?</h3>
                    <p className="text-sm text-muted-foreground mt-1">O vendedor já foi notificado. Você receberá atualizações por e-mail sobre o status da entrega.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Link href="/pedidos" className="flex-1">
                  <Button className="w-full h-12">
                    Acompanhar Pedido
                  </Button>
                </Link>
                <Link href="/catalogo" className="flex-1">
                  <Button variant="outline" className="w-full h-12">
                    Voltar às compras <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

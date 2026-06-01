import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingUp, Users, DollarSign, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardSellerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/20">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="font-sora text-3xl font-bold">Painel do Vendedor</h1>
              <p className="text-muted-foreground">Bem-vindo de volta! Aqui está o resumo da sua loja.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">Ver Minha Loja</Button>
              <Button>Novo Produto</Button>
            </div>
          </div>

          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Vendas no Mês</p>
                  <h3 className="font-sora text-2xl font-bold">R$ 12.450,00</h3>
                  <p className="text-xs text-emerald-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" /> +15% vs mês anterior
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <DollarSign className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Pedidos Pendentes</p>
                  <h3 className="font-sora text-2xl font-bold">14</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Aguardando envio
                  </p>
                </div>
                <div className="h-12 w-12 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500">
                  <Package className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total de Clientes</p>
                  <h3 className="font-sora text-2xl font-bold">342</h3>
                  <p className="text-xs text-emerald-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" /> +8 novos hoje
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
                  <Users className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Avaliação Média</p>
                  <h3 className="font-sora text-2xl font-bold">4.8 <span className="text-yellow-500 text-lg">★</span></h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Baseado em 128 reviews
                  </p>
                </div>
                <div className="h-12 w-12 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-600">
                  <AlertCircle className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pedidos Recentes */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Pedidos Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-muted-foreground">
                  Nesta área, será exibida a tabela com os pedidos mais recentes da sua loja, permitindo alteração de status rápida.
                </div>
              </CardContent>
            </Card>

            {/* Produtos mais vendidos */}
            <Card>
              <CardHeader>
                <CardTitle>Produtos em Destaque</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="text-center py-10 text-muted-foreground">
                  Lista dos 5 produtos mais vendidos do mês com indicador de estoque.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

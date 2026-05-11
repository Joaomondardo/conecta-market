import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Store, TrendingUp, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/20 py-8">
        <div className="container max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="font-sora text-3xl font-bold">Painel Administrativo</h1>
              <p className="text-muted-foreground">Visão geral da plataforma Conecta Market.</p>
            </div>
          </div>

          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total de Usuários</p>
                  <h3 className="font-sora text-2xl font-bold">12.450</h3>
                  <p className="text-xs text-emerald-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" /> +12% este mês
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
                  <p className="text-sm font-medium text-muted-foreground mb-1">Lojas Ativas</p>
                  <h3 className="font-sora text-2xl font-bold">842</h3>
                  <p className="text-xs text-emerald-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" /> +5% este mês
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <Store className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">GMV (Mensal)</p>
                  <h3 className="font-sora text-2xl font-bold">R$ 1.2M</h3>
                  <p className="text-xs text-emerald-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" /> +22% vs mês anterior
                  </p>
                </div>
                <div className="h-12 w-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Lojas Pendentes</p>
                  <h3 className="font-sora text-2xl font-bold text-orange-500">24</h3>
                  <p className="text-xs text-muted-foreground mt-1">Aguardando aprovação</p>
                </div>
                <div className="h-12 w-12 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500">
                  <AlertTriangle className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lojas Aguardando Aprovação */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  Lojas Aguardando Aprovação
                  <Badge variant="secondary" className="bg-orange-500/10 text-orange-600">24</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                      <tr>
                        <th className="px-4 py-3 font-medium">Nome da Loja</th>
                        <th className="px-4 py-3 font-medium">Tipo</th>
                        <th className="px-4 py-3 font-medium">Data Solic.</th>
                        <th className="px-4 py-3 font-medium text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4].map((item) => (
                        <tr key={item} className="border-b hover:bg-muted/30">
                          <td className="px-4 py-3 font-medium">Nova Loja {item}</td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="font-normal text-xs">B2C</Badge>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">Há 2 horas</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-center">
                  <Button variant="link" size="sm">Ver todas as solicitações</Button>
                </div>
              </CardContent>
            </Card>

            {/* Ações Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start h-12">
                  <Users className="h-5 w-5 mr-3 text-muted-foreground" />
                  Gerenciar Usuários
                </Button>
                <Button variant="outline" className="w-full justify-start h-12">
                  <Store className="h-5 w-5 mr-3 text-muted-foreground" />
                  Gerenciar Lojas
                </Button>
                <Button variant="outline" className="w-full justify-start h-12">
                  <TrendingUp className="h-5 w-5 mr-3 text-muted-foreground" />
                  Relatórios Financeiros
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

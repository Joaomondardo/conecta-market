import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Package, CheckCircle2, Clock } from "lucide-react";

export default function SellerOrdersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/20 py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="font-sora text-3xl font-bold">Gestão de Pedidos</h1>
              <p className="text-muted-foreground">Acompanhe e atualize o status das vendas da sua loja.</p>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
                <div className="relative w-full sm:w-96 flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar por número do pedido, cliente..." className="pl-9" />
                </div>
                <div className="w-full sm:w-48">
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="pending">Aguardando Envio</SelectItem>
                      <SelectItem value="shipped">Em trânsito</SelectItem>
                      <SelectItem value="delivered">Entregues</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tabela de Pedidos */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                    <tr>
                      <th className="px-6 py-4 font-medium">Pedido</th>
                      <th className="px-6 py-4 font-medium">Data</th>
                      <th className="px-6 py-4 font-medium">Cliente</th>
                      <th className="px-6 py-4 font-medium">Total</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map((item) => (
                      <tr key={item} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-mono font-medium">#PED-883{item}21</td>
                        <td className="px-6 py-4 text-muted-foreground">10 Mai 2026</td>
                        <td className="px-6 py-4">Maria Oliveira</td>
                        <td className="px-6 py-4 font-medium">R$ 399,90</td>
                        <td className="px-6 py-4">
                          {item === 1 ? (
                            <Badge className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 border-0 gap-1"><Clock className="h-3 w-3" /> Aguardando Envio</Badge>
                          ) : item === 2 ? (
                            <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-0 gap-1"><Package className="h-3 w-3" /> Em trânsito</Badge>
                          ) : (
                            <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-0 gap-1"><CheckCircle2 className="h-3 w-3" /> Entregue</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" /> Detalhes
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t flex justify-between items-center text-sm text-muted-foreground">
                <span>Mostrando 5 de 14 pedidos</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>Anterior</Button>
                  <Button variant="outline" size="sm">Próxima</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

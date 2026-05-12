import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Package } from "lucide-react";

export default function SellerProductsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/20 py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="font-sora text-3xl font-bold">Meus Produtos</h1>
              <p className="text-muted-foreground">Gerencie o catálogo da sua loja.</p>
            </div>
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" /> Novo Produto
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="p-4 border-b flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar produto..." className="pl-9" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Filtros</Button>
                </div>
              </div>

              {/* Tabela de Produtos (Simulada para visual móvel e desktop) */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                    <tr>
                      <th className="px-6 py-4 font-medium">Produto</th>
                      <th className="px-6 py-4 font-medium">Preço (B2C)</th>
                      <th className="px-6 py-4 font-medium">Preço (B2B)</th>
                      <th className="px-6 py-4 font-medium">Estoque</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map((item) => (
                      <tr key={item} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-muted rounded border flex items-center justify-center flex-shrink-0">
                              <Package className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <span className="font-medium">Produto Premium {item}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium">R$ 199,90</td>
                        <td className="px-6 py-4 text-muted-foreground">R$ 149,90 <span className="text-xs">(Min: 10)</span></td>
                        <td className="px-6 py-4">45 unid.</td>
                        <td className="px-6 py-4">
                          <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-0">Ativo</Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t flex justify-between items-center text-sm text-muted-foreground">
                <span>Mostrando 5 de 24 produtos</span>
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

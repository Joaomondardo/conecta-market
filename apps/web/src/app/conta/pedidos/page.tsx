import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PackageSearch, Eye } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Mock data
const mockOrders = [
  {
    id: "ord-1",
    number: "12345678",
    date: new Date(),
    status: "CONFIRMED",
    total: 924.90,
    store: "TechSustentável",
    items: 1
  },
  {
    id: "ord-2",
    number: "87654321",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 dias atrás
    status: "DELIVERED",
    total: 125.00,
    store: "EcoModa",
    items: 2
  }
];

const statusConfig = {
  PENDING: { label: "Pendente", className: "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20" },
  CONFIRMED: { label: "Confirmado", className: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20" },
  PROCESSING: { label: "Processando", className: "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20" },
  SHIPPED: { label: "Enviado", className: "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20" },
  DELIVERED: { label: "Entregue", className: "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" },
  CANCELLED: { label: "Cancelado", className: "bg-red-500/10 text-red-600 hover:bg-red-500/20" },
};

export default function PedidosPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-muted/20 py-8">
        <div className="container max-w-5xl">
          <h1 className="font-sora text-3xl font-bold mb-8">Meus Pedidos</h1>

          <div className="space-y-4">
            {mockOrders.map((order) => {
              const statusInfo = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.PENDING;
              return (
                <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="bg-muted/50 p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                      <div>
                        <p className="text-muted-foreground font-medium text-xs uppercase tracking-wider mb-0.5">Pedido Realizado</p>
                        <p className="font-semibold">{format(order.date, "dd 'de' MMM, yyyy", { locale: ptBR })}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-medium text-xs uppercase tracking-wider mb-0.5">Total</p>
                        <p className="font-semibold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-medium text-xs uppercase tracking-wider mb-0.5">Vendido por</p>
                        <Link href={`/loja/${order.store.toLowerCase()}`} className="font-semibold text-primary hover:underline">{order.store}</Link>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-muted-foreground font-medium text-xs uppercase tracking-wider mb-0.5">Pedido nº</p>
                      <p className="font-mono font-medium">{order.number}</p>
                    </div>
                  </div>
                  <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <PackageSearch className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-sora font-semibold text-lg mb-1">{statusInfo.label}</h3>
                        <p className="text-sm text-muted-foreground">{order.items} {order.items === 1 ? 'item' : 'itens'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <Badge className={`${statusInfo.className} border-0 shadow-none px-3 py-1 text-xs`} variant="outline">
                        {statusInfo.label}
                      </Badge>
                      <Link href={`/conta/pedidos/${order.id}`}>
                        <Button variant="outline">
                          <Eye className="h-4 w-4 mr-2" /> Detalhes
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

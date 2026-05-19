"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useQuery } from "@tanstack/react-query";
import { ordersService, Order } from "@/services/orders.service";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Package, Eye, ShoppingBag } from "lucide-react";
import Link from "next/link";

function StatusBadge({ status }: { status: Order['status'] }) {
  const configs = {
    PENDING: { bg: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", label: "Pendente" },
    CONFIRMED: { bg: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", label: "Confirmado" },
    PROCESSING: { bg: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400", label: "Processando" },
    SHIPPED: { bg: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400", label: "Enviado" },
    DELIVERED: { bg: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", label: "Entregue" },
    CANCELLED: { bg: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", label: "Cancelado" },
    REFUNDED: { bg: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400", label: "Reembolsado" },
  };

  const config = configs[status] || { bg: "bg-gray-100 text-gray-800", label: status };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.bg}`}>
      {config.label}
    </span>
  );
}

export default function PedidosPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const { data: orders = [], isLoading, error } = useQuery<Order[]>({
    queryKey: ["my-orders"],
    queryFn: ordersService.getMyOrders,
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/10">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-sora text-3xl font-bold">Meus Pedidos</h1>
              <p className="text-muted-foreground">Acompanhe suas compras e contratações de serviços.</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-background rounded-2xl border shadow-sm">
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Carregando seus pedidos...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-background rounded-2xl border shadow-sm">
              <p className="text-destructive font-medium">Ocorreu um erro ao carregar os pedidos.</p>
              <Button onClick={() => window.location.reload()} className="mt-4">Tentar novamente</Button>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 bg-background rounded-2xl border-2 border-dashed border-muted shadow-sm">
              <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-1">Você não possui pedidos</h3>
              <p className="text-muted-foreground mb-6">Explore o nosso catálogo para encontrar produtos e serviços locais.</p>
              <Link href="/catalogo">
                <Button>Ir para o Catálogo</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-foreground">Pedido #{order.orderNumber ? order.orderNumber.slice(-8).toUpperCase() : order.id.slice(-8).toUpperCase()}</span>
                          <StatusBadge status={order.status} />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Realizado em {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-sm font-medium">
                          Loja: <span className="text-primary font-semibold">{order.store?.name || 'Loja Local'}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-4 sm:pt-0">
                        <div className="sm:text-right">
                          <p className="text-xs text-muted-foreground">Total</p>
                          <p className="text-lg font-bold text-foreground font-sora">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(order.total))}
                          </p>
                        </div>
                        <Link href={`/pedidos/${order.id}`}>
                          <Button variant="outline" size="sm" className="gap-2 font-semibold">
                            <Eye className="h-4 w-4" />
                            Ver detalhes
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

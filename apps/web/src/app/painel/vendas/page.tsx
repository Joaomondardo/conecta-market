"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersService, Order } from "@/services/orders.service";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  TrendingUp, 
  Package, 
  DollarSign, 
  ShoppingBag,
  RefreshCw,
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";

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

export default function VendasPainelPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (user?.role !== "LOJISTA" && user?.role !== "EMPREENDEDOR" && user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  const { data: orders = [], isLoading: isLoadingOrders, refetch: refetchOrders } = useQuery<Order[]>({
    queryKey: ["seller-orders"],
    queryFn: ordersService.getMyOrders,
    enabled: isAuthenticated,
  });

  const { data: analytics, isLoading: isLoadingAnalytics, refetch: refetchAnalytics } = useQuery({
    queryKey: ["seller-analytics"],
    queryFn: ordersService.getSellerAnalytics,
    enabled: isAuthenticated,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => ordersService.updateOrderStatus(id, status),
    onSuccess: () => {
      toast.success("Status do pedido atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["seller-orders"] });
      queryClient.invalidateQueries({ queryKey: ["seller-analytics"] });
      setActiveDropdown(null);
    },
    onError: () => {
      toast.error("Erro ao atualizar status do pedido.");
    }
  });

  const handleStatusChange = (id: string, status: string) => {
    statusMutation.mutate({ id, status });
  };

  if (!isAuthenticated || (user?.role !== "LOJISTA" && user?.role !== "EMPREENDEDOR" && user?.role !== "ADMIN")) {
    return null;
  }

  const isPageLoading = isLoadingOrders || isLoadingAnalytics;

  return (
    <div className="min-h-screen flex flex-col bg-muted/10">
      <Header />
      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="font-sora text-3xl font-bold">Painel de Vendas</h1>
            <p className="text-muted-foreground">Acompanhe e gerencie as vendas da sua loja.</p>
          </div>
          <Button variant="outline" className="gap-2 font-semibold" onClick={() => { refetchOrders(); refetchAnalytics(); }}>
            <RefreshCw className="h-4 w-4" />
            Atualizar dados
          </Button>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total de Vendas</p>
                <h3 className="font-sora text-2xl font-bold">{analytics?.totalOrders || orders.length}</h3>
                <p className="text-xs text-muted-foreground mt-1">Todos os pedidos recebidos</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <ShoppingBag className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Receita Faturada</p>
                <h3 className="font-sora text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(analytics?.totalRevenue || 0))}
                </h3>
                <p className="text-xs text-emerald-500 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" /> Faturamento geral da loja
                </p>
              </div>
              <div className="h-12 w-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                <DollarSign className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Pedidos Pendentes</p>
                <h3 className="font-sora text-2xl font-bold text-amber-600 dark:text-amber-500">
                  {analytics?.pendingOrders || orders.filter(o => o.status === 'PENDING').length}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Aguardando envio ou processamento</p>
              </div>
              <div className="h-12 w-12 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500">
                <Package className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Vendas */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {isPageLoading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-background">
                <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">Carregando pedidos de vendas...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 bg-background">
                <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-1">Nenhuma venda encontrada</h3>
                <p className="text-muted-foreground">Os pedidos que forem efetuados em sua loja aparecerão aqui.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/50 border-b text-sm font-semibold text-muted-foreground">
                      <th className="p-4">Pedido</th>
                      <th className="p-4">Cliente</th>
                      <th className="p-4">Produtos/Serviços</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Data</th>
                      <th className="p-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-sm">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                        <td className="p-4 font-semibold">#{order.orderNumber ? order.orderNumber.slice(-8).toUpperCase() : order.id.slice(-8).toUpperCase()}</td>
                        <td className="p-4">
                          <p className="font-medium">{order.customer?.name || "Cliente Conecta"}</p>
                          <p className="text-xs text-muted-foreground">{order.customer?.email}</p>
                        </td>
                        <td className="p-4 max-w-[200px] truncate">
                          {order.items?.map(item => `${item.name} (${item.quantity}x)`).join(", ")}
                        </td>
                        <td className="p-4 font-bold">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(order.total))}
                        </td>
                        <td className="p-4">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="p-4 text-right relative">
                          <div className="inline-block text-left">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-1 font-semibold"
                              onClick={() => setActiveDropdown(activeDropdown === order.id ? null : order.id)}
                            >
                              Alterar Status
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                            
                            {activeDropdown === order.id && (
                              <div className="absolute right-4 mt-2 w-48 rounded-xl border bg-background shadow-lg z-50 divide-y overflow-hidden">
                                {['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
                                  <button
                                    key={st}
                                    className="w-full text-left px-4 py-2 hover:bg-muted text-sm font-semibold transition-colors disabled:opacity-50"
                                    onClick={() => handleStatusChange(order.id, st)}
                                    disabled={statusMutation.isPending}
                                  >
                                    {st === 'PENDING' && 'Pendente'}
                                    {st === 'CONFIRMED' && 'Confirmado'}
                                    {st === 'PROCESSING' && 'Processando'}
                                    {st === 'SHIPPED' && 'Enviado'}
                                    {st === 'DELIVERED' && 'Entregue'}
                                    {st === 'CANCELLED' && 'Cancelar'}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

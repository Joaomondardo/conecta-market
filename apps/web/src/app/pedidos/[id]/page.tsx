"use client";

import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersService, Order } from "@/services/orders.service";
import { useAuthStore } from "@/store/useAuthStore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  Package, 
  Calendar,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
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
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${config.bg}`}>
      {config.label}
    </span>
  );
}

export default function PedidoDetalhePage() {
  const { id } = useParams() as { id: string };
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const { data: order, isLoading, error } = useQuery<Order>({
    queryKey: ["order", id],
    queryFn: () => ordersService.getOrderById(id),
    enabled: isAuthenticated && !!id,
  });

  const cancelMutation = useMutation({
    mutationFn: () => ordersService.cancelOrder(id),
    onSuccess: () => {
      toast.success("Pedido cancelado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      setShowCancelDialog(false);
    },
    onError: (err) => {
      toast.error("Ocorreu um erro ao cancelar o pedido.");
      console.error(err);
    }
  });

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/10">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Carregando detalhes do pedido...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/10">
        <Header />
        <main className="flex-1 container py-8 text-center">
          <p className="text-destructive font-medium">Pedido não encontrado ou erro de conexão.</p>
          <Link href="/pedidos">
            <Button className="mt-4">Voltar para Pedidos</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/10">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header de navegação */}
          <div className="mb-6">
            <Link href="/pedidos" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Voltar para meus pedidos
            </Link>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="font-sora text-3xl font-bold flex items-center gap-3">
                Pedido #{order.orderNumber ? order.orderNumber.slice(-8).toUpperCase() : order.id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-muted-foreground mt-1 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Realizado em {new Date(order.createdAt).toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={order.status} />
              {order.status === "PENDING" && (
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => setShowCancelDialog(true)}
                  className="font-semibold"
                >
                  Cancelar Pedido
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Itens do pedido */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Itens do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="divide-y p-0">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex gap-4 p-6 items-center">
                      <div className="h-16 w-16 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} width={64} height={64} className="h-full w-full object-cover" />
                        ) : (
                          <Package className="h-8 w-8 text-muted-foreground/40" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground truncate">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">Qtd: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(item.price))}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Endereço de entrega */}
              {order.address && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      Endereço de Entrega
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-1">
                    <p className="font-semibold text-foreground">{order.customer?.name}</p>
                    <p>{order.address.street}, nº {order.address.number}</p>
                    <p>{order.address.neighborhood}</p>
                    <p>{order.address.city} - {order.address.state}</p>
                    <p>CEP: {order.address.zipCode}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Resumo financeiro */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(order.subtotal || order.total))}</span>
                    </div>
                    {Number(order.discount) > 0 && (
                      <div className="flex justify-between text-green-600 font-semibold">
                        <span>Desconto (Cashback)</span>
                        <span>-{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(order.discount))}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-muted-foreground">
                      <span>Frete</span>
                      <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(order.shipping || 0))}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary font-sora">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(order.total))}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Pagamento */}
              {order.payment && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      Pagamento
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm flex justify-between items-center">
                      <span className="text-muted-foreground">Método</span>
                      <span className="font-semibold">{order.payment.method}</span>
                    </div>
                    <div className="text-sm flex justify-between items-center">
                      <span className="text-muted-foreground">Status</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold 
                        ${order.payment.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {order.payment.status === 'APPROVED' ? 'Aprovado' : 'Pendente'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Modal/Dialog de Confirmação de Cancelamento */}
        {showCancelDialog && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-background rounded-2xl border shadow-lg max-w-md w-full p-6 space-y-6">
              <div className="flex items-center gap-3 text-destructive">
                <AlertTriangle className="h-6 w-6" />
                <h3 className="font-sora text-xl font-bold">Cancelar Pedido?</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Tem certeza que deseja cancelar o pedido? Esta ação não pode ser desfeita e qualquer cashback utilizado será retornado de acordo com as regras da plataforma.
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setShowCancelDialog(false)} disabled={cancelMutation.isPending}>
                  Voltar
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => cancelMutation.mutate()} 
                  disabled={cancelMutation.isPending}
                  className="gap-2"
                >
                  {cancelMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Confirmar Cancelamento
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

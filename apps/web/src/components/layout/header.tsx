"use client";

import Link from "next/link";
import { ShoppingCart, Search, Menu, X, PackageOpen, Store, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { useNotifications } from "@/store/useNotifications";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const cartCount = useCartStore((state) => state.getCartCount());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <PackageOpen className="h-6 w-6 text-primary" />
            <span className="inline-block font-sora font-bold text-xl">Conecta<span className="text-primary">Market</span></span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/catalogo" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Catálogo
            </Link>
            <Link href="/lojas" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Lojas
            </Link>
            <Link href="/sobre" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Sobre Nós
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar produtos..."
              className="h-9 w-64 rounded-md border border-input bg-transparent px-3 py-1 pl-9 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <Link href="/carrinho" className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Sino de Notificações */}
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-pulse">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end">
                <div className="flex items-center justify-between px-4 py-2 border-b">
                  <span className="font-semibold text-sm font-sora">Notificações</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllAsRead()}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      Ler todas
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-muted-foreground">
                      Nenhuma notificação por enquanto.
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((n) => (
                      <DropdownMenuItem
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`flex flex-col items-start gap-1 p-3 border-b last:border-0 cursor-pointer transition-colors ${
                          !n.isRead ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className={`text-xs font-semibold ${!n.isRead ? 'text-primary' : 'text-foreground'}`}>
                            {n.title}
                          </span>
                          {!n.isRead && (
                            <span className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground text-left line-clamp-2">
                          {n.message}
                        </p>
                        <span className="text-[10px] text-muted-foreground/80 mt-1">
                          {new Date(n.createdAt).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="relative h-8 w-8 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/conta/perfil">
                    <DropdownMenuItem>Minha Conta</DropdownMenuItem>
                  </Link>
                  <Link href="/pedidos">
                    <DropdownMenuItem>Meus Pedidos</DropdownMenuItem>
                  </Link>
                  {user.role === 'SELLER' || user.role === 'LOJISTA' || user.role === 'EMPREENDEDOR' || user.role === 'ADMIN' ? (
                    <>
                      <DropdownMenuSeparator />
                      <Link href="/painel/dashboard">
                        <DropdownMenuItem className="flex items-center text-primary font-semibold">
                          <Store className="mr-2 h-4 w-4" />
                          Painel do Vendedor
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/painel/vendas">
                        <DropdownMenuItem className="flex items-center text-primary font-semibold">
                          <Store className="mr-2 h-4 w-4" />
                          Gerenciar Vendas
                        </DropdownMenuItem>
                      </Link>
                    </>
                  ) : null}
                  {user.role === 'ADMIN' && (
                    <Link href="/admin/painel">
                      <DropdownMenuItem>Painel Admin</DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex gap-2">
              <Link href="/login">
                <Button variant="ghost" className="text-sm">Entrar</Button>
              </Link>
              <Link href="/cadastro">
                <Button size="sm" className="text-sm">Cadastrar</Button>
              </Link>
            </div>
          )}

          {isAuthenticated && user && user.wallet && (
            <div className="hidden lg:flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
              <span className="text-xs font-medium text-primary">Cashback:</span>
              <span className="text-xs font-bold text-primary">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(user.wallet.balance))}
              </span>
            </div>
          )}

          <Button

            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="container md:hidden py-4 border-t">
          <div className="flex flex-col space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Buscar produtos..."
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-9 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <nav className="flex flex-col space-y-3">
              <Link href="/catalogo" className="text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>Catálogo</Link>
              <Link href="/lojas" className="text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>Lojas</Link>
              <Link href="/sobre" className="text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>Sobre Nós</Link>
              
              {!isAuthenticated && (
                <>
                  <div className="h-px bg-border my-2" />
                  <Link href="/login" className="text-sm font-medium text-primary" onClick={() => setIsMobileMenuOpen(false)}>Entrar</Link>
                  <Link href="/cadastro" className="text-sm font-medium text-primary" onClick={() => setIsMobileMenuOpen(false)}>Criar Conta</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

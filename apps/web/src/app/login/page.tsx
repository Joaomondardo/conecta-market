"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { PackageOpen, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  // Força ofuscação se o usuário trocar de aba/minimizar a tela
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setShowPassword(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Falha ao realizar login");
      }

      // Salva o JWT no zustand (persistido via local storage)
      setAuth(data.user, data.accessToken);
      toast.success("Login realizado com sucesso!");
      
      // Redireciona com base no papel
      if (data.user.role === "ADMIN") {
        router.push("/admin/painel");
      } else if (data.user.role === "LOJISTA") {
        router.push("/painel/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      toast.error(err.message || "Erro de conexão com o servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <Link href="/" className="flex items-center space-x-2 mb-6">
            <PackageOpen className="h-10 w-10 text-primary" />
          </Link>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground font-sora">
            Bem-vindo de volta
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Entre na sua conta para continuar
          </p>
        </div>

        <Card className="shadow-lg border-0 bg-background/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Acesso ao sistema</CardTitle>
            <CardDescription>
              Insira seu e-mail e senha abaixo para entrar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Endereço de e-mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="bg-background"
                    placeholder="voce@exemplo.com"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <div className="text-sm">
                      <Link href="/recuperar-senha" className="font-medium text-primary hover:text-primary/80">
                        Esqueceu sua senha?
                      </Link>
                    </div>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      // Input do tipo text permite a regra WebkitTextSecurity, ofuscando e bloqueando Inspect
                      type="text"
                      style={{ WebkitTextSecurity: showPassword ? "none" : "disc" } as React.CSSProperties}
                      autoComplete="current-password"
                      required
                      className="bg-background pr-10 font-sans"
                      onBlur={() => setShowPassword(false)}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Entrar na Plataforma"}
                </Button>
              </div>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Não tem uma conta? </span>
              <Link href="/cadastro" className="font-medium text-primary hover:text-primary/80">
                Cadastre-se agora
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

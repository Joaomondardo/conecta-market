import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { PackageOpen } from "lucide-react";

export default function LoginPage() {
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
            <form className="space-y-6" action="#" method="POST">
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
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="bg-background"
                  />
                </div>
              </div>

              <div>
                <Button type="submit" className="w-full">
                  Entrar na Plataforma
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

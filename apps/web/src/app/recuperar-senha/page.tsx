import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { PackageOpen, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <Link href="/" className="flex items-center space-x-2 mb-6">
            <PackageOpen className="h-10 w-10 text-primary" />
          </Link>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground font-sora">
            Recuperar senha
          </h2>
        </div>

        <Card className="shadow-lg border-0 bg-background/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Esqueceu sua senha?</CardTitle>
            <CardDescription>
              Digite o seu endereço de e-mail e nós enviaremos um link para você redefinir sua senha.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" action="#" method="POST">
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

              <div>
                <Button type="submit" className="w-full">
                  Enviar link de recuperação
                </Button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <Link href="/login" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para o login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

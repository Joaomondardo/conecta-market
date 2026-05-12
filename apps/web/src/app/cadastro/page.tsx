import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import { PackageOpen, Store, User } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="w-full max-w-lg space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <Link href="/" className="flex items-center space-x-2 mb-6">
            <PackageOpen className="h-10 w-10 text-primary" />
          </Link>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground font-sora">
            Crie sua conta
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Faça parte da nossa comunidade hoje mesmo
          </p>
        </div>

        <Card className="shadow-lg border-0 bg-background/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Dados de Cadastro</CardTitle>
            <CardDescription>
              Preencha o formulário abaixo para criar sua conta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" action="#" method="POST">
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>Qual o seu objetivo na plataforma?</Label>
                  <RadioGroup defaultValue="customer" className="grid grid-cols-2 gap-4">
                    <div>
                      <RadioGroupItem value="customer" id="customer" className="peer sr-only" />
                      <Label
                        htmlFor="customer"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        <User className="mb-3 h-6 w-6" />
                        Quero Comprar
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="seller" id="seller" className="peer sr-only" />
                      <Label
                        htmlFor="seller"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        <Store className="mb-3 h-6 w-6" />
                        Quero Vender
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input id="name" name="name" type="text" required placeholder="João da Silva" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Endereço de e-mail</Label>
                  <Input id="email" name="email" type="email" required placeholder="voce@exemplo.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input id="password" name="password" type="password" required />
                  <p className="text-xs text-muted-foreground">Sua senha deve ter pelo menos 8 caracteres.</p>
                </div>
              </div>

              <div>
                <Button type="submit" className="w-full">
                  Criar Conta
                </Button>
              </div>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Já tem uma conta? </span>
              <Link href="/login" className="font-medium text-primary hover:text-primary/80">
                Faça login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

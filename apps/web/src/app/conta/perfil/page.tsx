import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, User, Mail, Phone, Shield } from "lucide-react";

export default function PerfilPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-muted/20 py-8">
        <div className="container max-w-4xl">
          <h1 className="font-sora text-3xl font-bold mb-8">Minha Conta</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar de navegação */}
            <Card className="md:col-span-1 h-fit">
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  <a href="/conta/perfil" className="px-6 py-4 border-b bg-primary/5 text-primary font-medium flex items-center">
                    <User className="mr-3 h-5 w-5" /> Dados Pessoais
                  </a>
                  <a href="/conta/pedidos" className="px-6 py-4 border-b hover:bg-muted transition-colors flex items-center text-muted-foreground">
                    <Package className="mr-3 h-5 w-5" /> Meus Pedidos
                  </a>
                  <a href="/conta/enderecos" className="px-6 py-4 border-b hover:bg-muted transition-colors flex items-center text-muted-foreground">
                    <MapPin className="mr-3 h-5 w-5" /> Endereços
                  </a>
                  <a href="/conta/seguranca" className="px-6 py-4 hover:bg-muted transition-colors flex items-center text-muted-foreground">
                    <Shield className="mr-3 h-5 w-5" /> Segurança
                  </a>
                </nav>
              </CardContent>
            </Card>

            {/* Conteúdo Principal */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Foto de Perfil</CardTitle>
                  <CardDescription>Personalize sua conta com uma foto.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-6">
                  <Avatar className="h-24 w-24 border">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-2xl">JS</AvatarFallback>
                  </Avatar>
                  <div className="space-y-3">
                    <Button variant="outline" size="sm">
                      <Camera className="mr-2 h-4 w-4" /> Alterar foto
                    </Button>
                    <p className="text-xs text-muted-foreground">JPG, GIF ou PNG. Tamanho máximo de 2MB.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dados Pessoais</CardTitle>
                  <CardDescription>Mantenha seus dados atualizados para uma melhor experiência.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome Completo</Label>
                        <Input id="nome" defaultValue="João da Silva" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cpf">CPF</Label>
                        <Input id="cpf" defaultValue="123.456.789-00" disabled />
                        <p className="text-[10px] text-muted-foreground">O CPF não pode ser alterado após o cadastro.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input id="email" type="email" defaultValue="joao@exemplo.com" className="pl-9" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input id="telefone" defaultValue="(11) 98765-4321" className="pl-9" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <Button>Salvar Alterações</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

// Imports faltantes na renderização
import { Package, MapPin } from "lucide-react";

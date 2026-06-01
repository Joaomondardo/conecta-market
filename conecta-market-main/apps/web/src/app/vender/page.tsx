import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Store, UploadCloud } from "lucide-react";

export default function VenderPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-muted/20 py-12">
        <div className="container max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="font-sora text-3xl md:text-4xl font-bold mb-4">Comece a vender no Conecta Market</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Abra sua loja online em minutos e alcance milhares de clientes B2B e B2C. Sem taxas de adesão, simples e fácil.
            </p>
          </div>

          <Card className="shadow-lg border-0 bg-background">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-primary">
                <Store className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">Dados da sua Loja</CardTitle>
              <CardDescription>
                Preencha as informações abaixo para criar sua loja na plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form className="space-y-8">
                
                {/* Seção 1: Informações Básicas */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-2">
                    <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                    Informações Básicas
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="storeName">Nome da Loja *</Label>
                      <Input id="storeName" placeholder="Ex: Minha Loja Sustentável" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storeUrl">URL da Loja *</Label>
                      <div className="flex">
                        <div className="bg-muted px-3 py-2 border border-r-0 rounded-l-md text-sm text-muted-foreground flex items-center">
                          conectamarket.com/loja/
                        </div>
                        <Input id="storeUrl" placeholder="minhaloja" className="rounded-l-none" required />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição da Loja *</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Conte um pouco sobre sua loja, seus produtos e sua missão..." 
                      className="min-h-[100px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo de Venda Principal *</Label>
                      <Select required>
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="B2C">Varejo (B2C) - Foco no consumidor final</SelectItem>
                          <SelectItem value="B2B">Atacado (B2B) - Foco em empresas</SelectItem>
                          <SelectItem value="HYBRID">Híbrido (Varejo e Atacado)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="document">CNPJ / CPF *</Label>
                      <Input id="document" placeholder="00.000.000/0000-00" required />
                    </div>
                  </div>
                </div>

                {/* Seção 2: Identidade Visual */}
                <div className="space-y-4 pt-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-2">
                    <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                    Identidade Visual
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Logo da Loja</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer">
                        <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">Clique para enviar a logo</p>
                        <p className="text-xs text-muted-foreground mt-1">Recomendado: 500x500px (JPG, PNG)</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Banner da Loja (Opcional)</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer h-full">
                        <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">Clique para enviar o banner</p>
                        <p className="text-xs text-muted-foreground mt-1">Recomendado: 1200x400px (JPG, PNG)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Button type="submit" size="lg" className="w-full text-lg h-14">
                    Criar Minha Loja
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Ao criar sua loja, você concorda com nossos <a href="/termos-uso" className="underline hover:text-primary">Termos de Uso</a> e <a href="/politica-privacidade" className="underline hover:text-primary">Política de Privacidade para Vendedores</a>.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}

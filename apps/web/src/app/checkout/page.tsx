import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin, CreditCard, CheckCircle2, QrCode } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-muted/20 py-8">
        <div className="container max-w-6xl">
          <div className="mb-8">
            <h1 className="font-sora text-3xl font-bold mb-2">Finalizar Compra</h1>
            {/* Stepper simples */}
            <div className="flex items-center text-sm font-medium text-muted-foreground mt-4">
              <span className="flex items-center text-primary">
                <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs mr-2">1</div>
                Identificação
              </span>
              <div className="w-8 h-px bg-border mx-4" />
              <span className="flex items-center text-primary">
                <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs mr-2">2</div>
                Entrega & Pagamento
              </span>
              <div className="w-8 h-px bg-border mx-4" />
              <span className="flex items-center">
                <div className="h-6 w-6 rounded-full border-2 flex items-center justify-center text-xs mr-2">3</div>
                Confirmação
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulários Checkout */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Endereço */}
              <Card>
                <CardHeader className="flex flex-row items-center gap-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Endereço de Entrega</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP</Label>
                      <Input id="cep" placeholder="00000-000" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="rua">Endereço</Label>
                      <Input id="rua" placeholder="Rua, Avenida, etc." />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="numero">Número</Label>
                      <Input id="numero" placeholder="123" />
                    </div>
                    <div className="space-y-2 sm:col-span-3">
                      <Label htmlFor="complemento">Complemento (opcional)</Label>
                      <Input id="complemento" placeholder="Apto, Bloco, etc." />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bairro">Bairro</Label>
                      <Input id="bairro" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input id="cidade" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estado">Estado</Label>
                      <Input id="estado" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pagamento */}
              <Card>
                <CardHeader className="flex flex-row items-center gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Forma de Pagamento</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <RadioGroup defaultValue="pix" className="space-y-3">
                    <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:border-primary transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5">
                      <RadioGroupItem value="pix" id="pix" />
                      <Label htmlFor="pix" className="flex flex-1 items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <QrCode className="h-5 w-5 text-emerald-500" />
                          <span className="font-medium">PIX</span>
                        </div>
                        <span className="text-xs bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded font-medium">Aprovação Imediata</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:border-primary transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5">
                      <RadioGroupItem value="credit" id="credit" />
                      <Label htmlFor="credit" className="flex flex-1 items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-blue-500" />
                          <span className="font-medium">Cartão de Crédito</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Até 12x</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

            </div>

            {/* Resumo Resumido */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="font-sora">Sua Compra</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-12 h-12 bg-muted rounded-md relative overflow-hidden shrink-0">
                         {/* Thumbnail mockado */}
                         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=100')] bg-cover bg-center" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium line-clamp-1">Smartphone Recondicionado Modelo X</p>
                        <p className="text-muted-foreground">Qtd: 1</p>
                      </div>
                      <div className="font-semibold">R$ 899,90</div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">R$ 899,90</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frete</span>
                      <span className="font-medium">R$ 25,00</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center py-2">
                    <span className="font-sora font-semibold text-lg">Total a pagar</span>
                    <span className="font-sora font-bold text-xl text-primary">
                      R$ 924,90
                    </span>
                  </div>

                  <Button className="w-full h-12 text-base font-semibold" asChild>
                    <Link href="/checkout/sucesso">
                      <CheckCircle2 className="mr-2 h-5 w-5" /> Confirmar Pedido
                    </Link>
                  </Button>
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

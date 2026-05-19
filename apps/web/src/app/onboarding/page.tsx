"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { entrepreneurService } from "@/services/api/entrepreneurs.service";
import {
  Smartphone,
  User,
  Tag,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";

// Categorias alinhadas ao marketplace comunitário
const CATEGORIAS = [
  { id: "eletronicos", label: "📱 Eletrônicos & Tech" },
  { id: "moda", label: "👗 Moda & Acessórios" },
  { id: "alimentacao", label: "🍎 Alimentação & Orgânicos" },
  { id: "casa", label: "🏠 Casa & Decoração" },
  { id: "servicos-digitais", label: "💻 Serviços Digitais" },
  { id: "manutencao", label: "🔧 Manutenção & Reparos" },
  { id: "consultoria", label: "📊 Consultoria & Gestão" },
  { id: "artesanato", label: "🎨 Artesanato & Arte" },
  { id: "saude", label: "💚 Saúde & Bem-estar" },
  { id: "educacao", label: "📚 Educação & Cursos" },
];

type Step = "form" | "success";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function formatWhatsapp(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 3)
      e.name = "Nome deve ter ao menos 3 caracteres.";
    const digits = whatsapp.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 11)
      e.whatsapp = "WhatsApp inválido. Use DDD + número.";
    if (!categoryId) e.categoryId = "Selecione sua categoria principal.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError(null);
    try {
      // E-mail temporário gerado a partir do whatsapp para o onboarding simplificado
      const digits = whatsapp.replace(/\D/g, "");
      const tempEmail = `${digits}@onboarding.conectamarket.com`;

      await entrepreneurService.onboard({
        name: name.trim(),
        email: tempEmail,
        whatsapp: digits,
        categoryId,
      });

      setStep("success");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao realizar cadastro.";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-gradient-to-b from-primary/5 via-background to-background py-12 md:py-20">
        <div className="container max-w-lg mx-auto px-4">

          {step === "form" && (
            <div className="space-y-8">
              {/* Hero */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full border border-primary/20">
                  <Sparkles className="h-3.5 w-3.5" />
                  Inclusão Digital — Gratuito
                </div>
                <h1 className="font-sora text-3xl md:text-4xl font-bold leading-tight">
                  Comece a vender em{" "}
                  <span className="text-primary">3 campos</span>
                </h1>
                <p className="text-muted-foreground text-base max-w-sm mx-auto">
                  Sem burocracia. Preencha abaixo e sua loja estará pronta em instantes.
                </p>
              </div>

              {/* Form Card */}
              <div className="bg-card border border-border rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
                <form onSubmit={handleSubmit} noValidate className="space-y-5">

                  {/* API error banner */}
                  {apiError && (
                    <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 text-sm">
                      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>{apiError}</span>
                    </div>
                  )}

                  {/* Nome */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-semibold flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      Seu nome completo
                    </Label>
                    <Input
                      id="name"
                      placeholder="Ex: Maria da Silva"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`h-12 text-base ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      autoComplete="name"
                      disabled={loading}
                    />
                    {errors.name && (
                      <p className="text-destructive text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* WhatsApp */}
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp" className="font-semibold flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-primary" />
                      WhatsApp com DDD
                    </Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      placeholder="(11) 99999-8888"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(formatWhatsapp(e.target.value))}
                      className={`h-12 text-base ${errors.whatsapp ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      autoComplete="tel"
                      disabled={loading}
                    />
                    {errors.whatsapp && (
                      <p className="text-destructive text-xs mt-1">{errors.whatsapp}</p>
                    )}
                  </div>

                  {/* Categoria */}
                  <div className="space-y-2">
                    <Label htmlFor="categoria" className="font-semibold flex items-center gap-2">
                      <Tag className="h-4 w-4 text-primary" />
                      O que você vai vender?
                    </Label>
                    <Select
                      value={categoryId}
                      onValueChange={setCategoryId}
                      disabled={loading}
                    >
                      <SelectTrigger
                        id="categoria"
                        className={`h-12 text-base ${errors.categoryId ? "border-destructive" : ""}`}
                      >
                        <SelectValue placeholder="Escolha sua categoria principal" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIAS.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.categoryId && (
                      <p className="text-destructive text-xs mt-1">{errors.categoryId}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-14 text-base font-bold mt-2 group"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Criando sua loja…
                      </>
                    ) : (
                      <>
                        Quero vender agora
                        <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </form>

                <p className="text-xs text-center text-muted-foreground">
                  Ao cadastrar, você concorda com os{" "}
                  <a href="/termos" className="underline hover:text-primary">
                    Termos de Uso
                  </a>{" "}
                  da plataforma.
                </p>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">✅ 100% gratuito</span>
                <span className="flex items-center gap-1">✅ Sem CNPJ</span>
                <span className="flex items-center gap-1">✅ Suporte via WhatsApp</span>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="text-center space-y-6 py-12">
              <div className="mx-auto w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <div className="space-y-2">
                <h2 className="font-sora text-3xl font-bold">
                  Bem-vindo(a), {name.split(" ")[0]}! 🎉
                </h2>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Sua loja foi criada com sucesso. Nossa equipe entrará em contato pelo
                  WhatsApp informado para ajudá-lo(a) nos primeiros passos.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button
                  size="lg"
                  onClick={() => router.push("/painel")}
                  className="font-bold"
                >
                  Ir para o Painel
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push("/catalogo")}
                >
                  Ver o Marketplace
                </Button>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}

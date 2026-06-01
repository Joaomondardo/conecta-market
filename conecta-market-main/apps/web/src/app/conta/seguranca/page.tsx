"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Shield, Key, Smartphone, Laptop, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

const initialSessions: ActiveSession[] = [
  {
    id: "1",
    device: "Windows PC",
    browser: "Google Chrome",
    location: "Criciúma, SC, Brasil",
    ip: "191.185.32.10",
    lastActive: "Ativo agora",
    isCurrent: true,
  },
  {
    id: "2",
    device: "iPhone 13 Pro",
    browser: "Safari",
    location: "Criciúma, SC, Brasil",
    ip: "177.85.122.90",
    lastActive: "Há 2 horas",
    isCurrent: false,
  },
  {
    id: "3",
    device: "iPad Air",
    browser: "Safari",
    location: "Florianópolis, SC, Brasil",
    ip: "186.200.43.12",
    lastActive: "Há 3 dias",
    isCurrent: false,
  },
];

export default function SegurancaPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const [tfaEnabled, setTfaEnabled] = useState(false);
  const [sessions, setSessions] = useState<ActiveSession[]>(initialSessions);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!isAuthenticated) {
    return null;
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("A nova senha e a confirmação não coincidem.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("A nova senha deve ter no mínimo 6 caracteres.");
      return;
    }

    toast.success("Senha alterada com sucesso!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleTerminateSession = (id: string) => {
    setSessions(sessions.filter((session) => session.id !== id));
    toast.success("Sessão encerrada com sucesso.");
  };

  const handleTfaToggle = (checked: boolean) => {
    setTfaEnabled(checked);
    if (checked) {
      toast.success("Autenticação em dois fatores ativada!");
    } else {
      toast.success("Autenticação em dois fatores desativada.");
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-background py-12">
        <div className="container max-w-4xl space-y-8">
          {/* Header Title */}
          <div className="border-b pb-6 space-y-1">
            <h1 className="font-sora text-3xl font-extrabold tracking-tight">
              Segurança da Conta
            </h1>
            <p className="text-muted-foreground">
              Gerencie suas credenciais, sessões ativas e proteção adicional.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* 2FA Toggle Card */}
            <Card className="hover:border-primary/20 transition-colors">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="font-sora text-xl flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Autenticação em Dois Fatores (2FA)
                  </CardTitle>
                  <CardDescription>
                    Adicione uma camada extra de proteção à sua conta Conecta Market.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={tfaEnabled}
                    onCheckedChange={handleTfaToggle}
                    id="tfa-switch"
                  />
                  <Label htmlFor="tfa-switch" className="cursor-pointer font-semibold text-sm">
                    {tfaEnabled ? "Ativado" : "Desativado"}
                  </Label>
                </div>
              </CardHeader>
            </Card>

            {/* Change Password Card */}
            <Card>
              <CardHeader>
                <CardTitle className="font-sora text-xl flex items-center gap-2">
                  <Key className="h-5 w-5 text-primary" />
                  Alterar Senha
                </CardTitle>
                <CardDescription>
                  Recomendamos usar uma senha forte que você não utilize em outros sites.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handlePasswordChange}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Senha Atual</Label>
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nova Senha</Label>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Repita a nova senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-6 flex justify-end">
                  <Button type="submit" className="font-semibold">Atualizar Senha</Button>
                </CardFooter>
              </form>
            </Card>

            {/* Active Sessions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="font-sora text-xl flex items-center gap-2">
                  <Laptop className="h-5 w-5 text-primary" />
                  Dispositivos Conectados
                </CardTitle>
                <CardDescription>
                  Sessões ativas que acessaram sua conta recentemente.
                </CardDescription>
              </CardHeader>
              <CardContent className="divide-y">
                {sessions.map((session) => (
                  <div key={session.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0">
                    <div className="flex gap-3 items-start">
                      <div className="p-2 bg-muted rounded-lg mt-0.5">
                        {session.device.includes("iPhone") || session.device.includes("iPad") ? (
                          <Smartphone className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Laptop className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{session.device} • {session.browser}</p>
                          {session.isCurrent && (
                            <span className="flex items-center gap-1 text-[11px] text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full font-bold">
                              <CheckCircle2 className="h-3 w-3" /> Atual
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{session.location} — IP: {session.ip}</p>
                        <p className="text-xs text-muted-foreground mt-1">{session.lastActive}</p>
                      </div>
                    </div>
                    {!session.isCurrent && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 border-destructive/20 hover:border-destructive self-start sm:self-center"
                        onClick={() => handleTerminateSession(session.id)}
                      >
                        Desconectar
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

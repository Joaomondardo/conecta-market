"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { MapPin, Plus, Trash2, Edit2, Check } from "lucide-react";

interface Address {
  id: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  isDefault: boolean;
}

const initialAddresses: Address[] = [
  {
    id: "1",
    cep: "88801-000",
    street: "Avenida Centenário",
    number: "1230",
    complement: "Apto 402",
    neighborhood: "Centro",
    city: "Criciúma",
    state: "SC",
    isDefault: true,
  },
  {
    id: "2",
    cep: "88805-320",
    street: "Rua Antônio de Lucca",
    number: "45",
    neighborhood: "Cristo Redentor",
    city: "Criciúma",
    state: "SC",
    isDefault: false,
  },
];

export default function EnderecosPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");

  if (!isAuthenticated) {
    return null;
  }

  const handleEdit = (address: Address) => {
    setEditingId(address.id);
    setCep(address.cep);
    setStreet(address.street);
    setNumber(address.number);
    setComplement(address.complement || "");
    setNeighborhood(address.neighborhood);
    setCity(address.city);
    setStateName(address.state);
    setShowForm(true);
  };

  const handleRemove = (id: string) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cep || !street || !number || !neighborhood || !city || !stateName) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (editingId) {
      // Update
      setAddresses(
        addresses.map((addr) =>
          addr.id === editingId
            ? {
                ...addr,
                cep,
                street,
                number,
                complement,
                neighborhood,
                city,
                state: stateName,
              }
            : addr
        )
      );
    } else {
      // Create new
      const newAddress: Address = {
        id: Math.random().toString(),
        cep,
        street,
        number,
        complement,
        neighborhood,
        city,
        state: stateName,
        isDefault: addresses.length === 0,
      };
      setAddresses([...addresses, newAddress]);
    }

    // Reset Form
    setShowForm(false);
    setEditingId(null);
    setCep("");
    setStreet("");
    setNumber("");
    setComplement("");
    setNeighborhood("");
    setCity("");
    setStateName("");
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-background py-12">
        <div className="container max-w-4xl space-y-8">
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
            <div className="space-y-1">
              <h1 className="font-sora text-3xl font-extrabold tracking-tight">
                Meus Endereços
              </h1>
              <p className="text-muted-foreground">
                Gerencie seus endereços para entrega e faturamento.
              </p>
            </div>
            {!showForm && (
              <Button onClick={() => setShowForm(true)} className="font-semibold gap-2">
                <Plus className="h-4 w-4" /> Adicionar Endereço
              </Button>
            )}
          </div>

          {/* Form */}
          {showForm && (
            <Card className="border-2 border-primary/10">
              <CardHeader>
                <CardTitle className="font-sora text-xl">
                  {editingId ? "Editar Endereço" : "Novo Endereço"}
                </CardTitle>
                <CardDescription>
                  Insira as informações de entrega abaixo.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSave}>
                <CardContent className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="cep">CEP *</Label>
                    <Input
                      id="cep"
                      placeholder="88800-000"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      required
                    />
                  </div>
                  <div className="md:col-span-4 space-y-2">
                    <Label htmlFor="street">Rua *</Label>
                    <Input
                      id="street"
                      placeholder="Nome da rua ou avenida"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      required
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="number">Número *</Label>
                    <Input
                      id="number"
                      placeholder="123"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div className="md:col-span-4 space-y-2">
                    <Label htmlFor="complement">Complemento</Label>
                    <Input
                      id="complement"
                      placeholder="Apto, bloco, sala..."
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="neighborhood">Bairro *</Label>
                    <Input
                      id="neighborhood"
                      placeholder="Bairro"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      required
                    />
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <Label htmlFor="city">Cidade *</Label>
                    <Input
                      id="city"
                      placeholder="Cidade"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="md:col-span-1 space-y-2">
                    <Label htmlFor="state">Estado *</Label>
                    <Input
                      id="state"
                      placeholder="SC"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      required
                      maxLength={2}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-3 border-t pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar Endereço</Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {/* Address List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <Card
                key={address.id}
                className={`flex flex-col justify-between transition-all border-2 ${
                  address.isDefault ? "border-primary" : "border-border"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <CardTitle className="font-sora text-lg font-bold">
                        Entrega
                      </CardTitle>
                    </div>
                    {address.isDefault && (
                      <Badge className="bg-primary hover:bg-primary text-xs">Padrão</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="text-sm space-y-1 text-muted-foreground flex-1">
                  <p className="font-medium text-foreground">
                    {address.street}, {address.number}
                  </p>
                  {address.complement && <p>{address.complement}</p>}
                  <p>
                    {address.neighborhood} — {address.city}/{address.state}
                  </p>
                  <p>CEP: {address.cep}</p>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between gap-2">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(address)}
                      title="Editar"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemove(address.id)}
                      className="text-destructive hover:bg-destructive/10"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {!address.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                      className="text-xs gap-1"
                    >
                      <Check className="h-3.5 w-3.5" /> Definir Padrão
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          {addresses.length === 0 && !showForm && (
            <div className="text-center py-16 border rounded-2xl border-dashed space-y-4">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
              <p className="text-muted-foreground text-lg">Nenhum endereço cadastrado.</p>
              <Button onClick={() => setShowForm(true)}>Adicionar seu primeiro endereço</Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

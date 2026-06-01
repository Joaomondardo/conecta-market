import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Star,
  Package,
  Briefcase,
  Plus,
  Zap,
  Clock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type ItemType = "PRODUCT" | "SERVICE";

export interface MarketplaceCardProps {
  id: string;
  name: string;
  store: string;
  price: number;
  priceB2B?: number;
  rating: number;
  image: string;
  type: ItemType;
}

// ── Visual config por tipo ───────────────────────────────────────────────────

const TYPE_CONFIG = {
  PRODUCT: {
    label: "Produto",
    Icon: Package,
    badgeClass:
      "bg-primary/10 text-primary border-primary/20",
    accentClass: "border-t-primary/30",
    priceLabel: "Varejo",
    ctaLabel: "Comprar",
    CtaIcon: ShoppingCart,
    ctaVariant: "default" as const,
    cardAccent: "hover:border-primary/40",
  },
  SERVICE: {
    label: "Serviço",
    Icon: Briefcase,
    badgeClass:
      "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-300/30",
    accentClass: "border-t-violet-400/30",
    priceLabel: "A partir de",
    ctaLabel: "Contratar",
    CtaIcon: Plus,
    ctaVariant: "secondary" as const,
    cardAccent: "hover:border-violet-400/40",
  },
} as const;

// ── Component ────────────────────────────────────────────────────────────────

export function MarketplaceCard({
  id,
  name,
  store,
  price,
  priceB2B,
  rating,
  image,
  type,
}: MarketplaceCardProps) {
  const cfg = TYPE_CONFIG[type];
  const { Icon, CtaIcon } = cfg;

  const formatBRL = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(v);

  return (
    <Card
      className={`group overflow-hidden flex flex-col h-full transition-all duration-300
        border-border/60 bg-card shadow-sm hover:shadow-xl ${cfg.cardAccent}
        hover:-translate-y-0.5`}
    >
      {/* Thumbnail */}
      <Link
        href={`/produto/${id}`}
        className="block relative aspect-square overflow-hidden bg-muted"
        aria-label={`Ver ${name}`}
      >
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Type badge — top left */}
        <div className="absolute top-2 left-2">
          <Badge
            className={`flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold border backdrop-blur-sm ${cfg.badgeClass}`}
          >
            <Icon className="h-3 w-3 shrink-0" />
            {cfg.label}
          </Badge>
        </div>

        {/* Rating badge — top right */}
        <Badge className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-background/90 text-foreground border-0 backdrop-blur-sm text-[11px] font-semibold shadow-sm">
          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
          {rating.toFixed(1)}
        </Badge>

        {/* Service-specific: "Entrega rápida" ribbon */}
        {type === "SERVICE" && (
          <div className="absolute bottom-0 left-0 right-0 bg-violet-600/80 backdrop-blur-sm py-1 px-3 flex items-center gap-1.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Zap className="h-3 w-3 text-white" />
            <span className="text-white text-[10px] font-semibold uppercase tracking-wider">
              Resposta em até 24h
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <CardContent className="p-4 flex flex-col flex-1">
        <div className="text-[10px] text-muted-foreground mb-1 font-semibold truncate uppercase tracking-widest">
          {store}
        </div>
        <Link
          href={`/produto/${id}`}
          className="font-sora font-semibold text-sm leading-tight hover:text-primary transition-colors line-clamp-2 mb-4 h-10"
        >
          {name}
        </Link>

        {/* Price row */}
        <div className={`mt-auto pt-3 border-t ${cfg.accentClass}`}>
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                {cfg.priceLabel}
              </div>
              <div className="font-sora font-bold text-lg text-primary leading-none">
                {formatBRL(price)}
              </div>
            </div>

            {priceB2B && type === "PRODUCT" && (
              <div className="text-right">
                <div className="text-[9px] text-muted-foreground font-bold uppercase bg-muted/70 px-1.5 py-0.5 rounded tracking-tight">
                  Atacado
                </div>
                <div className="font-sora font-semibold text-sm text-foreground leading-tight mt-0.5">
                  {formatBRL(priceB2B)}
                </div>
              </div>
            )}

            {type === "SERVICE" && (
              <div className="flex items-center gap-1 text-muted-foreground text-[10px]">
                <Clock className="h-3 w-3" />
                <span>Sob consulta</span>
              </div>
            )}
          </div>

          <Link href={`/produto/${id}`} className="w-full">
            <Button
              className="w-full group/btn relative overflow-hidden font-semibold"
              size="sm"
              variant={cfg.ctaVariant}
            >
              <CtaIcon className="h-4 w-4 mr-2 transition-transform group-hover/btn:scale-110" />
              {cfg.ctaLabel}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

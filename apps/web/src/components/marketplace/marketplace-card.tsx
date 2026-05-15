import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Package, Briefcase, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface MarketplaceCardProps {
  id: string;
  name: string;
  store: string;
  price: number;
  priceB2B?: number;
  rating: number;
  image: string;
  type: 'PRODUCT' | 'SERVICE';
}

export function MarketplaceCard({ id, name, store, price, priceB2B, rating, image, type }: MarketplaceCardProps) {
  return (
    <Card className="group overflow-hidden flex flex-col h-full hover:shadow-lg transition-all border-muted/60 bg-card">
      <Link href={`/produto/${id}`} className="block relative aspect-square overflow-hidden bg-muted">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform group-hover:scale-105 duration-500"
        />
        <div className="absolute top-2 left-2 flex gap-1">
          <Badge className="bg-background/90 text-foreground backdrop-blur-sm border-0 font-semibold shadow-sm">
            {type === 'PRODUCT' ? (
              <><Package className="h-3 w-3 mr-1 text-primary" /> Produto</>
            ) : (
              <><Briefcase className="h-3 w-3 mr-1 text-secondary" /> Serviço</>
            )}
          </Badge>
        </div>
        <Badge className="absolute top-2 right-2 bg-background/90 text-foreground backdrop-blur-sm border-0 font-semibold shadow-sm">
          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
          {rating.toFixed(1)}
        </Badge>
      </Link>
      
      <CardContent className="p-4 flex flex-col flex-1">
        <div className="text-xs text-muted-foreground mb-1 font-medium truncate uppercase tracking-wider">{store}</div>
        <Link href={`/produto/${id}`} className="font-sora font-semibold text-sm leading-tight hover:text-primary transition-colors line-clamp-2 mb-4 h-10">
          {name}
        </Link>
        
        <div className="mt-auto pt-2 border-t border-muted/40">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                {type === 'PRODUCT' ? 'Varejo' : 'Preço Base'}
              </div>
              <div className="font-sora font-bold text-lg text-primary">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)}
              </div>
            </div>
            
            {priceB2B && (
              <div className="text-right">
                <div className="text-[9px] text-muted-foreground font-bold uppercase bg-muted/60 px-1.5 py-0.5 rounded">Atacado</div>
                <div className="font-sora font-semibold text-sm text-foreground">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(priceB2B)}
                </div>
              </div>
            )}
          </div>
          
          <Button className="w-full mt-4 group/btn relative overflow-hidden" size="sm" variant={type === 'PRODUCT' ? 'default' : 'secondary'}>
            <span className="relative z-10 flex items-center">
              {type === 'PRODUCT' ? (
                <><ShoppingCart className="h-4 w-4 mr-2" /> Comprar</>
              ) : (
                <><Plus className="h-4 w-4 mr-2" /> Contratar</>
              )}
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

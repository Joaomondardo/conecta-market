import Link from "next/link";
import { PackageOpen, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <PackageOpen className="h-6 w-6 text-primary" />
              <span className="font-sora font-bold text-xl">Conecta<span className="text-primary">Market</span></span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O marketplace híbrido voltado para a inclusão digital e social. Conectando pequenos empreendedores a grandes oportunidades.
            </p>
          </div>

          <div>
            <h3 className="font-sora font-semibold text-foreground mb-4">Para Compradores</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/catalogo" className="hover:text-primary transition-colors">Como comprar</Link></li>
              <li><Link href="/pagamentos" className="hover:text-primary transition-colors">Métodos de pagamento</Link></li>
              <li><Link href="/frete" className="hover:text-primary transition-colors">Frete e entrega</Link></li>
              <li><Link href="/devolucoes" className="hover:text-primary transition-colors">Trocas e devoluções</Link></li>
              <li><Link href="/ajuda" className="hover:text-primary transition-colors">Central de ajuda</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-sora font-semibold text-foreground mb-4">Para Vendedores</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/vender" className="hover:text-primary transition-colors">Como vender na plataforma</Link></li>
              <li><Link href="/planos" className="hover:text-primary transition-colors">Planos e taxas</Link></li>
              <li><Link href="/painel" className="hover:text-primary transition-colors">Painel do vendedor</Link></li>
              <li><Link href="/recursos" className="hover:text-primary transition-colors">Recursos de capacitação</Link></li>
              <li><Link href="/b2b" className="hover:text-primary transition-colors">Vendas atacado (B2B)</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-sora font-semibold text-foreground mb-4">Contato</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>Rua da Inclusão, 123 - Centro<br />São Paulo, SP - 01234-567</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>(11) 4000-0000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>contato@conectamarket.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Conecta Market. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <Link href="/privacidade" className="hover:text-foreground">Política de Privacidade</Link>
            <Link href="/termos" className="hover:text-foreground">Termos de Uso</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

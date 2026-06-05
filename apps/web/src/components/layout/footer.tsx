import Link from "next/link";
import { PackageOpen, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-16">
        {/* Logo + Descrição */}
        <div className="mb-12">
          <Link href="/" className="flex items-center gap-2 mb-4 w-fit">
            <PackageOpen className="h-6 w-6 text-teal-600" />
            <span className="text-2xl font-bold text-teal-600">
              Conecta<span className="text-gray-800">Market</span>
            </span>
          </Link>
          <p className="text-gray-600 text-sm leading-relaxed max-w-md">
            O marketplace híbrido voltado para a inclusão digital e social.
            Conectando pequenos empreendedores a grandes oportunidades.
          </p>
        </div>

        {/* Grid de 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Card: Para Compradores */}
          <div className="border border-slate-200 bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-teal-600 mb-4">Para Compradores</h3>
            <nav className="space-y-2">
              <Link
                href="/como-comprar"
                className="block text-gray-700 text-sm hover:text-teal-600 hover:underline transition-colors"
              >
                Como comprar
              </Link>
              <Link
                href="/metodos-pagamento"
                className="block text-gray-700 text-sm hover:text-teal-600 hover:underline transition-colors"
              >
                Métodos de pagamento
              </Link>
              <Link
                href="/frete-entrega"
                className="block text-gray-700 text-sm hover:text-teal-600 hover:underline transition-colors"
              >
                Frete e entrega
              </Link>
              <Link
                href="/trocas-devolucoes"
                className="block text-gray-700 text-sm hover:text-teal-600 hover:underline transition-colors"
              >
                Trocas e devoluções
              </Link>
              <Link
                href="/central-ajuda"
                className="block text-gray-700 text-sm hover:text-teal-600 hover:underline transition-colors"
              >
                Central de ajuda
              </Link>
            </nav>
          </div>

          {/* Card: Para Vendedores */}
          <div className="border border-slate-200 bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-teal-600 mb-4">Para Vendedores</h3>
            <nav className="space-y-2">
              <Link
                href="/como-vender"
                className="block text-gray-700 text-sm hover:text-teal-600 hover:underline transition-colors"
              >
                Como vender na plataforma
              </Link>
              <Link
                href="/planos-taxas"
                className="block text-gray-700 text-sm hover:text-teal-600 hover:underline transition-colors"
              >
                Planos e taxas
              </Link>
              <Link
                href="/painel/dashboard"
                className="block text-gray-700 text-sm hover:text-teal-600 hover:underline transition-colors"
              >
                Painel do vendedor
              </Link>
              <Link
                href="/capacitacao"
                className="block text-gray-700 text-sm hover:text-teal-600 hover:underline transition-colors"
              >
                Recursos de capacitação
              </Link>
              <Link
                href="/vendas-atacado"
                className="block text-gray-700 text-sm hover:text-teal-600 hover:underline transition-colors"
              >
                Vendas atacado (B2B)
              </Link>
            </nav>
          </div>

          {/* Card: Contato */}
          <div className="border border-slate-200 bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-teal-600 mb-4">Contato</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <p>Rua da Inclusão, 123 - Centro</p>
                  <p>São Paulo, SP - 01234-567</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-teal-600 shrink-0" />
                <p>(11) 4000-0000</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-teal-600 shrink-0" />
                <p>contato@conectamarket.com</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-slate-900 text-white text-xs py-6 px-4 md:px-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-300">
            © {new Date().getFullYear()} Conecta Market. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/politica-privacidade"
              className="text-slate-300 hover:text-teal-400 transition-colors"
            >
              Política de Privacidade
            </Link>
            <span className="text-slate-600">·</span>
            <Link
              href="/termos-uso"
              className="text-slate-300 hover:text-teal-400 transition-colors"
            >
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

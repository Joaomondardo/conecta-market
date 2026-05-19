import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserRole, StoreType, ProductStatus, ProductType, ReviewStatus, UserStatus, StoreStatus } from '@prisma/client';

async function bootstrap() {
  const prisma = new PrismaService();
  await prisma.$connect();

  console.log('🌱 Iniciando a população de dados (Seed)...');

  try {
    // 1. Limpeza do banco de dados para evitar conflitos na demonstração
    await prisma.cleanDatabase();
    console.log('🧹 Banco de dados limpo com sucesso.');

    // Senha padrão para facilitar o login em massa na demonstração
    const defaultPassword = await bcrypt.hash('senha123', 12);

    // ─── 1. USUÁRIOS E PERFIS (RBAC) ──────────────────────────────────────────

    // Administrador
    const admin = await prisma.user.create({
      data: {
        name: 'Administrador Central',
        email: 'admin@conecta.com',
        password: defaultPassword,
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        emailVerified: true,
      },
    });
    console.log('✅ [1/4] Administrador criado.');

    // Clientes + 2. CARTEIRAS E CASHBACK (Fase 2)
    const customers = [];
    const initialBalances = [15.50, 50.00, 0];
    
    for (let i = 1; i <= 3; i++) {
      const customer = await prisma.user.create({
        data: {
          name: `Cliente Fictício ${i}`,
          email: `cliente${i}@conecta.com`,
          password: defaultPassword,
          role: UserRole.CLIENTE,
          status: UserStatus.ACTIVE,
          emailVerified: true,
          wallet: {
            create: {
              balance: initialBalances[i - 1], // Injeta saldos variados
            }
          }
        },
      });
      customers.push(customer);
    }
    console.log('✅ [2/4] Clientes criados e suas Carteiras abastecidas.');

    // ─── 3. LOJAS E CATÁLOGO (Fase 3) ─────────────────────────────────────────

    // Lojista 1: Horta
    const seller1 = await prisma.user.create({
      data: {
        name: 'João da Horta',
        email: 'horta@conecta.com',
        password: defaultPassword,
        role: UserRole.LOJISTA,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        store: {
          create: {
            name: 'Horta Orgânica Comunitária',
            slug: 'horta-organica',
            description: 'Produtos frescos, cultivados de forma sustentável pela comunidade.',
            type: StoreType.B2C,
            status: StoreStatus.ACTIVE,
            approvedAt: new Date(),
            approvedById: admin.id,
          },
        },
      },
      include: { store: true },
    });

    // Lojista 2: Artesanato
    const seller2 = await prisma.user.create({
      data: {
        name: 'Maria Artesã',
        email: 'artes@conecta.com',
        password: defaultPassword,
        role: UserRole.LOJISTA,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        store: {
          create: {
            name: 'Artesanatos da Vila',
            slug: 'artesanatos-vila',
            description: 'Feito à mão, com muito amor e tradição.',
            type: StoreType.HYBRID, // Trabalha com B2C e B2B
            status: StoreStatus.ACTIVE,
            approvedAt: new Date(),
            approvedById: admin.id,
          },
        },
      },
      include: { store: true },
    });

    // Categorias bases
    const catAlimentos = await prisma.category.create({ data: { name: 'Alimentação', slug: 'alimentacao', isActive: true } });
    const catServicos = await prisma.category.create({ data: { name: 'Serviços', slug: 'servicos', isActive: true } });

    // Produtos e Serviços - Loja 1 (Horta)
    await prisma.product.create({
      data: {
        storeId: seller1.store!.id,
        categoryId: catAlimentos.id,
        name: 'Alface Crespa Orgânica',
        slug: 'alface-crespa-organica',
        description: 'Pé de alface crespa colhido no dia, 100% livre de agrotóxicos.',
        price: 3.50,
        stock: 50,
        type: ProductType.PRODUCT, // Físico
        status: ProductStatus.ACTIVE,
        images: ['https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?q=80&w=500'],
      },
    });

    await prisma.product.create({
      data: {
        storeId: seller1.store!.id,
        categoryId: catServicos.id,
        name: 'Consultoria de Paisagismo',
        slug: 'consultoria-paisagismo',
        description: 'Ajudamos a projetar e montar a sua própria horta orgânica em casa ou apartamento.',
        price: 150.00,
        stock: 999,
        type: ProductType.SERVICE, // Serviço
        status: ProductStatus.ACTIVE,
        images: ['https://images.unsplash.com/photo-1585320806052-a5e2363f82de?q=80&w=500'],
      },
    });

    // Produtos e Serviços - Loja 2 (Artesanato)
    await prisma.product.create({
      data: {
        storeId: seller2.store!.id,
        categoryId: catAlimentos.id,
        name: 'Mel Puro de Abelha Jataí',
        slug: 'mel-puro-jatai',
        description: 'Pote de 500g de mel puro, produzido artesanalmente e super saudável.',
        price: 35.00,
        priceB2B: 28.00, // Tem preço de atacado
        stock: 15,
        type: ProductType.PRODUCT,
        status: ProductStatus.ACTIVE,
        images: ['https://images.unsplash.com/photo-1587049352847-4d4b1263d040?q=80&w=500'],
      },
    });

    await prisma.product.create({
      data: {
        storeId: seller2.store!.id,
        categoryId: catServicos.id,
        name: 'Oficina de Costura Criativa',
        slug: 'oficina-costura',
        description: 'Aula presencial para aprender o básico da costura usando retalhos sustentáveis.',
        price: 80.00,
        stock: 999,
        type: ProductType.SERVICE,
        status: ProductStatus.ACTIVE,
        images: ['https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=500'],
      },
    });
    console.log('✅ [3/4] Lojas, Produtos físicos e Serviços cadastrados com sucesso.');

    // ─── 4. AVALIAÇÕES E SOCIAL PROOF (Fase 3) ────────────────────────────────

    const reviews = [
      { userId: customers[0].id, storeId: seller1.store!.id, rating: 5, comment: 'Excelente qualidade, alface super fresca!', status: ReviewStatus.APPROVED },
      { userId: customers[1].id, storeId: seller1.store!.id, rating: 4, comment: 'A consultoria foi ótima, super didática.', status: ReviewStatus.APPROVED },
      { userId: customers[2].id, storeId: seller2.store!.id, rating: 5, comment: 'O mel é maravilhoso, comprarei sempre!', status: ReviewStatus.APPROVED },
      { userId: customers[0].id, storeId: seller2.store!.id, rating: 5, comment: 'Professora incrível, adorei a oficina de costura.', status: ReviewStatus.APPROVED },
    ];

    for (const rev of reviews) {
      await prisma.review.create({ data: rev });
    }

    // Calculando a média automaticamente (similar à lógica de negócio no serviço)
    for (const storeId of [seller1.store!.id, seller2.store!.id]) {
      const agg = await prisma.review.aggregate({
        where: { storeId, status: ReviewStatus.APPROVED },
        _avg: { rating: true },
        _count: { id: true }
      });
      await prisma.store.update({
        where: { id: storeId },
        data: {
          rating: agg._avg.rating ?? 0,
          totalReviews: agg._count.id
        }
      });
    }
    console.log('✅ [4/4] Avaliações sociais geradas e médias de Lojas recalculadas.');

    // ─── FIM DA EXECUÇÃO ──────────────────────────────────────────────────────
    console.log('\n🎉 Seed finalizado! O ambiente de apresentação está pronto.');
    console.log('===============================================================');
    console.log('Credenciais para login na Apresentação (Senha Padrão: senha123)');
    console.log(' - Admin:   admin@conecta.com');
    console.log(' - Lojista: horta@conecta.com    | Artesão: artes@conecta.com');
    console.log(' - Cliente: cliente1@conecta.com (Carteira: R$ 15,50)');
    console.log(' - Cliente: cliente2@conecta.com (Carteira: R$ 50,00)');
    console.log('===============================================================\n');

  } catch (error) {
    console.error('❌ Ocorreu um erro durante a execução do Seed:', error);
    process.exit(1);
  } finally {
    // Fundamental para liberar as conexões com o DB
    await prisma.$disconnect();
  }
}

bootstrap();

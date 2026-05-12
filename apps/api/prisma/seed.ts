import { Module } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserRole, StoreType, ProductStatus } from '@prisma/client';

async function bootstrap() {
  const prisma = new PrismaService();
  await prisma.$connect();

  console.log('🌱 Iniciando seed...');

  // 1. Limpar banco (cuidado: apaga tudo)
  await prisma.cleanDatabase();
  console.log('🧹 Banco limpo.');

  // 2. Admin User
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin Master',
      email: 'admin@conecta.com',
      password: adminPassword,
      role: UserRole.ADMIN,
      status: 'ACTIVE',
      emailVerified: true,
    },
  });

  // 3. Seller User & Store
  const sellerPassword = await bcrypt.hash('seller123', 12);
  const seller = await prisma.user.create({
    data: {
      name: 'Vendedor Exemplo',
      email: 'vendedor@conecta.com',
      password: sellerPassword,
      role: UserRole.SELLER,
      status: 'ACTIVE',
      emailVerified: true,
      store: {
        create: {
          name: 'Loja Exemplo',
          slug: 'loja-exemplo',
          description: 'A melhor loja de demonstração',
          type: StoreType.HYBRID,
          status: 'ACTIVE',
          approvedAt: new Date(),
          approvedById: admin.id,
        },
      },
    },
    include: { store: true },
  });

  // 4. Customer User
  const customerPassword = await bcrypt.hash('cliente123', 12);
  const customer = await prisma.user.create({
    data: {
      name: 'Cliente Exemplo',
      email: 'cliente@conecta.com',
      password: customerPassword,
      role: UserRole.CUSTOMER,
      status: 'ACTIVE',
      emailVerified: true,
    },
  });

  // 5. Categories
  const catEletronicos = await prisma.category.create({
    data: { name: 'Eletrônicos', slug: 'eletronicos', isActive: true },
  });
  const catModa = await prisma.category.create({
    data: { name: 'Moda Sustentável', slug: 'moda-sustentavel', isActive: true },
  });

  // 6. Products
  await prisma.product.createMany({
    data: [
      {
        storeId: seller.store!.id,
        categoryId: catEletronicos.id,
        name: 'Smartphone Recondicionado',
        slug: 'smartphone-recondicionado',
        description: 'Smartphone excelente estado.',
        price: 899.90,
        priceB2B: 750.00,
        stock: 50,
        status: ProductStatus.ACTIVE,
        isFeatured: true,
        images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500'],
      },
      {
        storeId: seller.store!.id,
        categoryId: catModa.id,
        name: 'Camiseta Algodão Orgânico',
        slug: 'camiseta-algodao-organico',
        description: 'Camiseta 100% orgânica.',
        price: 59.90,
        priceB2B: 35.00,
        stock: 100,
        status: ProductStatus.ACTIVE,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=500'],
      },
    ],
  });

  console.log('✅ Seeds concluídos com sucesso!');
  console.log('Credenciais de teste:');
  console.log('Admin: admin@conecta.com / admin123');
  console.log('Vendedor: vendedor@conecta.com / seller123');
  console.log('Cliente: cliente@conecta.com / cliente123');

  await prisma.$disconnect();
}

bootstrap().catch((e) => {
  console.error(e);
  process.exit(1);
});

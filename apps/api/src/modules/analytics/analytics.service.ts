import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAdminDashboard() {
    const [
      totalUsers,
      totalStores,
      totalOrders,
      totalRevenueData,
      recentOrders,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.store.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        where: { status: { in: ['CONFIRMED', 'DELIVERED'] } },
        _sum: { total: true },
      }),
      this.prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { name: true } },
          store: { select: { name: true } },
        },
      }),
    ]);

    return {
      overview: {
        totalUsers,
        totalStores,
        totalOrders,
        totalRevenue: totalRevenueData._sum.total ?? 0,
      },
      recentOrders,
    };
  }

  async getSellerDashboard(storeId: string) {
    const [
      totalProducts,
      totalOrders,
      totalRevenueData,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      this.prisma.product.count({ where: { storeId } }),
      this.prisma.order.count({ where: { storeId } }),
      this.prisma.order.aggregate({
        where: { storeId, status: { in: ['CONFIRMED', 'DELIVERED'] } },
        _sum: { total: true },
      }),
      this.prisma.order.findMany({
        where: { storeId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { customer: { select: { name: true } } },
      }),
      this.prisma.product.findMany({
        where: { storeId },
        take: 5,
        orderBy: { totalSales: 'desc' },
        select: { id: true, name: true, totalSales: true, price: true, stock: true },
      }),
    ]);

    return {
      overview: {
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenueData._sum.total ?? 0,
      },
      recentOrders,
      topProducts,
    };
  }

  async getSummary() {
    const roles = ['LOJISTA', 'EMPREENDEDOR'];
    
    const [
      totalCashback,
      totalGifts,
      ...roleResults
    ] = await this.prisma.$transaction([
      this.prisma.transaction.aggregate({
        where: { type: 'CREDIT' },
        _sum: { amount: true },
      }),
      this.prisma.campaign.aggregate({
        where: { type: 'GIFT' },
        _sum: { usageCount: true },
      }),
      ...roles.map((role) =>
        this.prisma.order.aggregate({
          where: {
            status: 'DELIVERED',
            customer: { role: role as any },
          },
          _sum: { total: true },
        }),
      ),
    ]);

    const volumeByRole = roles.reduce((acc: Record<string, number>, role, index) => {
      acc[role] = Number((roleResults[index] as any)._sum.total ?? 0);
      return acc;
    }, {});

    return {
      totalCashback: (totalCashback as any)._sum.amount ?? 0,
      totalGifts: (totalGifts as any)._sum.usageCount ?? 0,
      volumeByRole,
    };
  }
}



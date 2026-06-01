import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async add(userId: string, productId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Produto não encontrado');

    const existing = await this.prisma.favorite.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (existing) return { message: 'Produto já está nos favoritos' };

    return this.prisma.favorite.create({
      data: { userId, productId },
      include: { product: { select: { id: true, name: true, price: true, images: true, slug: true } } },
    });
  }

  async findAll(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [favorites, total] = await Promise.all([
      this.prisma.favorite.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          product: {
            select: {
              id: true, name: true, price: true, images: true, slug: true,
              store: { select: { name: true, slug: true } }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.favorite.count({ where: { userId } }),
    ]);
    return { data: favorites, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async remove(userId: string, productId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (!existing) throw new NotFoundException('Favorito não encontrado');

    await this.prisma.favorite.delete({
      where: { userId_productId: { userId, productId } },
    });
    return { message: 'Removido dos favoritos' };
  }
}

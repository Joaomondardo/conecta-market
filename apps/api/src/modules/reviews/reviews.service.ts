import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateReviewDto) {
    return this.prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: { userId, ...dto, status: 'APPROVED' },
        include: { user: { select: { id: true, name: true, avatar: true } } },
      });

      // Atualizar rating médio do produto/loja imediatamente
      if (dto.productId) {
        const result = await tx.review.aggregate({
          where: { productId: dto.productId, status: 'APPROVED' },
          _avg: { rating: true },
          _count: { id: true },
        });
        await tx.product.update({
          where: { id: dto.productId },
          data: {
            rating: result._avg.rating ?? 0,
            totalReviews: result._count.id,
          },
        });
      }

      if (dto.storeId) {
        const result = await tx.review.aggregate({
          where: { storeId: dto.storeId, status: 'APPROVED' },
          _avg: { rating: true },
          _count: { id: true },
        });
        await tx.store.update({
          where: { id: dto.storeId },
          data: {
            rating: result._avg.rating ?? 0,
            totalReviews: result._count.id,
          },
        });
      }

      return review;
    });
  }


  async findByProduct(productId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { productId, status: 'APPROVED' },
        skip,
        take: limit,
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({ where: { productId, status: 'APPROVED' } }),
    ]);
    return { data: reviews, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findByStore(storeId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { storeId, status: 'APPROVED' },
        skip,
        take: limit,
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({ where: { storeId, status: 'APPROVED' } }),
    ]);
    return { data: reviews, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async approve(id: string) {
    return this.prisma.review.update({ where: { id }, data: { status: 'APPROVED' } });
  }

  async reject(id: string) {
    return this.prisma.review.update({ where: { id }, data: { status: 'REJECTED' } });
  }

  private async updateProductRating(productId: string) {
    const result = await this.prisma.review.aggregate({
      where: { productId, status: 'APPROVED' },
      _avg: { rating: true },
      _count: { id: true },
    });
    await this.prisma.product.update({
      where: { id: productId },
      data: {
        rating: result._avg.rating ?? 0,
        totalReviews: result._count.id,
      },
    });
  }

  private async updateStoreRating(storeId: string) {
    const result = await this.prisma.review.aggregate({
      where: { storeId, status: 'APPROVED' },
      _avg: { rating: true },
      _count: { id: true },
    });
    await this.prisma.store.update({
      where: { id: storeId },
      data: {
        rating: result._avg.rating ?? 0,
        totalReviews: result._count.id,
      },
    });
  }
}

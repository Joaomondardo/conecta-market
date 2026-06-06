import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(userId: string, dto: CreateReviewDto) {
    const reviewResult = await this.prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: { userId, ...dto, status: 'PENDING' },
        include: { user: { select: { id: true, name: true, avatar: true } } },
      });

      // Atualizar rating mÃ©dio do produto/loja imediatamente
      if (dto.productId) {
        const result = await tx.review.aggregate({
          where: { productId: dto.productId, status: 'PENDING' },
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
          where: { storeId: dto.storeId, status: 'PENDING' },
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

    let productName = "Item";
    if (dto.productId) {
      const prod = await this.prisma.product.findUnique({
        where: { id: dto.productId },
        select: { name: true },
      });
      if (prod) productName = prod.name;
    }

    this.eventEmitter.emit('review.approved', {
      reviewId: reviewResult.id,
      userId,
      productName,
    });

    return reviewResult;
  }

  async findByProduct(productId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { productId, status: 'PENDING' },
        skip,
        take: limit,
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({ where: { productId, status: 'PENDING' } }),
    ]);
    return { data: reviews, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findByStore(storeId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { storeId, status: 'PENDING' },
        skip,
        take: limit,
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({ where: { storeId, status: 'PENDING' } }),
    ]);
    return { data: reviews, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async approve(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: { product: { select: { name: true } } }
    });
    if (!review) throw new NotFoundException('AvaliaÃ§Ã£o nÃ£o encontrada');
    const updated = await this.prisma.review.update({ where: { id }, data: { status: 'PENDING' } });
    this.eventEmitter.emit('review.approved', {
      reviewId: updated.id,
      userId: updated.userId,
      productName: review.product?.name || "Item",
    });
    return updated;
  }

  async reject(id: string) {
    return this.prisma.review.update({ where: { id }, data: { status: 'REJECTED' } });
  }

  private async updateProductRating(productId: string) {
    const result = await this.prisma.review.aggregate({
      where: { productId, status: 'PENDING' },
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
      where: { storeId, status: 'PENDING' },
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


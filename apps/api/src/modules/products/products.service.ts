import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductStatus, ProductType, Prisma } from '@prisma/client';

import { APP_CONSTANTS } from '../../common/constants/app.constants';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(storeId: string, dto: CreateProductDto) {
    const slug = dto.slug || this.generateSlug(dto.name);
    return this.prisma.product.create({
      data: { ...dto, storeId, slug },
      include: { category: true, store: { select: { id: true, name: true, slug: true } } },
    });
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    storeId?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
    status?: ProductStatus;
    type?: ProductType;
  }) {

    const { 
      page = APP_CONSTANTS.PAGINATION.DEFAULT_PAGE, 
      limit = APP_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE, 
      search, categoryId, storeId, minPrice, maxPrice, featured, status, type 
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      ...(status ? { status } : { status: ProductStatus.ACTIVE }),
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
      ...(categoryId && { categoryId }),
      ...(storeId && { storeId }),
      ...(type && { type }),
      ...(featured !== undefined && { isFeatured: featured }),

      ...(minPrice !== undefined || maxPrice !== undefined
        ? { price: { gte: minPrice, lte: maxPrice } }
        : {}),
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          store: { select: { id: true, name: true, slug: true, rating: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data: products, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(identifier: string) {
    const isId = identifier.match(/^[a-z0-9]{24,30}$/i) || !identifier.includes('-');
    
    const product = await this.prisma.product.findUnique({
      where: isId ? { id: identifier } : { slug: identifier },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        store: { select: { id: true, name: true, slug: true, rating: true, logo: true } },
        reviews: {
          where: { status: 'APPROVED' },
          include: { user: { select: { id: true, name: true, avatar: true } } },
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) throw new NotFoundException('Produto não encontrado');
    return product;
  }

  async update(id: string, storeId: string, dto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id, storeId },
      data: dto,
      include: { category: true },
    });
  }

  async remove(id: string, storeId: string) {
    await this.findOne(id);
    await this.prisma.product.update({
      where: { id, storeId },
      data: { status: ProductStatus.INACTIVE },
    });
    return { message: 'Produto desativado com sucesso' };
  }

  async getFeatured(limit = 8) {
    return this.prisma.product.findMany({
      where: { status: ProductStatus.ACTIVE, isFeatured: true },
      take: limit,
      include: { store: { select: { id: true, name: true, slug: true } } },
      orderBy: { totalSales: 'desc' },
    });
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      + '-' + Date.now();
  }
}

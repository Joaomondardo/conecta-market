import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoreStatus, Prisma } from '@prisma/client';
import { APP_CONSTANTS } from '../../common/constants/app.constants';

@Injectable()
export class StoresService {
  constructor(private readonly prisma: PrismaService) {}

  async create(ownerId: string, dto: CreateStoreDto) {
    const existing = await this.prisma.store.findUnique({ where: { ownerId } });
    if (existing) throw new ConflictException('Usuário já possui uma loja');

    const slug = dto.slug || this.generateSlug(dto.name);
    return this.prisma.store.create({
      data: { ...dto, ownerId, slug },
    });
  }

  async findAll(
    page = APP_CONSTANTS.PAGINATION.DEFAULT_PAGE, 
    limit = APP_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE, 
    status?: StoreStatus, 
    search?: string
  ) {
    const skip = (page - 1) * limit;
    const where: Prisma.StoreWhereInput = {
      ...(status ? { status } : { status: StoreStatus.ACTIVE }),
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
    };
    const [stores, total] = await Promise.all([
      this.prisma.store.findMany({
        where,
        skip,
        take: limit,
        include: { owner: { select: { id: true, name: true, email: true } } },
        orderBy: { rating: 'desc' },
      }),
      this.prisma.store.count({ where }),
    ]);
    return { data: stores, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findBySlug(slug: string) {
    const store = await this.prisma.store.findUnique({
      where: { slug },
      include: {
        owner: { select: { id: true, name: true } },
        products: {
          where: { status: 'ACTIVE' },
          take: 12,
          orderBy: { createdAt: 'desc' },
        },
        reviews: {
          where: { status: 'APPROVED' },
          include: { user: { select: { id: true, name: true, avatar: true } } },
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!store) throw new NotFoundException('Loja não encontrada');
    return store;
  }

  async findById(id: string) {
    const store = await this.prisma.store.findUnique({
      where: { id },
      include: { owner: { select: { id: true, name: true, email: true } } },
    });
    if (!store) throw new NotFoundException('Loja não encontrada');
    return store;
  }

  async findByOwner(ownerId: string) {
    return this.prisma.store.findUnique({
      where: { ownerId },
      include: { owner: { select: { id: true, name: true } } },
    });
  }

  async update(id: string, ownerId: string, dto: UpdateStoreDto) {
    return this.prisma.store.update({
      where: { id, ownerId },
      data: dto,
    });
  }

  async updateStatus(id: string, status: StoreStatus, adminId: string) {
    return this.prisma.store.update({
      where: { id },
      data: {
        status,
        approvedAt: status === StoreStatus.ACTIVE ? new Date() : undefined,
        approvedById: status === StoreStatus.ACTIVE ? adminId : undefined,
      },
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

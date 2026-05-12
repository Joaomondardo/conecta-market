import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(customerId: string, dto: CreateOrderDto) {
    // Buscar produtos e calcular valores
    const items = await Promise.all(
      dto.items.map(async (item) => {
        const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new NotFoundException(`Produto ${item.productId} não encontrado`);
        if (product.stock < item.quantity) throw new BadRequestException(`Estoque insuficiente para ${product.name}`);
        const price = item.isB2B && product.priceB2B ? Number(product.priceB2B) : Number(product.price);
        return {
          productId: item.productId,
          name: product.name,
          sku: product.sku,
          image: product.images?.[0],
          price,
          quantity: item.quantity,
          total: price * item.quantity,
          isB2B: item.isB2B ?? false,
        };
      }),
    );

    const subtotal = items.reduce((sum, i) => sum + i.total, 0);
    const discount = dto.discount ?? 0;
    const shipping = dto.shipping ?? 0;
    const tax = dto.tax ?? 0;
    const total = subtotal - discount + shipping + tax;

    const order = await this.prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          customerId,
          storeId: dto.storeId,
          addressId: dto.addressId,
          subtotal,
          discount,
          shipping,
          tax,
          total,
          couponCode: dto.couponCode,
          notes: dto.notes,
          items: { create: items },
        },
        include: { items: true, store: { select: { id: true, name: true } } },
      });

      // Atualizar estoque
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return created;
    });

    return order;
  }

  async findAll(userId: string, role: string, page = 1, limit = 20, status?: OrderStatus) {
    const skip = (page - 1) * limit;
    const where: Prisma.OrderWhereInput = {
      ...(role === 'CUSTOMER' ? { customerId: userId } : {}),
      ...(status && { status }),
    };

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          items: { include: { product: { select: { name: true, images: true } } } },
          store: { select: { id: true, name: true, slug: true } },
          payment: { select: { status: true, method: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { data: orders, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string, userId: string, role: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: { select: { id: true, name: true, images: true, slug: true } } } },
        customer: { select: { id: true, name: true, email: true, phone: true } },
        store: { select: { id: true, name: true, slug: true, logo: true } },
        address: true,
        payment: true,
        messages: {
          include: { sender: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!order) throw new NotFoundException('Pedido não encontrado');
    if (role === 'CUSTOMER' && order.customerId !== userId) throw new NotFoundException('Pedido não encontrado');

    return order;
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Pedido não encontrado');

    return this.prisma.order.update({
      where: { id },
      data: {
        status,
        ...(status === OrderStatus.DELIVERED && { deliveredAt: new Date() }),
        ...(status === OrderStatus.CANCELLED && { cancelledAt: new Date() }),
      },
    });
  }

  async cancel(id: string, userId: string, reason: string) {
    const order = await this.prisma.order.findUnique({ where: { id, customerId: userId } });
    if (!order) throw new NotFoundException('Pedido não encontrado');
    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      throw new BadRequestException('Pedido não pode ser cancelado neste status');
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status: OrderStatus.CANCELLED,
        cancelledAt: new Date(),
        cancelReason: reason,
      },
    });
  }
}

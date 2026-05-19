import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, Prisma, TransactionType } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';


@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

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
    const result = await this.prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id },
        data: {
          status,
          ...(status === OrderStatus.DELIVERED && { deliveredAt: new Date() }),
          ...(status === OrderStatus.CANCELLED && { cancelledAt: new Date() }),
        },
      });

      if (status === OrderStatus.DELIVERED) {
        await this.handleCashback(id, tx);
      }

      return updatedOrder;
    });

    if (status === OrderStatus.CONFIRMED) {
      this.eventEmitter.emit('order.confirmed', {
        orderId: result.id,
        userId: result.customerId,
        orderNumber: result.orderNumber,
        total: Number(result.total),
      });
    }

    return result;
  }

  private async handleCashback(orderId: string, tx: Prisma.TransactionClient) {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) return;

    // Buscar campanha de cashback ativa para a loja
    const now = new Date();
    const campaign = await tx.campaign.findFirst({
      where: {
        storeId: order.storeId,
        type: 'CASHBACK',
        status: 'ACTIVE',
        isActive: true,
        startsAt: { lte: now },
        endsAt: { gte: now },
      },
    });

    if (!campaign) return;

    let cashbackAmount = 0;
    if (campaign.discountType === 'PERCENTAGE') {
      cashbackAmount = Number(order.total) * (Number(campaign.discountValue) / 100);
    } else {
      cashbackAmount = Number(campaign.discountValue);
    }

    if (cashbackAmount <= 0) return;

    // Garantir que a wallet existe
    const wallet = await tx.wallet.upsert({
      where: { userId: order.customerId },
      update: { balance: { increment: cashbackAmount } },
      create: { userId: order.customerId, balance: cashbackAmount },
    });

    // Registrar transação
    await tx.transaction.create({
      data: {
        walletId: wallet.id,
        orderId: order.id,
        amount: cashbackAmount,
        type: TransactionType.CREDIT,
        description: `Cashback do pedido ${order.orderNumber}`,
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

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePaymentDto) {
    const order = await this.prisma.order.findUnique({ where: { id: dto.orderId } });
    if (!order) throw new NotFoundException('Pedido não encontrado');

    // Simulação de gateway de pagamento
    const gatewayId = `PAY-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
    const pixCode = dto.method === 'PIX' ? `00020126360014BR.GOV.BCB.PIX${gatewayId}` : null;

    const payment = await this.prisma.payment.create({
      data: {
        orderId: dto.orderId,
        method: dto.method,
        amount: order.total,
        installments: dto.installments ?? 1,
        gatewayId,
        pixCode,
        status: PaymentStatus.PROCESSING,
      },
    });

    // Simular aprovação automática (em produção seria webhook do gateway)
    setTimeout(async () => {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.APPROVED, paidAt: new Date() },
      });
      await this.prisma.order.update({
        where: { id: dto.orderId },
        data: { status: 'CONFIRMED' },
      });
    }, 2000);

    return payment;
  }

  async findByOrder(orderId: string) {
    return this.prisma.payment.findUnique({ where: { orderId } });
  }

  async refund(id: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    if (!payment) throw new NotFoundException('Pagamento não encontrado');
    return this.prisma.payment.update({
      where: { id },
      data: { status: PaymentStatus.REFUNDED, refundedAt: new Date() },
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationType } from '@prisma/client';
import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable()
export class NotificationsService {
  private readonly notificationSubject = new Subject<Record<string, any>>();

  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, type: NotificationType, title: string, message: string, data?: Record<string, any>) {
    const notification = await this.prisma.notification.create({
      data: { userId, type, title, message, data },
    });
    this.notificationSubject.next(notification);
    return notification;
  }

  @OnEvent('order.confirmed')
  async handleOrderConfirmed(payload: { orderId: string; userId: string; orderNumber: string; total: number }) {
    await this.create(
      payload.userId,
      NotificationType.ORDER_UPDATE,
      'Pedido Confirmado! 🎉',
      `Seu pedido #${payload.orderNumber.slice(-8).toUpperCase()} de R$ ${payload.total.toFixed(2)} foi confirmado com sucesso.`,
      { orderId: payload.orderId }
    );
  }

  @OnEvent('review.approved')
  async handleReviewApproved(payload: { reviewId: string; userId: string; productName: string }) {
    await this.create(
      payload.userId,
      NotificationType.REVIEW,
      'Avaliação Aprovada! ⭐',
      `Sua avaliação para o item "${payload.productName}" foi aprovada e está ativa no sistema.`,
      { reviewId: payload.reviewId }
    );
  }

  stream(userId: string): Observable<Record<string, any>> {
    return this.notificationSubject.asObservable().pipe(
      filter((n) => n.userId === userId)
    );
  }

  async findAll(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return { data: notifications, total, unreadCount, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({ where: { id, userId } });
    if (!notification) throw new NotFoundException('Notificação não encontrada');

    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
    return { message: 'Todas as notificações marcadas como lidas' };
  }
}

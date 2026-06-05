import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionType } from '@prisma/client';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyWallet(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      include: {
        transactions: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!wallet) {
      throw new NotFoundException('Carteira não encontrada para este usuário');
    }

    return wallet;
  }

  async redeemCashback(userId: string, orderId: string, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('O valor de resgate deve ser maior que zero');
    }

    return this.prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({ where: { userId } });
      
      if (!wallet) {
        throw new NotFoundException('Carteira não encontrada');
      }

      if (Number(wallet.balance) < amount) {
        throw new BadRequestException('Saldo insuficiente para o resgate solicitado');
      }

      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: amount } },
      });

      const transaction = await tx.transaction.create({
        data: {
          walletId: wallet.id,
          orderId,
          amount,
          type: TransactionType.DEBIT,
          description: 'Resgate de Cashback (REDEMPTION)',
        },
      });

      return { wallet: updatedWallet, transaction };
    });
  }

  async getHistory(userId: string, page: number = 1, limit: number = 20) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      throw new NotFoundException('Carteira não encontrada');
    }

    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where: { walletId: wallet.id },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.transaction.count({
        where: { walletId: wallet.id },
      }),
    ]);

    return {
      data: transactions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

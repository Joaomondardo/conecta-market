import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@Injectable()
export class CampaignsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(storeId: string, dto: CreateCampaignDto) {
    const campaign = await this.prisma.campaign.create({
      data: {
        storeId,
        name: dto.name,
        description: dto.description,
        type: dto.type,
        discountType: dto.discountType ?? 'PERCENTAGE',
        discountValue: dto.discountValue,
        minOrderValue: dto.minOrderValue,
        maxDiscount: dto.maxDiscount,
        usageLimit: dto.usageLimit,
        startsAt: dto.startsAt,
        endsAt: dto.endsAt,
        isPublic: dto.isPublic ?? true,
        ...(dto.couponCode && {
          coupon: { create: { code: dto.couponCode.toUpperCase() } },
        }),
      },
      include: { coupon: true },
    });
    return campaign;
  }

  async findAll(storeId: string) {
    return this.prisma.campaign.findMany({
      where: { storeId },
      include: { coupon: true },
      orderBy: { startsAt: 'desc' },
    });
  }

  async findPublicActive() {
    const now = new Date();
    return this.prisma.campaign.findMany({
      where: {
        isPublic: true,
        status: 'ACTIVE',
        startsAt: { lte: now },
        endsAt: { gte: now },
      },
      include: { coupon: true, store: { select: { id: true, name: true, logo: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async validateCoupon(code: string, orderValue: number) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
      include: { campaign: true },
    });

    if (!coupon) return { valid: false, message: 'Cupom não encontrado' };
    const { campaign } = coupon;
    const now = new Date();

    if (campaign.status !== 'ACTIVE') return { valid: false, message: 'Cupom inativo' };
    if (campaign.startsAt > now) return { valid: false, message: 'Cupom ainda não ativo' };
    if (campaign.endsAt < now) return { valid: false, message: 'Cupom expirado' };
    if (campaign.usageLimit && campaign.usageCount >= campaign.usageLimit) {
      return { valid: false, message: 'Limite de uso atingido' };
    }
    if (campaign.minOrderValue && orderValue < Number(campaign.minOrderValue)) {
      return { valid: false, message: `Valor mínimo: R$ ${campaign.minOrderValue}` };
    }

    let discount = 0;
    if (campaign.discountType === 'PERCENTAGE') {
      discount = (orderValue * Number(campaign.discountValue)) / 100;
      if (campaign.maxDiscount) discount = Math.min(discount, Number(campaign.maxDiscount));
    } else {
      discount = Number(campaign.discountValue);
    }

    return { valid: true, discount, coupon, campaign };
  }

  async remove(id: string, storeId: string) {
    await this.prisma.campaign.update({
      where: { id, storeId },
      data: { status: 'PAUSED' },
    });
    return { message: 'Campanha pausada' };
  }
}

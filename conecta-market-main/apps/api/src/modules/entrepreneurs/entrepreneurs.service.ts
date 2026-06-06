import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEntrepreneurDto } from './dto/create-entrepreneur.dto';
import { UserRole, UserStatus, StoreStatus } from '@prisma/client';
import { AuthService } from '../auth/auth.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EntrepreneurService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async onboard(dto: CreateEntrepreneurDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) throw new ConflictException('Email já cadastrado');

    // Senha padrão para onboarding simplificado (deve ser alterada depois)
    const defaultPassword = await bcrypt.hash('Conecta123!', 12);

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          phone: dto.whatsapp,
          password: defaultPassword,
          role: UserRole.EMPREENDEDOR,
          status: UserStatus.ACTIVE,
          wallet: { create: { balance: 0 } },
        },
      });

      await tx.store.create({
        data: {
          ownerId: user.id,
          name: `Loja de ${dto.name}`,
          slug: this.generateSlug(dto.name),
          status: StoreStatus.ACTIVE,
          phone: dto.whatsapp,
        },
      });

      return user;
    });

    // Gerar tokens para login imediato após onboarding
    const tokens = await this.authService.generateTokens(result.id, result.email, result.role);
    await this.authService.updateRefreshToken(result.id, tokens.refreshToken);


    return {
      user: result,
      ...tokens,
    };
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      + '-' + Math.floor(Math.random() * 1000);
  }
}

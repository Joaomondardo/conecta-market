import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
  ) { }

  // ── Register ───────────────────────────────────────────────────────────────
  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email já está em uso');

    const hash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hash,
        phone: dto.phone,
        role: dto.role ?? UserRole.CLIENTE,
        wallet: { create: { balance: 0 } }, // Create wallet on register
      },
      include: { wallet: true },
    });


    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    const { password: _password, refreshToken: _refreshToken, ...result } = user;
    return { user: result, ...tokens };
  }

  // ── Login ─────────────────────────────────────────────────────────────────
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { wallet: true },
    });

    if (!user || !user.password) throw new UnauthorizedException('Credenciais inválidas');

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) throw new UnauthorizedException('Credenciais inválidas');

    if (user.status === 'SUSPENDED') throw new UnauthorizedException('Conta suspensa');

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const { password: _password, refreshToken: _refreshToken, ...result } = user;
    return { user: result, ...tokens };
  }

  // ── Logout ────────────────────────────────────────────────────────────────
  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return { message: 'Logout realizado com sucesso' };
  }

  // ── Refresh Token ─────────────────────────────────────────────────────────
  async refreshTokens(userId: string, rt: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.refreshToken) throw new UnauthorizedException();

    const rtMatch = await bcrypt.compare(rt, user.refreshToken);
    if (!rtMatch) throw new UnauthorizedException('Token inválido');

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  // ── Forgot Password ───────────────────────────────────────────────────────
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    // Não revelar se o usuário existe ou não (segurança)
    if (!user) return { message: 'Se o email existir, um link será enviado' };

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hora

    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordToken: token, resetPasswordExpires: expires },
    });

    // TODO: Enviar email com o link de reset
    // await this.mailerService.sendPasswordReset(user.email, token);

    return { message: 'Se o email existir, um link será enviado' };
  }

  // ── Reset Password ────────────────────────────────────────────────────────
  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        resetPasswordToken: dto.token,
        resetPasswordExpires: { gt: new Date() },
      },
    });
    if (!user) throw new BadRequestException('Token inválido ou expirado');

    const hash = await bcrypt.hash(dto.password, 12);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hash,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        refreshToken: null,
      },
    });

    return { message: 'Senha redefinida com sucesso' };
  }

  // ── Google OAuth ──────────────────────────────────────────────────────────
  async googleLogin(googleUser: { email: string; name: string; googleId: string; avatar?: string }) {
    let user = await this.prisma.user.findUnique({ where: { email: googleUser.email } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          googleId: googleUser.googleId,
          avatar: googleUser.avatar,
          emailVerified: true,
          emailVerifiedAt: new Date(),
          status: 'ACTIVE',
          wallet: { create: { balance: 0 } },
        },
        include: { wallet: true },
      });
    } else if (!user.googleId) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { googleId: googleUser.googleId },
        include: { wallet: true },
      });
    } else {
      const dbUser = await this.prisma.user.findUnique({
        where: { id: user.id },
        include: { wallet: true },
      });
      if (dbUser) {
        user = dbUser;
      }
    }
    if (!user) {
      throw new Error('Usuário não encontrado');
      // Nota: Se o seu projeto tiver um erro personalizado do NestJS, 
      // pode usar: throw new UnauthorizedException('Credenciais inválidas');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    const { password: _password, refreshToken: _refreshToken, ...result } = user as Record<string, any>;
    return { user: result, ...tokens };
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  async generateTokens(userId: string, email: string, role: UserRole) {

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, role },
        {
          secret: this.config.get<string>('JWT_SECRET'),
          expiresIn: this.config.get<string>('JWT_EXPIRES_IN', '15m'),
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.config.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
        },
      ),
    ]);
    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: string, rt: string) {

    const hash = await bcrypt.hash(rt, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hash },
    });
  }
}

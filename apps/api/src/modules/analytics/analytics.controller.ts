import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('analytics')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('admin')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Dashboard do Admin' })
  getAdminDashboard() {
    return this.analyticsService.getAdminDashboard();
  }

  @Get('seller')
  @Roles(UserRole.SELLER, UserRole.SUPPLIER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Dashboard do Vendedor' })
  getSellerDashboard(@GetCurrentUser() user: any) {
    if (!user.store?.id) return { message: 'Usuário não possui loja associada' };
    return this.analyticsService.getSellerDashboard(user.store.id);
  }
}

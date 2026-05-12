import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('campaigns')
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(UserRole.SELLER, UserRole.SUPPLIER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Criar campanha' })
  create(@GetCurrentUser() user: any, @Body() dto: CreateCampaignDto) {
    return this.campaignsService.create(user.store?.id ?? dto.storeId, dto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('store')
  @Roles(UserRole.SELLER, UserRole.SUPPLIER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Listar campanhas da loja' })
  findAll(@GetCurrentUser() user: any) {
    return this.campaignsService.findAll(user.store?.id);
  }

  @Public()
  @Get('public')
  @ApiOperation({ summary: 'Listar campanhas públicas ativas' })
  findPublicActive() {
    return this.campaignsService.findPublicActive();
  }

  @Public()
  @Post('validate-coupon')
  @ApiOperation({ summary: 'Validar cupom' })
  validateCoupon(@Body('code') code: string, @Body('orderValue') orderValue: number) {
    return this.campaignsService.validateCoupon(code, orderValue);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(UserRole.SELLER, UserRole.SUPPLIER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Pausar campanha' })
  remove(@Param('id') id: string, @GetCurrentUser() user: any) {
    return this.campaignsService.remove(id, user.store?.id);
  }
}

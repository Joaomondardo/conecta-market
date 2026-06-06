import {
  Controller, Get, Post, Patch, Param, Body, Query, UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole, StoreStatus } from '@prisma/client';

@ApiTags('stores')
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar lojas ativas' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.storesService.findAll(page, limit, StoreStatus.ACTIVE, search);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Buscar loja por slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.storesService.findBySlug(slug);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Criar loja' })
  create(@GetCurrentUser('id') userId: string, @Body() dto: CreateStoreDto) {
    return this.storesService.create(userId, dto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('me/store')
  @ApiOperation({ summary: 'Minha loja' })
  getMyStore(@GetCurrentUser('id') userId: string) {
    return this.storesService.findByOwner(userId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch('me/store')
  @ApiOperation({ summary: 'Atualizar minha loja' })
  updateMyStore(@GetCurrentUser('id') userId: string, @Body() dto: UpdateStoreDto) {
    return this.storesService.findByOwner(userId).then((store) => {
      if (!store) throw new Error('Loja não encontrada');
      return this.storesService.update(store.id, userId, dto);
    });
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/status')
  @ApiOperation({ summary: 'Aprovar/rejeitar loja (Admin)' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: StoreStatus,
    @GetCurrentUser('id') adminId: string,
  ) {
    return this.storesService.updateStatus(id, status, adminId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/all')
  @ApiOperation({ summary: 'Listar todas as lojas (Admin)' })
  findAllAdmin(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: StoreStatus,
  ) {
    return this.storesService.findAll(page, limit, status);
  }
}

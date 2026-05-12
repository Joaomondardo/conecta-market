import {
  Controller, Get, Post, Patch, Param, Body, Query, UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';
import { OrderStatus } from '@prisma/client';
import { ActiveUser } from '../../common/interfaces/active-user.interface';

@ApiTags('orders')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar pedido' })
  create(@GetCurrentUser('id') userId: string, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar pedidos do usuário' })
  findAll(
    @GetCurrentUser() user: ActiveUser,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: OrderStatus,
  ) {
    return this.ordersService.findAll(user.id, user.role, page, limit, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes do pedido' })
  findOne(@Param('id') id: string, @GetCurrentUser() user: ActiveUser) {
    return this.ordersService.findOne(id, user.id, user.role);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status do pedido (Admin/Vendedor)' })
  updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
    return this.ordersService.updateStatus(id, status);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancelar pedido' })
  cancel(
    @Param('id') id: string,
    @GetCurrentUser('id') userId: string,
    @Body('reason') reason: string,
  ) {
    return this.ordersService.cancel(id, userId, reason);
  }
}

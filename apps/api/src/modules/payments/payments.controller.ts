import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('payments')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post() @ApiOperation({ summary: 'Criar pagamento para um pedido' })
  create(@Body() dto: CreatePaymentDto) { return this.paymentsService.create(dto); }

  @Get('order/:orderId') @ApiOperation({ summary: 'Buscar pagamento por pedido' })
  findByOrder(@Param('orderId') orderId: string) { return this.paymentsService.findByOrder(orderId); }

  @Patch(':id/refund') @ApiOperation({ summary: 'Estornar pagamento' })
  refund(@Param('id') id: string) { return this.paymentsService.refund(id); }
}

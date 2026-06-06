import { Controller, Get, Post, Body, Query, UseGuards, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { RedeemCashbackDto } from './dto/wallet-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';
import { ActiveUser } from '../../common/interfaces/active-user.interface';

@ApiTags('wallet')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('me')
  @ApiOperation({ summary: 'Obter saldo atual e histórico recente da carteira do usuário logado' })
  getMyWallet(@GetCurrentUser() user: ActiveUser) {
    return this.walletService.getMyWallet(user.id);
  }

  @Post('redeem')
  @ApiOperation({ summary: 'Resgatar cashback em um pedido' })
  redeemCashback(
    @GetCurrentUser() user: ActiveUser,
    @Body() dto: RedeemCashbackDto,
  ) {
    return this.walletService.redeemCashback(user.id, dto.orderId, dto.amount);
  }

  @Get('history')
  @ApiOperation({ summary: 'Obter histórico completo de transações de cashback' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getHistory(
    @GetCurrentUser() user: ActiveUser,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.walletService.getHistory(user.id, page, limit);
  }
}

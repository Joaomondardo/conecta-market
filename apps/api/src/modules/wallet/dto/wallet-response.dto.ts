import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, Min } from 'class-validator';

export class RedeemCashbackDto {
  @ApiProperty({ description: 'ID do pedido onde o cashback será aplicado' })
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'Valor a ser resgatado da carteira' })
  @IsNumber()
  @Min(0.01)
  amount: number;
}

export class TransactionRecord {
  @ApiProperty({ description: 'ID da transação' })
  id: string;

  @ApiProperty({ description: 'ID da carteira associada' })
  walletId: string;

  @ApiPropertyOptional({ description: 'ID do pedido associado (se aplicável)' })
  orderId?: string;

  @ApiProperty({ description: 'Valor da transação' })
  amount: number;

  @ApiProperty({ description: 'Tipo da transação', enum: ['CREDIT', 'DEBIT'] })
  type: 'CREDIT' | 'DEBIT';

  @ApiPropertyOptional({ description: 'Descrição da transação' })
  description?: string;

  @ApiProperty({ description: 'Data de criação da transação' })
  createdAt: Date;
}

export class WalletSummary {
  @ApiProperty({ description: 'ID da carteira' })
  id: string;

  @ApiProperty({ description: 'ID do usuário associado' })
  userId: string;

  @ApiProperty({ description: 'Saldo atual da carteira' })
  balance: number;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de última atualização' })
  updatedAt: Date;

  @ApiProperty({ description: 'Últimas 10 transações', type: [TransactionRecord] })
  recentTransactions: TransactionRecord[];
}

import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class CreateEntrepreneurDto {
  @ApiProperty({ example: 'Mercadinho da Vila' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'contato@mercadinho.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senha123!', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ example: '(11) 99999-9999' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '12.345.678/0001-00' })
  @IsOptional()
  @IsString()
  cnpj?: string;

  @ApiProperty({ enum: UserRole, default: UserRole.EMPREENDEDOR })
  @IsEnum(UserRole)
  role: UserRole = UserRole.EMPREENDEDOR;
}

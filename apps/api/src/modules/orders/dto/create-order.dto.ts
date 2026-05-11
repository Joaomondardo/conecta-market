import { IsString, IsArray, IsNumber, IsOptional, IsBoolean, ValidateNested, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @ApiProperty() @IsString() productId: string;
  @ApiProperty() @IsNumber() @Min(1) @Type(() => Number) quantity: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isB2B?: boolean;
}

export class CreateOrderDto {
  @ApiProperty() @IsString() storeId: string;
  @ApiPropertyOptional() @IsOptional() @IsString() addressId?: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiPropertyOptional() @IsOptional() @IsString() couponCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Type(() => Number) discount?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Type(() => Number) shipping?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Type(() => Number) tax?: number;
}

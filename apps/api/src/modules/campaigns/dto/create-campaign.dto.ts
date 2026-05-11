import { IsString, IsNumber, IsOptional, IsBoolean, IsEnum, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CampaignType } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateCampaignDto {
  @ApiPropertyOptional() @IsOptional() @IsString() storeId?: string;
  @ApiProperty() @IsString() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty({ enum: CampaignType }) @IsEnum(CampaignType) type: CampaignType;

  @ApiPropertyOptional({ default: 'PERCENTAGE' }) @IsOptional() @IsString() discountType?: string;
  @ApiProperty() @IsNumber() @Min(0) @Type(() => Number) discountValue: number;

  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) @Type(() => Number) minOrderValue?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) @Type(() => Number) maxDiscount?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(1) @Type(() => Number) usageLimit?: number;

  @ApiProperty() @IsDateString() startsAt: Date;
  @ApiProperty() @IsDateString() endsAt: Date;

  @ApiPropertyOptional({ default: true }) @IsOptional() @IsBoolean() isPublic?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() couponCode?: string;
}

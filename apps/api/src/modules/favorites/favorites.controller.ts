import { Controller, Get, Post, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';

@ApiTags('favorites')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':productId')
  @ApiOperation({ summary: 'Adicionar produto aos favoritos' })
  add(@GetCurrentUser('id') userId: string, @Param('productId') productId: string) {
    return this.favoritesService.add(userId, productId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar favoritos do usuário' })
  findAll(
    @GetCurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.favoritesService.findAll(userId, page, limit);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Remover produto dos favoritos' })
  remove(@GetCurrentUser('id') userId: string, @Param('productId') productId: string) {
    return this.favoritesService.remove(userId, productId);
  }
}

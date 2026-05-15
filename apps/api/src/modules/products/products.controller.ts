import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';
import { ActiveUser } from '../../common/interfaces/active-user.interface';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar produtos com filtros' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'storeId', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  findAll(@Query() query: FilterProductsDto) {
    return this.productsService.findAll(query);
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'Produtos em destaque' })
  getFeatured(@Query('limit') limit?: number) {
    return this.productsService.getFeatured(limit);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Buscar produto por ID ou slug' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(UserRole.LOJISTA, UserRole.FORNECEDOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Criar produto (Vendedor/Admin)' })
  create(
    @GetCurrentUser() user: ActiveUser,
    @Body() dto: CreateProductDto,
  ) {
    const storeId = user.storeId || dto.storeId;
    if (!storeId) throw new Error('Store ID is required');
    return this.productsService.create(storeId, dto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @Roles(UserRole.LOJISTA, UserRole.FORNECEDOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Atualizar produto (Vendedor/Admin)' })
  update(
    @Param('id') id: string,
    @GetCurrentUser() user: ActiveUser,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, user.storeId!, dto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(UserRole.LOJISTA, UserRole.FORNECEDOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Desativar produto (Vendedor/Admin)' })
  remove(@Param('id') id: string, @GetCurrentUser() user: ActiveUser) {
    return this.productsService.remove(id, user.storeId!);
  }
}

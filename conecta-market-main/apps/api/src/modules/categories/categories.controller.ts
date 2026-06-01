import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public() @Get() @ApiOperation({ summary: 'Listar categorias com hierarquia' })
  findAll() { return this.categoriesService.findAll(); }

  @Public() @Get(':id') @ApiOperation({ summary: 'Buscar categoria por ID' })
  findOne(@Param('id') id: string) { return this.categoriesService.findOne(id); }

  @ApiBearerAuth('access-token') @UseGuards(JwtAuthGuard, RolesGuard)
  @Post() @Roles(UserRole.ADMIN) @ApiOperation({ summary: 'Criar categoria (Admin)' })
  create(@Body() dto: CreateCategoryDto) { return this.categoriesService.create(dto); }

  @ApiBearerAuth('access-token') @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id') @Roles(UserRole.ADMIN) @ApiOperation({ summary: 'Atualizar categoria (Admin)' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateCategoryDto>) { return this.categoriesService.update(id, dto); }

  @ApiBearerAuth('access-token') @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id') @Roles(UserRole.ADMIN) @ApiOperation({ summary: 'Remover categoria (Admin)' })
  remove(@Param('id') id: string) { return this.categoriesService.remove(id); }
}

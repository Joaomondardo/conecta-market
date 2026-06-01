import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EntrepreneurService } from './entrepreneurs.service';
import { CreateEntrepreneurDto } from './dto/create-entrepreneur.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('entrepreneurs')
@Controller('entrepreneurs')
export class EntrepreneursController {
  constructor(private readonly entrepreneurService: EntrepreneurService) {}

  @Public()
  @Post('onboarding')
  @ApiOperation({ summary: 'Cadastro simplificado de empreendedores' })
  onboard(@Body() dto: CreateEntrepreneurDto) {
    return this.entrepreneurService.onboard(dto);
  }
}

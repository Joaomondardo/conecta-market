import { Controller, Get, Patch, Param, Query, UseGuards, Sse, MessageEvent, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@ApiTags('notifications')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Sse('stream')
  @ApiOperation({ summary: 'Stream de notificações em tempo real (SSE)' })
  streamNotifications(@Query('token') token: string): Observable<MessageEvent> {
    if (!token) {
      throw new UnauthorizedException('Token não fornecido');
    }
    try {
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;
      return this.notificationsService.stream(userId).pipe(
        map((notification) => ({
          data: notification,
          type: 'notification',
        })),
      );
    } catch (err) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar notificações do usuário' })
  findAll(
    @GetCurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.notificationsService.findAll(userId, page, limit);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marcar notificação como lida' })
  markAsRead(@Param('id') id: string, @GetCurrentUser('id') userId: string) {
    return this.notificationsService.markAsRead(id, userId);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Marcar todas as notificações como lidas' })
  markAllAsRead(@GetCurrentUser('id') userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }
}

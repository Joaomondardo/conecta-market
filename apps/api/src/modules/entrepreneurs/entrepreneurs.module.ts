import { Module } from '@nestjs/common';
import { EntrepreneursController } from './entrepreneurs.controller';
import { EntrepreneurService } from './entrepreneurs.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [EntrepreneursController],
  providers: [EntrepreneurService],
})
export class EntrepreneursModule {}

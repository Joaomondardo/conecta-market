import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { StoresModule } from './modules/stores/stores.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { EntrepreneursModule } from './modules/entrepreneurs/entrepreneurs.module';
import { WalletModule } from './modules/wallet/wallet.module';

import { EventEmitterModule } from '@nestjs/event-emitter';
import { validate } from './common/config/env.validation';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    // ── Config ──────────────────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validate,
    }),

    // ── Rate Limiting ────────────────────────────────────────────────────────
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('THROTTLE_TTL', 60),
          limit: config.get<number>('THROTTLE_LIMIT', 100),
        },
      ],
    }),

    // ── Banco de Dados ───────────────────────────────────────────────────────
    PrismaModule,

    // ── Módulos de Negócio ───────────────────────────────────────────────────
    AuthModule,
    UsersModule,
    StoresModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    PaymentsModule,
    CampaignsModule,
    ReviewsModule,
    NotificationsModule,
    AnalyticsModule,
    FavoritesModule,
    EntrepreneursModule,
    WalletModule,
  ],

})
export class AppModule {}

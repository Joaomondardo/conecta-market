import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // ── Security ───────────────────────────────────────────────────────────────
  app.use(helmet());
  app.enableCors({
    origin: config.get('CORS_ORIGIN', 'http://localhost:3000'),
    credentials: true,
  });

  // ── Versioning ─────────────────────────────────────────────────────────────
  app.enableVersioning({ type: VersioningType.URI });
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());

  // ── Validation ─────────────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── Swagger ────────────────────────────────────────────────────────────────
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Conecta Market API')
    .setDescription(
      'API do marketplace híbrido B2B+B2C com foco em inclusão digital. ' +
        'Gerencie usuários, lojas, produtos, pedidos, campanhas e muito mais.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addTag('auth', 'Autenticação e autorização')
    .addTag('users', 'Gestão de usuários')
    .addTag('stores', 'Lojas e fornecedores')
    .addTag('products', 'Catálogo de produtos')
    .addTag('categories', 'Categorias')
    .addTag('orders', 'Pedidos e fluxo de compra')
    .addTag('payments', 'Pagamentos')
    .addTag('campaigns', 'Campanhas e cupons')
    .addTag('reviews', 'Avaliações')
    .addTag('notifications', 'Notificações')
    .addTag('analytics', 'Análises e métricas')
    .addTag('favorites', 'Favoritos')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = config.get<number>('PORT', 3001);
  await app.listen(port);
  console.log(`🚀 Conecta Market API rodando em: http://localhost:${port}`);
  console.log(`📚 Swagger UI disponível em: http://localhost:${port}/api/docs`);
}
bootstrap();

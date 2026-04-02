// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import session from 'express-session';
import RedisStore from 'connect-redis';
import { ValidationPipe, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import rateLimit from 'express-rate-limit';
import { REDIS_CLIENT } from './infrastructure/redis/redis.constant';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Créer l'application NestJS
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static media files (property images, avatars, etc.)
  app.useStaticAssets(join(__dirname, '..', 'media'), {
    prefix: '/media/',
  });

  // Validation globale automatique pour tous les DTO
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // ─── Swagger / OpenAPI ──────────────────────────────────────────────────
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Rent & Tourism Platform API')
    .setDescription(
      `## Complete REST API documentation for the rental & tourism platform.

### Authentication
All endpoints except those marked **Public** require a valid JWT Bearer token.

### Role Hierarchy
| Role | Level | Description |
|------|-------|-------------|
| \`hyper_admin\` | 5 | Platform super-admin — full access, cannot be managed by others |
| \`hyper_manager\` | 4 | Platform manager — manages hosts, validates documents/payments |
| \`admin\` | 3 | Host / Property owner — manages own properties & managers |
| \`manager\` | 2 | Delegated manager — manages assigned properties with permissions |
| \`user\` | 1 | Regular user / Guest — browses, books, reviews |

### Permission System
Managers have granular permissions per property/group: \`create_property\`, \`modify_property\`, \`modify_prices\`, \`view_bookings\`, \`accept_bookings\`, etc.

### Payment Methods (Algeria)
\`ccp\`, \`baridi_mob\`, \`edahabia\`, \`cib\`, \`cash\`, \`bank_transfer\`
`,
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'Enter your JWT token' },
      'JWT-auth',
    )
    .addTag('Auth', 'Authentication & session management')
    .addTag('SSO', 'Single Sign-On (Google, etc.)')
    .addTag('Users', 'User management & avatar')
    .addTag('Roles', 'Role & permission management')
    .addTag('Invitations', 'User invitations')
    .addTag('Referrals', 'Referral & sharing system')
    .addTag('Properties', 'Property CRUD & search')
    .addTag('Property Groups', 'Group properties for management')
    .addTag('Bookings', 'Property booking lifecycle')
    .addTag('Services', 'Tourism services CRUD & search')
    .addTag('Service Groups', 'Group services for management')
    .addTag('Service Bookings', 'Service booking lifecycle')
    .addTag('Reviews', 'Property reviews')
    .addTag('Favorites', 'User favorites / wishlist')
    .addTag('Comments', 'Social comments on properties/services')
    .addTag('Reactions', 'Likes & reactions')
    .addTag('Rankings', 'User leaderboard & ranking')
    .addTag('Points', 'Points system & transactions')
    .addTag('Badges', 'Achievement badges')
    .addTag('Profiles', 'User profiles')
    .addTag('Settings', 'User preferences & notifications')
    .addTag('Payments', 'Transfer accounts & receipt validation')
    .addTag('Documents', 'Property document validation')
    .addTag('Hyper Management', 'Platform-level pause/archive/delete')
    .addTag('Dashboard', 'Admin dashboard stats')
    .addTag('Metrics', 'Platform metrics & analytics')
    .addTag('Notifications', 'Push & email notifications')
    .addTag('Support', 'Support chat & ticketing')
    .addTag('Cancellation Rules', 'Host cancellation policies')
    .addTag('Fee Absorption', 'Host fee absorption settings')
    .addTag('Service Fees', 'Platform service fee rules')
    .addTag('Points Rules', 'Points earning/conversion rules')
    .addTag('Saved Search Alerts', 'Property search alerts')
    .addTag('Rewards', 'Rewards shop — redeem points for discounts, upgrades, free services')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  // Expose swagger JSON at /api/docs-json for frontend consumption
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      syntaxHighlight: { theme: 'monokai' },
    },
    customSiteTitle: 'Rent Platform API Documentation',
  });

  // Récupérer le client Redis injecté par RedisModule
  const redisClient = app.get<Redis>(REDIS_CLIENT);

  // Configurer RedisStore pour les sessions
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'rent_app:',
  });

  // Middleware session avec Redis
  app.use(
    session({
      store: redisStore,
      secret:
        process.env.SESSION_SECRET ||
        'averylongsecretphrasebiggerthan32chars',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'strict',
      },
    }),
  );

  // Body parser avec limites étendues
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Activer CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  // Rate limiting global
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000,
      max: 1000,
      standardHeaders: true,
      legacyHeaders: false,
      message: 'Too many requests from this IP, please try again later.',
    }),
  );

  // Préfixe global pour toutes les routes
  app.setGlobalPrefix('api');

  // Logger global
  app.useLogger(['log', 'warn', 'error', 'debug', 'verbose']);

  // Lancer le serveur
  await app.listen(8095);
  logger.log('Application is running on port 8095');
  logger.log('Swagger docs available at http://localhost:8095/api/docs');
}

bootstrap();
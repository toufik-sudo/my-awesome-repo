// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import session from 'express-session';
import RedisStore from 'connect-redis';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import Redis from 'ioredis';
import rateLimit from 'express-rate-limit';
import { REDIS_CLIENT } from './infrastructure/redis/redis.constant';


async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Créer l'application NestJS
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static media files (property images, avatars, etc.)
  app.useStaticAssets(join(__dirname, '..', 'media'), {
    prefix: '/media/',
  });

  // Validation globale automatique pour tous les DTO
  app.useGlobalPipes(new ValidationPipe());

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

  // ─── Swagger Setup ──────────────────────────────────────────────────
  const swaggerConfig = new DocumentBuilder()
    .setTitle('ByootDZ API')
    .setDescription(`
## ByootDZ Platform API

### Role Hierarchy
| Role | Level | Description |
|------|-------|-------------|
| **hyper_admin** | 100 | Full platform access (except property/service CRUD) |
| **hyper_manager** | 90 | Invited by hyper_admin, scoped permissions |
| **admin** | 50 | Manages OWN properties/services |
| **manager** | 30 | Invited by admin, manages assigned resources |
| **user** | 10 | Regular platform user (self-registered, full access) |
| **guest** | 5 | Invited by admin/manager/hyper, read-only scoped access |

### Invitation Rules
- **hyper_admin** → can invite: hyper_manager, admin, user, guest
- **hyper_manager** → can invite: admin, guest
- **admin** → can invite: manager, guest
- **manager** → can invite: guest only
- **user/guest** → cannot invite anyone

### Guest Behavior
- Admin invites Guest → access admin's properties/services only (read-only)
- Manager invites Guest → access manager's assigned properties (multi-admin)
- HyperManager invites Guest → access hyper_manager's permissioned scope
- Guest can: view properties/services, calendar, make reservations, contact support
- **IT MVP Exception**: Guest can be converted to user via support request

### Non-invited Users
- Self-registered users default to **user** role with full access to all properties/services
    `)
    .setVersion('2.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentication & session management')
    .addTag('Roles & Permissions', 'Role management, assignments, permissions')
    .addTag('Invitations', 'Invitation system with role-based rules')
    .addTag('Properties', 'Property CRUD & management')
    .addTag('Services', 'Tourism services CRUD')
    .addTag('Bookings', 'Booking management')
    .addTag('Points & Rewards', 'Points rules, badges, rewards')
    .addTag('Service Fees', 'Fee calculation rules')
    .addTag('Referrals', 'Referral & sharing system')
    .addTag('Documents', 'Document verification & validation')
    .addTag('Payments', 'Payment validation & transfer accounts')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  // Logger global
  app.useLogger(['log', 'warn', 'error', 'debug', 'verbose']);

  // Lancer le serveur
  await app.listen(8095);
  logger.log('Application is running on port 8095');
  logger.log('Swagger docs available at http://localhost:8095/api/docs');
}

bootstrap();

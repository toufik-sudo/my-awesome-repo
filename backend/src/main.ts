// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import session from 'express-session';
import RedisStore from 'connect-redis';
import { ValidationPipe, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import rateLimit from 'express-rate-limit';
import { REDIS_CLIENT } from './infrastructure/redis/redis.constant';


async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Créer l'application NestJS
  const app = await NestFactory.create(AppModule);

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
        secure: process.env.NODE_ENV === 'production', // HTTPS seulement en prod
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
      windowMs: 5 * 60 * 1000, // 15 minutes
      max: 100, // 100 requêtes par IP
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
}

bootstrap();
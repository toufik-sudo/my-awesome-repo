import * as session from 'express-session';
import RedisStore from 'connect-redis';
import * as redis from 'redis';
import { INestApplication } from '@nestjs/common';

export function configureSession(app: INestApplication) {
  const redisClient = redis.createClient();

  redisClient.connect().catch(console.error);

  const redisStore = new RedisStore({
    client: redisClient,
  });

  app.use(
    session({
      store: redisStore,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: true, httpOnly: true, sameSite: 'strinct' },
    }),
  );
}

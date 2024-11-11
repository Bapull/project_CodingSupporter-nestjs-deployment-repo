import { INestApplication } from '@nestjs/common';
import * as session from 'express-session';
import RedisStore from "connect-redis"
import {createClient} from "redis"
import * as passport from 'passport';
import { ConfigService } from '@nestjs/config';

export function setUpSession(app: INestApplication): void {
  const configService = new ConfigService()

  const redisClient = createClient({
    url: configService.get<string>('REDIS_URL')
  })
  redisClient.connect().catch(console.error)

  let redisStore = new RedisStore({
    client: redisClient
  })

  app.use(
      session({
        secret: configService.get<string>('SESSION_SECRET'),
        resave:false,
        saveUninitialized:false,
        store: redisStore,
        cookie:{
          secure:true,
          sameSite:'none',
          maxAge: 36000000, //10시간
        }
      }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
}
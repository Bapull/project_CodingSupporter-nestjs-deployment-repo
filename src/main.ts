import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { httpsOptions } from './setting/httpsOptions';
import { setUpSession } from './setting/init.sesstion';
import { cors } from './setting/cors';
import * as cookieParser from 'cookie-parser';
import { setUpSwagger } from './setting/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    httpsOptions,
  });
  
  setUpSession(app)

  app.use(cookieParser())
  
  cors(app)

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  setUpSwagger(app)
  
  await app.listen(3000);
}
bootstrap();
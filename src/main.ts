import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { httpsOptions } from './setting/httpsOptions';
import { setUpSession } from './setting/init.sesstion';
import { cors } from './setting/cors';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    httpsOptions,
  });
  app.useWebSocketAdapter(new IoAdapter())
  setUpSession(app)
  cors(app)
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  const config = new DocumentBuilder()
  .setTitle('CodingSupporter')
  .setDescription('CodingSupporterAPI')
  .setVersion('0.1')
  .build();
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('documentation',app,document)
  await app.listen(3000);
}
bootstrap();
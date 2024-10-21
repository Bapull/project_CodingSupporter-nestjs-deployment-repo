import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import * as session from 'express-session';
import * as passport from 'passport'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// 로깅, llm을 스트리밍(getReader)
async function bootstrap() {
  const httpsOptions = {
    key:  fs.readFileSync('key.pem'),
    cert:  fs.readFileSync('cert.pem'),
  }
  const app = await NestFactory.create(AppModule,{
    httpsOptions,
  });
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave:false,
      saveUninitialized:false,
      cookie:{
        secure:true,
        sameSite:'none'
      }
    })
  )
  app.use(passport.initialize());
  app.use(passport.session());
  app.enableCors({
    origin: 'https://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
    credentials: true,
  })
  app.useGlobalPipes(new ValidationPipe());
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
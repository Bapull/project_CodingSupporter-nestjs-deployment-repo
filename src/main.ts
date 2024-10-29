import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { httpsOptions } from './httpsOptions';

async function bootstrap() {
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
    origin: process.env.FRONTEND_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
    credentials: true,
  })
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
import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export function cors(app: INestApplication): void{
  const configService = new ConfigService()
  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
    credentials: true,
  })
}
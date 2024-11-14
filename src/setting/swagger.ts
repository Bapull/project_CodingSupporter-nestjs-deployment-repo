import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setUpSwagger(app: INestApplication): void {
    const config = new DocumentBuilder()
    .setTitle('CodingSupporter')
    .setDescription('CodingSupporterAPI')
    .setVersion('0.9')
    .build();

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('documentation',app,document)
}
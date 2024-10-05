import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IncorrectNoteModule } from './incorrect-note/incorrect-note.module';
import { IncorrectNote } from './incorrect-note/entities/incorrect-note.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [IncorrectNote],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    IncorrectNoteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IncorrectNoteModule } from './incorrect-note/incorrect-note.module';
import { IncorrectNote } from './incorrect-note/entities/incorrect-note.entity';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { AttendanceModule } from './attendance/attendance.module';
import { Attendance } from './attendance/entities/attendance.entity';
import { LangChainModule } from './lang-chain/lang-chain.module';
import { S3ServiceService } from './s3-service/s3-service.service';
import { S3ServiceModule } from './s3-service/s3-service.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [IncorrectNote, User, Attendance],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    IncorrectNoteModule,
    AuthModule,
    UserModule,
    PassportModule.register({session:true}),
    AttendanceModule,
    LangChainModule,
    S3ServiceModule,
  ],
  controllers: [AppController],
  providers: [AppService, S3ServiceService],
})
export class AppModule {}

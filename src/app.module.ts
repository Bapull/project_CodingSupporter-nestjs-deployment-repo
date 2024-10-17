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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        // host: configService.get('DB_HOST'),
        // port: +configService.get('DB_PORT'),
        // username: configService.get('DB_USERNAME'),
        // password: configService.get('DB_PASSWORD'),
        // database: configService.get('DB_NAME'),
        host: process.env.DB_HOST,           // .env에서 DB_HOST를 사용
        port: parseInt(process.env.DB_PORT), // .env에서 DB_PORT를 사용
        username: process.env.DB_USERNAME,   // .env에서 DB_USERNAME을 사용
        password: process.env.DB_PASSWORD,   // .env에서 DB_PASSWORD를 사용
        database: process.env.DB_DATABASE,   // .env에서 DB_DATABASE를 사용
        entities: [IncorrectNote, User,Attendance],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    IncorrectNoteModule,
    AuthModule,
    UserModule,
    PassportModule.register({session:true}),
    AttendanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

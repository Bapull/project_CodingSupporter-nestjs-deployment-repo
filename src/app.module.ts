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
import { S3Service } from './s3/s3.service';
import { S3Module } from './s3/s3.module';
import { ChatModule } from './chat/chat.module';
import { ChatRoomModule } from './chat-room/chat-room.module';
import { ChatRoom } from './chat-room/entities/chat-room.entity';
import { MessageModule } from './message/message.module';
import { Message } from './message/entities/message.entity';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import { NotificationModule } from './notification/notification.module';
import { Notification } from './notification/entities/notification.entity';
import * as winston from 'winston'
import { WinstonModule } from 'nest-winston';
import { APP_FILTER } from '@nestjs/core';
import { HttpFilter } from './setting/http.filter';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      inject:[ConfigService],
      useFactory:async (config: ConfigService)=>({
        ttl: 60000,
        store: await redisStore({
          url:config.get<string>('REDIS_URL')
        })
      })
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(config: ConfigService)=> ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        entities: [IncorrectNote, User, Attendance, ChatRoom, Message, Notification],
        synchronize: false,
      }),
    }),
    IncorrectNoteModule,
    AuthModule,
    UserModule,
    PassportModule.register({session:true}),
    AttendanceModule,
    LangChainModule,
    S3Module,
    ChatModule,
    ChatRoomModule,
    MessageModule,
    EmailModule,
    NotificationModule,
    WinstonModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(config:ConfigService)=>({
        transports:[
          new winston.transports.Console({
            level: config.get('NODE_ENV') === 'development' ? 'silly' : 'info',
            format: winston.format.combine(
              winston.format.colorize(),
              winston.format.timestamp(),
              winston.format.printf(({ timestamp, level, message })=>{
                return `${timestamp} [${level}]: ${message}`;
              })
            )
          }),
          new winston.transports.File({
            filename: 'CodingSupporter.log',
            level: 'warn',
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.printf(({ timestamp, level, message }) => {
                return `${timestamp} [${level}]: ${message}`;
            })
          )
          })
        ]
      })
    })
  ],
  controllers: [AppController],
  providers: [AppService, S3Service, EmailService,
    {
      provide: APP_FILTER,
      useClass: HttpFilter
    }
  ],
})
export class AppModule {}

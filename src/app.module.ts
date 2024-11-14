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
import { ChatGateway } from './chat/chat.gateway';
import { ChatModule } from './chat/chat.module';
import { ChatRoomModule } from './chat-room/chat-room.module';
import { ChatRoom } from './chat-room/entities/chat-room.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
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
        entities: [IncorrectNote, User, Attendance, ChatRoom],
        synchronize: true,
      }),
    }),
    MongooseModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(config: ConfigService)=>({
        uri: config.get<string>('MONGODB')
      })
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
  ],
  controllers: [AppController],
  providers: [AppService, S3Service],
})
export class AppModule {}

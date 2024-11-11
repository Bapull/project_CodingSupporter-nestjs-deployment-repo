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
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [IncorrectNote, User, Attendance, ChatRoom],
      synchronize: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB),
    IncorrectNoteModule,
    AuthModule,
    UserModule,
    PassportModule.register({session:true}),
    AttendanceModule,
    LangChainModule,
    S3ServiceModule,
    ChatModule,
    ChatRoomModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService, S3ServiceService],
})
export class AppModule {}

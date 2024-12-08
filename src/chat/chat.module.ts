import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessageModule } from 'src/message/message.module';
import { AuthModule } from 'src/auth/auth.module';
import { ChatRoomModule } from 'src/chat-room/chat-room.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports:[MessageModule, AuthModule, ChatRoomModule, NotificationModule],
  providers:[ChatGateway]
})
export class ChatModule {}

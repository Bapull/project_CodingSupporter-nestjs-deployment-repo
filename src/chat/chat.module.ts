import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessageModule } from 'src/message/message.module';
import { AuthModule } from 'src/auth/auth.module';
import { ChatRoomModule } from 'src/chat-room/chat-room.module';

@Module({
  imports:[MessageModule, AuthModule, ChatRoomModule],
  providers:[ChatGateway]
})
export class ChatModule {}

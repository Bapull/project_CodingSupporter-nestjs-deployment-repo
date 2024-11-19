import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { ChatRoomModule } from 'src/chat-room/chat-room.module';

@Module({
  imports:[
    ChatRoomModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports:[MessageService]
})
export class MessageModule {}

import { Module } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { ChatRoomController } from './chat-room.controller';


@Module({
  controllers: [ChatRoomController],
  providers: [ChatRoomService],
  exports:[ChatRoomService]
})
export class ChatRoomModule {}

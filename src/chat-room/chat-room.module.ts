import { Module } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { ChatRoomController } from './chat-room.controller';
import { IncorrectNoteModule } from 'src/incorrect-note/incorrect-note.module';


@Module({
  imports:[IncorrectNoteModule],
  controllers: [ChatRoomController],
  providers: [ChatRoomService],
  exports:[ChatRoomService]
})
export class ChatRoomModule {}

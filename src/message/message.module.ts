import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schemas/message.schema';
import { ChatRoomModule } from 'src/chat-room/chat-room.module';

@Module({
  imports:[
    MongooseModule.forFeature([{
      schema: MessageSchema,
      name: Message.name
    }]),
    ChatRoomModule
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports:[MessageService]
})
export class MessageModule {}

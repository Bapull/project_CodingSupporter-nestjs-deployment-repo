import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schemas/message.schema';

@Module({
  imports:[
    MongooseModule.forFeature([{
      schema: MessageSchema,
      name: Message.name
    }])
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports:[MessageService]
})
export class MessageModule {}

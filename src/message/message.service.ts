import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/message.schema';
import { Model } from 'mongoose'

@Injectable()
export class MessageService {
  constructor(@InjectModel(Message.name) private messageModel: Model<Message>){}
  async create(createMessageDto: CreateMessageDto) {
    const createdMessage = new this.messageModel(createMessageDto);
    return await createdMessage.save()
  }

  async findAll(room:number) {
    return await this.messageModel.find({room:room}).exec();
  }

}

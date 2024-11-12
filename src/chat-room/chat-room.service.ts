import { Injectable } from '@nestjs/common';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatRoomService {
  constructor(@InjectRepository(ChatRoom) private readonly chatRoomRepository:Repository<ChatRoom>){}
  async create(dto: CreateChatRoomDto) {
    const newChatRoom = await this.chatRoomRepository.create(dto)
    return await this.chatRoomRepository.save(newChatRoom)
  }

  async findAll(userId: string) {
    const receivce = await this.chatRoomRepository
    .createQueryBuilder('chatroom')
    .select('chatroom.id AS id, chatroom.receiver AS receiver, chatroom.sender AS sender')
    .where(`receiver=${userId}`)
    .orWhere(`sender=${userId}`)
    .getRawMany()

    return receivce
  }

  async findOne(id: number) {
    return await this.chatRoomRepository
    .findOneBy({id:id})
  }
}

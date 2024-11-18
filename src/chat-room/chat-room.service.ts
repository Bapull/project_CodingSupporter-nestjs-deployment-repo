import { Injectable } from '@nestjs/common';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { ChatRoom } from './entities/chat-room.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class ChatRoomService {
  constructor(
    private readonly dataSource: DataSource
  ){}
  async create(dto: CreateChatRoomDto) {
    const queryRunner = await this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try{
      await queryRunner.manager.save(ChatRoom, dto)
      await queryRunner.commitTransaction()
    }catch(e){
      queryRunner.rollbackTransaction()
      console.error(e)
      throw e
    }finally{
      queryRunner.release()
    }
  }

  async findAll(userId: string) {
    const receivce = await this.dataSource.createQueryBuilder()
    .from(ChatRoom,'chatroom')
    .select('chatroom.id AS id, chatroom.receiver AS receiver, chatroom.sender AS sender')
    .where(`receiver=${userId}`)
    .orWhere(`sender=${userId}`)
    .getRawMany()

    return receivce
  }

  async findOne(id: number) {
    return await this.dataSource.manager.findOneBy(ChatRoom,{id:id})
  }
}

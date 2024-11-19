import { Injectable } from '@nestjs/common';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { ChatRoom } from './entities/chat-room.entity';
import { DataSource } from 'typeorm';
import { IncorrectNote } from 'src/incorrect-note/entities/incorrect-note.entity';

@Injectable()
export class ChatRoomService {
  constructor(
    private readonly dataSource: DataSource
  ){}
  async create(dto: CreateChatRoomDto, noteId:number) {
    const queryRunner = await this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try{
      const chatRoom = await queryRunner.manager.save(ChatRoom, dto)
      await queryRunner.manager.update(IncorrectNote,{id:noteId},{mentoId:dto.receiver, chatName:chatRoom.id})
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
    .innerJoin(IncorrectNote, 'note', 'note.chatName = chatroom.id')
    .select('chatroom.id AS id, chatroom.receiver AS receiver, chatroom.sender AS sender, note.noteName as noteName')
    .where(`receiver=${userId}`)
    .orWhere(`sender=${userId}`)
    .getRawMany()

    return receivce
  }

  async findOne(id: number) {
    return await this.dataSource.manager.findOneBy(ChatRoom,{id:id})
  }
}

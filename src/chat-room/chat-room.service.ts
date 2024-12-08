import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { ChatRoom } from './entities/chat-room.entity';
import { DataSource } from 'typeorm';
import { IncorrectNote } from 'src/incorrect-note/entities/incorrect-note.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatRoomService {
  FRONTEND_URL;
  constructor(
    private readonly dataSource: DataSource,
    private readonly config:ConfigService
  ){this.FRONTEND_URL = config.get<string>('FRONTEND_URL')}
  async create(dto: CreateChatRoomDto, noteId:number) {
    const queryRunner = await this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try{
      const note = await this.dataSource.manager.findOneBy(IncorrectNote,{id:noteId})
      if(note.studentId != dto.sender){
        throw new ForbiddenException('권한이 없습니다.')
      }
      if(note.mentoId){
        throw new BadRequestException('이미 멘토가 설정된 오답노트 입니다.')
      }
      const chatRoom = await queryRunner.manager.save(ChatRoom, dto)
      
      await queryRunner.manager.update(IncorrectNote,{id:noteId},{mentoId:dto.receiver, chatName:chatRoom.id})

      const notification = await queryRunner.manager.create(Notification)
      notification.message = '새로운 채팅방이 생성되었습니다.'
      notification.type = 'newRoom'
      notification.userId = dto.receiver
      notification.link = `${this.FRONTEND_URL}/mentchat/${chatRoom.id}`
      await queryRunner.manager.save(Notification,notification)

      await queryRunner.commitTransaction()
    }catch(e){
      await queryRunner.rollbackTransaction()
      throw e
    }finally{
      await queryRunner.release()
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

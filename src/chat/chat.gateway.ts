import { SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket, MessageBody, WsException } from '@nestjs/websockets';
import { Message, Room } from '../common/types';
import { Server,Socket } from 'socket.io';
import { MessageService } from 'src/message/message.service';
import { UseGuards } from '@nestjs/common';
import { ChatGuard } from './chat.guard';
import { ChatRoomService } from 'src/chat-room/chat-room.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL
  }
})
export class ChatGateway {
  constructor(
    private readonly messageService:MessageService,
    private readonly chatRoomService:ChatRoomService
  ){}
  @WebSocketServer()
  server: Server;

  @UseGuards(ChatGuard)
  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: Message
  ): Promise<void> {

    const rooms:Room[] = await this.chatRoomService.findAll(client.data)
    let isFind:boolean = false
    const roomNumber:number = parseInt(message.room)
    for (let index = 0; index < rooms.length; index++) {
      const element = rooms[index];
      if(element.id = roomNumber){
        isFind = true
        break
      }
    }
    if(!isFind){
      throw new WsException('권한이 없습니다.')
    }
    

    client.join(message.room);  
    client.emit('join_room', message);
    
    await this.messageService.create({
      message: `${message.sender}가 접속했습니다.`,
      room: message.room,
      sender: 'server',
    })

    this.server.to(message.room).emit('message',{
      message:`${message.sender}가 접속했습니다.`,
      sender:'server',
      room:message
    });
  }

  @SubscribeMessage('leave_room')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: Message
  ): Promise<void> {
    client.leave(message.room);
    client.emit('leave_room', message.room);
    
    await this.messageService.create({
      message: `${message.sender}가 나갔습니다.`,
      room: message.room,
      sender: 'server',
    })
    this.server.to(message.room).emit('message', {
      message:`${message.sender}가 나갔습니다.`,
      sender:'server',
      room:message
    });
  }

  @SubscribeMessage('message') 
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: Message
  ): Promise<void> {
    if(client.rooms.has(message.room)) {
      await this.messageService.create(message)
      this.server.to(message.room).emit('message', message);
    }
  }
}

import { SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket, MessageBody, WsException } from '@nestjs/websockets';
import { Message, Room } from '../common/types';
import { Server,Socket } from 'socket.io';
import { MessageService } from 'src/message/message.service';
import { UseGuards } from '@nestjs/common';
import { ChatGuard } from './chat.guard';
import { ChatRoomService } from 'src/chat-room/chat-room.service';
import { NotificationService } from 'src/notification/notification.service';
import { Notification } from 'src/notification/entities/notification.entity';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL
  }
})
export class ChatGateway {
  FRONTEND_URL;
  constructor(
    private readonly messageService:MessageService,
    private readonly chatRoomService:ChatRoomService,
    private readonly notificationService:NotificationService,
    private readonly config:ConfigService
  ){this.FRONTEND_URL = config.get<string>('FRONTEND_URL')}
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
      room: +message.room,
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
      room: +message.room,
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
      await this.messageService.create({...message, room:Number(message.room)})

      const roomSockets = await this.server.in(message.room).fetchSockets()
      if(roomSockets.length === 1){
        const room = await this.chatRoomService.findOne(+message.room)
        const newNotification = new Notification()
        newNotification.message = message.message
        newNotification.userId = room.receiver == +message.senderId ? room.sender : room.receiver
        newNotification.type = 'newMessage'
        newNotification.link = `${this.FRONTEND_URL}/mentchat/${room.id}`
        await this.notificationService.create(newNotification)
      }

      this.server.to(message.room).emit('message', message);
    }
  }
}

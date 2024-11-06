import { SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Message } from '../utils/types';
import { Server,Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL
  }
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: Message
  ): void {
    client.join(message.room);  
    console.log(client.request)
    client.emit('join_room', message);
    this.server.to(message.room).emit('message',{
      message:`${message.sender}유저가 접속했습니다.`,
      sender:'server',
      room:message
    });
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: Message
  ): void {
    client.leave(message.room);
    client.emit('leave_room', message.room);
    this.server.to(message.room).emit('message', {
      message:`${message.sender}유저가 나갔습니다.`,
      sender:'server',
      room:message
    });
  }

  @SubscribeMessage('message') 
  handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: Message
  ): void {
    if(client.rooms.has(message.room)) {
      this.server.to(message.room).emit('message', message);
    }
  }
}

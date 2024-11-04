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
    @MessageBody() message: string
  ): void {
    client.join(message);  
    console.log(client.request)
    client.emit('join_room', message);
    this.server.to(message).emit('message',{
      message:`${client.id}유저가 접속했습니다.`,
      sender:'',
      room:message
    });
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: string
  ): void {
    client.leave(message);
    client.emit('leave_room', message);
    this.server.to(message).emit('message', {
      message:`${client.id}유저가 나갔습니다.`,
      sender:'',
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

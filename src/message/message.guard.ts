import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ChatRoomService } from 'src/chat-room/chat-room.service';

@Injectable()
export class MessageGuard implements CanActivate {
  constructor(private readonly chatroomService:ChatRoomService){}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const room = request.params.room
    const userId = request.user.id
    
    const chatRoom = await this.chatroomService.findOne(room)

    if(chatRoom.receiver == userId || chatRoom.sender == userId){
      return true
    }
      
    
    throw new UnauthorizedException('해당 방의 메시지를 불러올 권한이 없습니다.');
  }
}

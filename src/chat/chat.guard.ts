import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as cookie from 'cookie'
import { AuthService } from 'src/auth/auth.service';
import { ChatRoomService } from 'src/chat-room/chat-room.service';

@Injectable()
export class ChatGuard implements CanActivate {
  constructor(
    private readonly authService:AuthService
  ){}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>{
    const client = context.switchToWs().getClient()

    const cookies = cookie.parse(client.handshake.headers.cookie || '')
    const connectSid = cookies['connect.sid']

    if(!connectSid){
      return false;
    }

    const decodedSid = decodeURIComponent(connectSid)
    const sessionId = decodedSid.split('.')[0].replace('s:','')

    const userId = await this.authService.findUserBySessionId(sessionId)

    if(!userId){
      return false;
    }
    client.data = userId
    return true
  }
}

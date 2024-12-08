import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { SessionData, UserDetails } from 'src/common/types';
import { createClient } from "redis";

@Injectable()
export class AuthService {
  private redisClient;
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ){
    this.redisClient = createClient({
      url: configService.get<string>('REDIS_URL')
    })
    this.redisClient.connect().catch(console.error)
  }

  async validateUser(details: UserDetails){
    const user = await this.userService.findOneByGoogleId(details.googleId)
    if(user) return user;
    return await this.userService.createNewUser({
      name:details.name,
      useLanguage:'[]',
      position:0,
      profilePicture: details.profilePicture,
      googleId: details.googleId
    })
  }

  async findUser(id: string){
    const user = await this.userService.findOneByGoogleId(id)
    return user
  }

  async findUserById(id:number){
    const user = await this.userService.findOneById(id)
    return user
  }

  async findUserBySessionId(sessionId: string){
    try{
      const sessionData = await this.redisClient.get(`sess:${sessionId}`)

      if(!sessionData){
        return 'sessionData 가 없습니다.'
      }

      const session = JSON.parse(sessionData)

      if (!session || !session.passport || !session.passport.user) {
        return null;  // 유저 정보가 없으면 null 반환
      }

      const userId = session.passport.user;
      const user = await this.userService.findOneById(userId);

      return user.id
    }catch(error){
      console.error(error)
      return null
    }
  }

  async deleteSession(sessionId:string){
    try{
      await this.redisClient.del(`sess:${sessionId}`)
    }catch{
      console.error('세션 삭제 실패')
    }
    
  }

  async findAllMento(language:string){
    try{
      let cursor = 0
      const sessions:number[] = [];

      do{
        const reply = await this.redisClient.scan(cursor, 'MATCH','sess:*','COUNT','100')
        cursor = reply['cursor'];
        const keys:string[] = reply['keys'];
        const sessionDatas:number[] = await Promise.all(keys.map(async (key)=>{
          const sessionData = await this.redisClient.get(key)
          console.log(sessionData)
          const json:SessionData = JSON.parse(sessionData)
          return json.passport.user
        }))
        sessions.push(...sessionDatas)
      }while(cursor !== 0 )
      return await this.userService.isMentoAndIsProper(sessions,language)
    }catch(error){
      console.error(error)
      return null
    }
  }
}

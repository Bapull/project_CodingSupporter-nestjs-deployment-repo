import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { SessionData, UserDetails } from 'src/common/types';
import { createClient } from "redis";
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  private redisClient;
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger:LoggerService
  ){
    // redis 클라이언트 생성 및 연결
    this.redisClient = createClient({
      url: configService.get<string>('REDIS_URL')
    })
    this.redisClient.connect().catch(console.error)
  }

  // 유저를 구글 아이디로 확인 후 없으면 생성해서 반환
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

  // session 아이디로 유저 찾기
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
      this.logger.error('error:'+JSON.stringify(error))
      return null
    }
  }

  async deleteSession(sessionId:string){
    try{
      await this.redisClient.del(`sess:${sessionId}`)
    }catch(e){
      this.logger.error('세션 삭제 실패:'+JSON.stringify(e))
    }
    
  }

  async findAllMento(language:string){
    // 캐시에 저장된 멘토 정보 확인 후 있으면 반환
    const value = await this.cacheManager.get(`mento:${language}`);
    if(value){
      return value
    }
    // 캐시에 저장된 멘토 정보가 없다면 멘토 검색
    try{
      let cursor = 0
      const sessions:number[] = [];

      do{
        // 키가 sess: 로 시작하는 세션 정보 검색
        const reply = await this.redisClient.scan(cursor, {MATCH: 'sess:*',COUNT: 100})
        cursor = reply['cursor'];
        const keys:string[] = reply['keys'];
        const sessionDatas:number[] = await Promise.all(keys.map(async (key)=>{
          const sessionData = await this.redisClient.get(key)
          // redis에서 찾은 세션 정보는 json 형식이므로 파싱
          const json:SessionData = JSON.parse(sessionData)
          return json.passport.user
        }))
        sessions.push(...sessionDatas)
      }while(cursor !== 0 )
      // 찾은 유저가 멘토이면서 알맞은 언어정보를 가지고 있는지 확인
      return await this.userService.isMentoAndIsProper(sessions,language)
    }catch(error){
      this.logger.error('error: '+JSON.stringify(error))
      return null
    }
  }
}

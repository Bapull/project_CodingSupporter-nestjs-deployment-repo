import { BadRequestException, Inject, Injectable, LoggerService } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserNameDto } from './dto/update-user-name.dto';
import { UpdateUserLanguageDto } from './dto/update-user-language.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly dataSource:DataSource,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger:LoggerService
  ){}

  async createNewUser(createUserDto: CreateUserDto) {
    const queryRunner = await this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try{
      const user = await queryRunner.manager.save(User,createUserDto)
	    await queryRunner.commitTransaction()
      return user
    }catch(e){
      await queryRunner.rollbackTransaction()
      
      throw new BadRequestException(`${e.sqlMessage}`)
    }finally{
      await queryRunner.release()
    }
  }
  
  async findOneById(id:number){
    return await this.dataSource.manager.findOneBy(User,{id:id})
  }

  async findOneByGoogleId(id:string){
    return await this.dataSource.manager.findOneBy(User,{googleId: id})
  }

  async updateName(id: number, updateUserDto: UpdateUserNameDto) {
    const user = await this.dataSource.manager.findOneBy(User,{id:id})
    if(!user){
      throw new Error('해당 유저를 찾지 못했습니다.')
    }
    Object.assign(user,updateUserDto)

    const queryRunner = await this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try{
     
      await queryRunner.manager.save(User,user)
	    await queryRunner.commitTransaction()
    }catch(e){
      await queryRunner.rollbackTransaction()
      throw new BadRequestException(`${e.sqlMessage}`)
    }finally{
      await queryRunner.release()
    }
  }
  async updateLanguage(id: number, updateUserDto: UpdateUserLanguageDto) {
    const user = await this.dataSource.manager.findOneBy(User,{id:id})
    if(!user){
      throw new Error('해당 유저를 찾지 못했습니다.')
    }
    Object.assign(user,updateUserDto)

    const queryRunner = await this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try{
      await queryRunner.manager.save(User,user)
	    await queryRunner.commitTransaction()
    }catch(e){
      await queryRunner.rollbackTransaction()
      
      throw new BadRequestException(`${e.sqlMessage}`)
    }finally{
      await queryRunner.release()
    }
    
  }
  async updatePosition(id: number) {
    const user = await this.dataSource.manager.findOneBy(User,{id:id})
    if(!user){
      throw new Error('해당 유저를 찾지 못했습니다.')
    }
    if(user.position === 1){
      Object.assign(user,{position:0})
    }else{
      Object.assign(user,{position:1})
    }
    const queryRunner = await this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try{
      await queryRunner.manager.save(User,user)
	    await queryRunner.commitTransaction()
    }catch(e){
      await queryRunner.rollbackTransaction()
      
      throw new BadRequestException(`${e.sqlMessage}`)
    }finally{
      await queryRunner.release()
    }
  }
  // 유저들이 멘토이고 찾고자 하는 언어가 useLanguage에 포함되어있는지 확인
  async isMentoAndIsProper(ids:number[],language:string){
    try{
      // 배열 섞기
      const getRandomItems = (arr, count) => {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, count);
      }
  
      let response = []
      if(ids.length > 0){
        // 멘토이면서 찾고자 하는 language를 가지고 있는지 확인
        const user = await this.dataSource.createQueryBuilder()
        .select('user.id')
        .addSelect('user.name')
        .addSelect('user.useLanguage')
        .addSelect('user.position')
        .addSelect('user.profilePicture')
        .from(User,'user')
        .where('user.position = 1')
        .andWhere('user.id IN (:...ids)',{ids})
        .andWhere('user.useLanguage LIKE :language', {language: `%"${language}"%`})
        .getMany()
        // 세션에서 찾은 사람은 접속중인 사람임으로 isActive:true 정보를 추가
        const appendPropertyUser = user.map((item)=>{
          return {...item, isActive:true}
        })
        response = getRandomItems(appendPropertyUser, 5)
      }
      // 접속중인 멘토가 부족할경우 db에서 추가 탐색
      if(response.length < 5){
        const notActiveUser = await this.dataSource.createQueryBuilder()
        .select('user.id')
        .addSelect('user.name')
        .addSelect('user.useLanguage')
        .addSelect('user.position')
        .addSelect('user.profilePicture')
        .from(User,'user')
        .where('user.useLanguage LIKE :language',{language: `%"${language}"%`})
        .andWhere('user.position = 1')
        .getMany()
        // 찾은 유저중에 접속중인 유저는 제외
        const setNotActiveUser = notActiveUser.filter((item)=>{
          return !ids.includes(item.id)
        })
        // 접속중이지 않은 유저를 부족한 만큼만 결과에 추가
        const shuffledNotActiveUser = getRandomItems(setNotActiveUser, 5 - response.length)
        const appendPropertyNotActive = shuffledNotActiveUser.map((item)=>{
          return {...item, isActive:false} // 접속중이지 않으므로 isActive:false를 추가
        })
        response.push(...appendPropertyNotActive)
      }
      // 캐시 저장
      await this.cacheManager.set(`mento:${language}`, response, 60000);
      return response
    }catch(e){
      if (e instanceof Error) {
        this.logger.error('error :', e.message);
      } else {
        this.logger.error('Unexpected error from user.service isMentoAndIsProper:', e);
      }
    }
  }
}

import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserNameDto } from './dto/update-user-name.dto';
import { UpdateUserLanguageDto } from './dto/update-user-language.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private readonly dataSource:DataSource
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
      console.error(e)
      throw e
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
      console.error(e)
      throw e
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
      console.error(e)
      throw e
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
      console.error(e)
      throw e
    }finally{
      await queryRunner.release()
    }
  }

  async isMentoAndIsProper(ids:number[],language:string){
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
      
      const appendPropertyUser = user.map((item)=>{
        return {...item, isActive:true}
      })
      response = getRandomItems(appendPropertyUser, 5)
    }
    
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
      
      const setNotActiveUser = notActiveUser.filter((item)=>{
        return !ids.includes(item.id)
      })

      const shuffledNotActiveUser = getRandomItems(setNotActiveUser, 5 - response.length)
      const appendPropertyNotActive = shuffledNotActiveUser.map((item)=>{
        return {...item, isActive:false}
      })
      response.push(...appendPropertyNotActive)
    }
    
    
    return response
  }
}

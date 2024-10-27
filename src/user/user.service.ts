import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserNameDto } from './dto/update-user-name.dto';
import { UpdateUserLanguageDto } from './dto/update-user-language.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository:
  Repository<User>){}
  
  async createNewUser(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto)
    return this.userRepository.save(newUser)
  }
  
  async findOneById(id:number){
    return await this.userRepository.findOneBy({id:id})
  }

  async findOneByGoogleId(id:string){
    return await this.userRepository.findOneBy({googleId: id})
  }

  async updateName(id: number, updateUserDto: UpdateUserNameDto) {
    const user = await this.userRepository.findOneBy({id:id})
    if(!user){
      throw new Error('해당 유저를 찾지 못했습니다.')
    }
    Object.assign(user,updateUserDto)
    return await this.userRepository.save(user)
  }
  async updateLanguage(id: number, updateUserDto: UpdateUserLanguageDto) {
    const user = await this.userRepository.findOneBy({id:id})
    if(!user){
      throw new Error('해당 유저를 찾지 못했습니다.')
    }
    Object.assign(user,updateUserDto)
    return await this.userRepository.save(user)
  }
  async updatePosition(id: number) {
    const user = await this.userRepository.findOneBy({id:id})
    if(!user){
      throw new Error('해당 유저를 찾지 못했습니다.')
    }
    if(user.position === 1){
      Object.assign(user,{position:0})
    }else{
      Object.assign(user,{position:1})
    }
    return await this.userRepository.save(user)
  }
}

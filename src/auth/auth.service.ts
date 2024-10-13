import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserDetails } from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository:
    Repository<User>){}
  async validateUser(details: UserDetails){
    console.log(details);
    const user = await this.userRepository.findOneBy({
      googleId: details.googleId
    })
    if(user) return user;
    const newUser = this.userRepository.create({
      name:details.name,
      useLanguage:'[]',
      position:0,
      profilePicture: details.profilePicture,
      googleId: details.googleId
    })
    return this.userRepository.save(newUser)
  }

  async findUser(id: string){
    const user = await this.userRepository.findOneBy({googleId: id})
    return user
  }
}

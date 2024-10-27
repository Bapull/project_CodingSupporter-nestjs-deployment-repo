import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { UserDetails } from 'src/utils/types';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService){}

  async validateUser(details: UserDetails){
    console.log(details);
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
}

import { Controller, Get, Post, Req, Res, Session, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './utils/Guards';
import { Request } from 'express';
@Controller('auth')
export class AuthController {

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLogin(){
    return 'hello';
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  handleRedirect(@Req() request: Request, @Res() response) {
    response.redirect('https://localhost:5173/user')
  }
  
  @Get('status')
  user(@Req() request){
    if(request.user) {
      return request.user
    }else {
      return {'message':'no'}
    }
  }

  @Get('logout')
  logout(@Req() res,@Session() session) {
    session.destroy();
    res.clearCookie('connect.sid', {httpOnly: true})
    return {message:'logout'}
  }
}

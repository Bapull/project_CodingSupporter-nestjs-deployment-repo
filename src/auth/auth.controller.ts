import { Body, Controller, Get, Headers, Post, Query, Req, Res, Session, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './google/google-auth.guard';
import { Request, Response } from 'express';
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { String } from 'aws-sdk/clients/apigateway';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService:AuthService){}

  @ApiOperation({ summary: '구글 로그인 페이지로 이동' })
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLogin(){
    return 'hello';
  }

  @ApiExcludeEndpoint()
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  handleRedirect(@Req() request: Request, @Res() response) {
    response.redirect('https://localhost:5173/user')
  }

  @ApiOperation({ summary: '로그아웃' })
  @Get('logout')
  async logout(@Res() res:Response, @Req() request) {
    const sessionId:String = request.cookies['connect.sid']
    await this.authService.deleteSession(sessionId.split('.')[0].replace('s:',''))
    res.clearCookie('connect.sid')
    return res.json({message:'logout'})
  }
}

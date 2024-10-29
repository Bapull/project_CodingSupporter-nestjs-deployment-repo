import { Controller, Get, Req, Res, Session, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './utils/Guards';
import { Request } from 'express';
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

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
  logout(@Res() res,@Session() session) {
    session.destroy();
    res.clearCookie('connect.sid', {httpOnly: true})
    return res.json({message:'logout'})
  }
}

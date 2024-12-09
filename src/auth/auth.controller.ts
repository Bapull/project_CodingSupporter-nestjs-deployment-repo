import { Body, Controller, Get, Headers, HttpStatus, Post, Query, Req, Res, Session, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './google/google-auth.guard';
import { Request, Response } from 'express';
import { ApiExcludeEndpoint, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { ApiUnauthorizedResponses } from 'src/common/api-response.decorator';
import { ConfigService } from '@nestjs/config';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  FRONTEND_URL;
  constructor(private readonly authService:AuthService,
    private readonly configService:ConfigService,
  ){this.FRONTEND_URL = configService.get<string>('FRONTEND_URL')}

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
    response.redirect(`${this.FRONTEND_URL}/user`)
  }

  @ApiOperation({ summary: '로그아웃' })
  @Get('logout')
  async logout(@Res() res:Response, @Req() request) {
    const sessionId:String = request.cookies['connect.sid']
    await this.authService.deleteSession(sessionId.split('.')[0].replace('s:',''))
    res.clearCookie('connect.sid')
    return res.json({message:'logout'})
  }

  @ApiOperation({summary:'멘토 5명 정보 호출'})
  @ApiQuery({
    name:'language',
    description:'요청할 멘토의 언어',
    example:'Java'
  })
  @ApiResponse({
    status:HttpStatus.OK,
    description:'멘토의 정보 배열, isActive는 현재 접속중인 유저인지 아닌지를 나타냄. 만약 세션에 조건에 맞는 멘토가 5명 이상이라면 접속중인 멘토만 반환하고, 부족하면 부족한 분 만큼 디비에서 찾아서 추가함',
    example:{
      'message':'멘토 정보를 성공적으로 불러왔습니다.',
      'info': [
        {
          id:'1',
          name:'문성윤',
          useLanguage:'[\"Java\",\"Python\"]',
          position:1,
          profilePicture:'http://imgurl.com',
          isActive:true
        }
      ]
    }
  })
  @ApiUnauthorizedResponses()
  @UseGuards(AuthGuard)
  @Get('mento')
  async getFiveMento(@Query('language') language:string){
    return {
      message:'멘토 정보를 성공적으로 불러왔습니다.',
      info: await this.authService.findAllMento(language)
    }
  }
}

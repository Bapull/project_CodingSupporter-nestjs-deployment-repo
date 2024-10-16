import { Controller, Get, Post, Body, Patch, Req, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { AttendanceService } from 'src/attendance/attendance.service';
import { IncorrectNoteService } from 'src/incorrect-note/incorrect-note.service';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserNameDto } from './dto/update-user-name.dto';
import { UpdateUserLanguageDto } from './dto/update-user-language.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly attendanceService: AttendanceService,
    private readonly incorrectNoteService: IncorrectNoteService
  ) {}

  @ApiOperation({summary:'유저 정보 호출'})
  @ApiResponse({
    status:200,
    description:"유저정보",
    example:{
      'message':'유저 정보를 성공적으로 불러왔습니다.',
      'info': {
        "id": 1,
        "name": "문성윤",
        "useLanguage": ["Java","Python"],
        "position": 0,
        "profilePicture": "https://lh3.googleusercontent.com/a/ACg8ocIzUC27IVCdapdhE5L-jYipixipbLvP1u6DeXFnl3QzIqDV2w=s96-c",
        "googleId": "107458270040176628474"
      }
    }
  })
  @ApiResponse({
    status:401,
    description:'로그인 필요',
    example:{
      'message':'로그인이 필요합니다.'
    }
  })
  @Get('info')
  user(@Req() request){
    if(request.user) {
      return {
        'message':'유저 정보를 성공적으로 불러왔습니다.',
        'info': request.user
      }
    }else {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }
  }

  @ApiOperation({ summary: '해당 유저의 모든 출석정보' })
  @ApiResponse({
    status: 200,
    description: '출석정보',
    example:{
      message:'출석체크 정보를 불러왔습니다.',
      attendance: ["2024-10-05","2024-10-06","2024-10-07"]
    }
  })
  @ApiQuery({
    name:'id',
    example:1,
    description:'유저의 아이디'
  })
  @Get('attendance')
  async attendanceGraph(@Req() request){
    if(request.user) {
      return {
        'message':'유저 출석정보를 성공적으로 불러왔습니다.',
        'attendance': await this.attendanceService.findAll(request.user.id)
      }
    }else {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }
  }

  @ApiOperation({ summary: '출석체크 추가' })
  @ApiResponse({
    status: 201,
    description: '출석체크 완료',
    example:{
      message:'출석체크를 완료했습니다.',
    }
  })
  @ApiResponse({
    status: 401,
    description: '로그인 필요',
    example:{message:'로그인이 필요합니다.'}
  })
  @Post('attendance')
  async makeAttendance(@Req() request){
    const date = new Date()
    await this.attendanceService.create({
      userId:request.user.id,
      checkInTime: date
    })
    if(request.user) {
      return {
        'message':'출석체크를 완료했습니다.'
      }
    }else {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }
  }

  @ApiOperation({ summary: '그래프 정보 호출' })
  @ApiResponse({
    status: 200,
    description: '그래프 정보 호출 완료',
    example:{
      message:'유저 그래프 정보를 성공적으로 불러왔습니다.',
      data:{
        java: 2,
        python: 3,
        javascript: 8
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: '로그인 필요',
    example:{message:'로그인이 필요합니다.'}
  })
  @Get('graph')
  async graphInfo(@Req() request) {
    if(request.user) {
      return {
        'message':'유저 그래프 정보를 성공적으로 불러왔습니다.',
        'data': await this.incorrectNoteService.graphInfo(request.user.id, request.user.position)
      }
    }else {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }
  }

  @ApiOperation({summary:'유저 이름 수정'})
  @ApiBody({
    schema:{
      type:'object',
      properties:{
        name:{
          type: 'string',
          description:'바꿀 유저 이름'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: '이름변경 완료',
    example:{message:'이름이 변경되었습니다.'}
  })
  @ApiResponse({
    status: 401,
    description: '로그인 필요',
    example:{message:'로그인이 필요합니다.'}
  })
  @Patch('name')
  async changeName(@Req() request, @Body() dto:UpdateUserNameDto){
    if(request.user) {
      await this.userService.updateName(request.user.id, dto)
      return {
        'message':'유저의 이름을 변경했습니다.',
      }
    }else {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }
  }

  @ApiOperation({summary:'유저 사용 언어 수정'})
  @ApiBody({
    schema:{
      type:'object',
      properties:{
        language:{
          type: 'string',
          description:'바꿀 유저 언어 배열',
          example:"['Java']"
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: '언어변경 완료',
    example:{message:'유저의 언어를 변경했습니다.'}
  })
  @ApiResponse({
    status: 400,
    description: 'body가 올바르지 않은 경우',
    example:{
      message: "useLanguage는 문자열 배열을 따옴표로 감싼 형태여야 합니다.",
      error: "Bad Request",
      statusCode: 400
    }
  })
  @ApiResponse({
    status: 401,
    description: '로그인 필요',
    example:{message:'로그인이 필요합니다.'}
  })
  @Patch('language')
  async changeLanguage(@Req() request, @Body() dto:UpdateUserLanguageDto){
    if(request.user) {
      try{
        JSON.parse(dto.useLanguage)
        await this.userService.updateLanguage(request.user.id, dto)
        return {
          'message':'유저의 언어를 변경했습니다.',
        }
      }catch(e){
        throw new BadRequestException('useLanguage는 문자열 배열을 따옴표로 감싼 형태여야 합니다.');
      }
    }else {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }
  }
}

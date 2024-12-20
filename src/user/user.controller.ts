import { Controller, Get, Post, Body, Patch, Req, BadRequestException, UnauthorizedException, HttpStatus, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { AttendanceService } from 'src/attendance/attendance.service';
import { IncorrectNoteService } from 'src/incorrect-note/incorrect-note.service';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserNameDto } from './dto/update-user-name.dto';
import { UpdateUserLanguageDto } from './dto/update-user-language.dto';
import { ApiUnauthorizedResponses, ApiErrorResponse, ApiResponseMessage } from 'src/common/api-response.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { STATUS_CODES } from 'http';

@ApiTags('user')
@Controller('user')
@ApiUnauthorizedResponses()
@UseGuards(AuthGuard)
@ApiErrorResponse('요청을 처리하지 못했습니다.')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly attendanceService: AttendanceService,
    private readonly incorrectNoteService: IncorrectNoteService
  ) {}

  @ApiOperation({summary:'유저 정보 호출'})
  @ApiResponse({
    status:HttpStatus.OK,
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
  @Get('info')
  user(@Req() request){
    return {
      'message':'유저 정보를 성공적으로 불러왔습니다.',
      'info': request.user
    }
  }

  @ApiOperation({ summary: '해당 유저의 모든 출석정보' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '출석정보',
    example:{
      message:'출석체크 정보를 불러왔습니다.',
      attendance: ["2024-10-05","2024-10-06","2024-10-07"]
    }
  })
  @Get('attendance')
  async attendanceGraph(@Req() request){
    return {
      'message':'유저 출석정보를 성공적으로 불러왔습니다.',
      'attendance': await this.attendanceService.findAll(request.user.id)
    }
  }

  @ApiOperation({ summary: '출석체크 추가' })
  @ApiResponseMessage('출석체크 완료', HttpStatus.CREATED, '출석체크를 완료했습니다.')
  @ApiResponseMessage('이미 출석체크를 했습니다.', HttpStatus.BAD_REQUEST, '이미 출석체크를 했습니다.')
  @Post('attendance')
  async makeAttendance(@Req() request) {
    try{
      await this.attendanceService.create(request.user.id);
      return {
        'message':'출석체크를 완료했습니다.'
      }
    }catch{
      throw new BadRequestException('이미 출석체크를 했습니다.');
    }
    
    
  }

  @ApiOperation({ summary: '그래프 정보 호출' })
  @ApiResponse({
    status: HttpStatus.OK,
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
  @Get('graph')
  async graphInfo(@Req() request) {
    return {
      'message':'유저 그래프 정보를 성공적으로 불러왔습니다.',
      'data': await this.incorrectNoteService.graphInfo(request.user.id, request.user.position)
    }
  }

  @ApiOperation({summary:'에러 타입 개수 불러오기'})
  @ApiResponse({
    status: HttpStatus.OK,
    description:'에러정보 호출 완료',
    example:{
      message:'에러 정보를 성공적으로 불러왔습니다.',
      errorInfo:{
        "1":8,
        "2":7,
        "3":7,
        "4":4
      }
    }
  })
  @Get('error-info')
  async errorInfo(@Req() request){
    return {
      message:'에러 정보를 성공적으로 불러왔습니다.',
      errorInfo: await this.incorrectNoteService.errorInfo(request.user.id, request.user.position)
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
  @ApiResponseMessage('이름변경 완료', HttpStatus.OK, '이름이 변경되었습니다.')
  @Patch('name')
  async changeName(@Req() request, @Body() dto:UpdateUserNameDto){
    await this.userService.updateName(request.user.id, dto)
    return {
      'message':'유저의 이름을 변경했습니다.',
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
  @ApiResponseMessage('언어변경 완료', HttpStatus.OK, '언어를 변경했습니다.')
  @ApiResponseMessage('body가 올바르지 않은 경우', HttpStatus.BAD_REQUEST, 'useLanguage는 문자열 배열을 따옴표로 감싼 형태여야 합니다.')
  @Patch('language')
  async changeLanguage(@Req() request, @Body() dto:UpdateUserLanguageDto){
    try{
      JSON.parse(dto.useLanguage)
      await this.userService.updateLanguage(request.user.id, dto)
      return {
        'message':'유저의 언어를 변경했습니다.',
      }
    }catch(e){
      throw new BadRequestException('useLanguage는 문자열 배열을 따옴표로 감싼 형태여야 합니다.');
    }
  }

  @ApiOperation({summary:'유저 역할 변경(튜터에서 튜티로, 튜티에서 튜터로)'})
  @ApiResponseMessage('역할변경 완료', HttpStatus.OK, '역할을 변경했습니다.')
  @Patch('position')
  async changePosition(@Req() request){
    await this.userService.updatePosition(request.user.id)
      return {
        'message':'유저의 역할을 변경했습니다.',
      }
  }
}

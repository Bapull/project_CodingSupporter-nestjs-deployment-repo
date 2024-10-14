import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AttendanceService } from 'src/attendance/attendance.service';
import { IncorrectNoteService } from 'src/incorrect-note/incorrect-note.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly attendanceService: AttendanceService,
    private readonly incorrectNoteService: IncorrectNoteService
  ) {}

  @Get('info')
  user(@Req() request){
    if(request.user) {
      return {
        'message':'유저 정보를 성공적으로 불러왔습니다.',
        'info': request.user
      }
    }else {
      return {'message':'로그인이 필요합니다.'}
    }
  }

  @Get('attendance')
  async attendanceGraph(@Req() request){
    if(request.user) {
      return {
        'message':'유저 출석정보를 성공적으로 불러왔습니다.',
        'attendance': await this.attendanceService.findAll(request.user.id)
      }
    }else {
      return {'message':'로그인이 필요합니다.'}
    }
  }

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
      return {'message':'로그인이 필요합니다.'}
    }
  }

  @Get('graph')
  async graphInfo(@Req() request) {
    if(request.user) {
      return {
        'message':'유저 그래프 정보를 성공적으로 불러왔습니다.',
        'data': await this.incorrectNoteService.graphInfo(request.user.id, request.user.position)
      }
    }else {
      return {'message':'로그인이 필요합니다.'}
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}

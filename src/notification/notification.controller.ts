import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseGuards, HttpStatus } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { request } from 'http';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiUnauthorizedResponses, ApiErrorResponse, ApiResponseMessage } from 'src/utils/swagger';
import { AuthGuard } from 'src/auth/auth.guard';


@ApiTags('notification')
@ApiUnauthorizedResponses()
@ApiErrorResponse('요청을 처리하지 못했습니다.')
@Controller('notification')
@UseGuards(AuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({summary:'채팅 요청 알림 생성하기'})
  @ApiQuery({
    name:'id',
    description:'알림을 보낼 유저의 userId',
    example:'4'
  })
  @ApiResponseMessage('알림 생성완료', HttpStatus.CREATED, '알림을 생성했습니다.')
  @Post('chat-request')
  async create(@Req() request, @Query('id') id:string) {
    const newNotification = new CreateNotificationDto();
    newNotification.receiver = id
    newNotification.sender = request.user.id
    newNotification.content = `${request.user.name}님이 채팅을 요청했습니다.`
    await this.notificationService.create(newNotification);
    return {
      message: '알림을 생성했습니다.'
    }
  }


  @ApiOperation({summary:'알림 불러오기'})
  @ApiResponseMessage('해당 유저가 보냈거나, 받은 모든 요청', HttpStatus.CREATED, '알림을 생성했습니다.')
  @Get()
  async findAll(@Req() request) {
    return {
      message:'알림을 성공적으로 불러왔습니다.',
      myId:request.user.id,
      data: await this.notificationService.findAll(request.user.id)
    }
  }

}

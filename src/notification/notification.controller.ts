import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpStatus } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiErrorResponse, ApiResponseMessage } from 'src/common/api-response.decorator';

@ApiTags('notification')
@ApiErrorResponse('요청을 처리하지 못했습니다.')
@ApiUnauthorizedResponse()
@UseGuards(AuthGuard)
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({summary:'알림 생성'})
  @ApiBody({type:CreateNotificationDto})
  @ApiResponseMessage('알림 생성완료',HttpStatus.CREATED,'알림을 생성했습니다.')
  @Post()
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    await this.notificationService.create(createNotificationDto);
    return {
      message:'알림을 생성했습니다.'
    }
  }

  @ApiOperation({summary:'모든 알림 불러오기'})
  @ApiResponse({
    status:HttpStatus.OK,
    description:'알림을 불러옴',
    example:{
      message:'알림을 불러왔습니다.',
      data: [
          {
            id: 13,
            link: "https://localhost:5173/mentchat/3",
            message: "11",
            timestamp: "2024-12-08T12:27:34.575Z",
            type: "newMessage",
            userId: 2,
          }
      ]
    }
  })
  @Get()
  async findAll(@Req() request) {
    return {
      message:'알림을 불러왔습니다.',
      data: await this.notificationService.findAll(request.user.id)
    }
  }

  @ApiOperation({summary:'알림 제거하기'})
  @ApiParam({name:'id',description:'알림의 아이디', example:1})
  @ApiResponseMessage('알림을 제거함',HttpStatus.OK,'알림을 제거했습니다.')
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() request) {
    await this.notificationService.remove(+id, request.user.id);
    return {
      message:'알림을 제거했습니다.'
    }
  }
}

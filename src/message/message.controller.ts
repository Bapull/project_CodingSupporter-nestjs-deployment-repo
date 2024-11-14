import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, HttpStatus, Req } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ApiExcludeEndpoint, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiErrorResponse, ApiResponseMessage } from 'src/common/api-response.decorator';
import { MessageGuard } from './message.guard';

@ApiTags('message')
@Controller('message')
@ApiUnauthorizedResponse()
@UseGuards(AuthGuard)
@ApiErrorResponse('요청을 처리하지 못했습니다.')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiExcludeEndpoint()
  @Post()
  async create(@Body() createMessageDto: CreateMessageDto) {
    return await this.messageService.create(createMessageDto);
  }
  
  @ApiOperation({summary:'해당 방의 채팅데이터 전체 호출'})
  @ApiParam({
    name:'room',
    description:'채팅방 번호',
    example:'1'
  })
  @ApiResponse({
    status:HttpStatus.OK,
    description:'채팅배열',
    example:{
      message:'채팅내역을 불러왔습니다.',
      data: [
        {
          room:1,
          message:'안녕하세요',
          sender:'문성윤',
        }
      ]
    }
  })
  @ApiResponseMessage('해당 채팅방의 참여인원이 아닌 경우',HttpStatus.UNAUTHORIZED,'해당 방의 메시지를 불러올 권한이 없습니다.')
  @UseGuards(MessageGuard)
  @Get(':room')
  async findAll(@Param('room') room:string, @Req() request) {
    return {
      message:'채팅내역을 불러왔습니다.',
      data: await this.messageService.findAll(+room)
    }
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseGuards, HttpStatus } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiUnauthorizedResponses, ApiErrorResponse, ApiResponseMessage } from 'src/utils/swagger';
import { AuthGuard } from 'src/auth/auth.guard';


@ApiTags('chat-room')
@ApiUnauthorizedResponses()
@ApiErrorResponse('요청을 처리하지 못했습니다.')
@Controller('chat-room')
@UseGuards(AuthGuard)
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @ApiOperation({summary:'채팅 요청 알림 생성하기'})
  @ApiQuery({
    name:'id',
    description:'알림을 보낼 유저의 userId',
    example:'4'
  })
  @ApiResponseMessage('알림 생성완료', HttpStatus.CREATED, '채팅방을 생성했습니다.')
  @Post('chat-request')
  async create(@Req() request, @Query('id') id:string) {
    const newChatRoom = new CreateChatRoomDto();
    newChatRoom.receiver = id
    newChatRoom.sender = request.user.id
    await this.chatRoomService.create(newChatRoom);
    return {
      message: '채팅방을 생성했습니다.'
    }
  }


  @ApiOperation({summary:'채팅방 불러오기'})
  @ApiResponse({
    status:HttpStatus.OK,
    description:'채팅방 배열들',
    example:{
      message:'채팅방을 성공적으로 불러왔습니다.',
      myId: 2,
      data:[
        {
            "id": 1,
            "receiver": "2",
            "sender": "1"
        },
        {
            "id": 2,
            "receiver": "2",
            "sender": "1"
        },
        {
            "id": 3,
            "receiver": "2",
            "sender": "2"
        }
      ]
    }
  })
  @Get()
  async findAll(@Req() request) {
    return {
      message:'채팅방을 성공적으로 불러왔습니다.',
      myId:request.user.id,
      data: await this.chatRoomService.findAll(request.user.id)
    }
  }

}

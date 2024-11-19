import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseGuards, HttpStatus } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiUnauthorizedResponses, ApiErrorResponse, ApiResponseMessage } from 'src/common/api-response.decorator';
import { AuthGuard } from 'src/auth/auth.guard';


@ApiTags('chat-room')
@ApiUnauthorizedResponses()
@ApiErrorResponse('요청을 처리하지 못했습니다.')
@Controller('chat-room')
@UseGuards(AuthGuard)
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @ApiOperation({summary:'멘토와, 노트의 아이디를 받아서, 멘토에게 채팅을 요청하고 오답노트 공유가 가능하도록 오답노트 업데이트'})
  @ApiQuery({
    name:'mento-id',
    description:'채팅을 요청할 유저의 userId',
    example:4
  })
  @ApiQuery({
    name:'note-id',
    description:'멘토와 공유할 노트의 아이디',
    example:1
  })
  @ApiResponseMessage('알림 생성완료', HttpStatus.CREATED, '채팅방을 생성했습니다.')
  @ApiResponseMessage('오답노트가 본인의 것이 아닌 경우', HttpStatus.FORBIDDEN, '권한이 없습니다.')
  @ApiResponseMessage('이미 다른 멘토와 공유된 오답노트인 경우', HttpStatus.BAD_REQUEST, '이미 멘토가 설정된 오답노트 입니다.')
  @Post('chat-request')
  async create(@Req() request, @Query('mento-id') mentoId:number, @Query('note-id') noteId:string) {
    await this.chatRoomService.create({receiver: mentoId, sender:request.user.id}, +noteId);
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
            "sender": "1",
            noteName:'노트파일명'
        },
        {
            "id": 2,
            "receiver": "2",
            "sender": "1",
            noteName:'노트파일명'
        },
        {
            "id": 3,
            "receiver": "2",
            "sender": "2",
            noteName:'노트파일명'
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

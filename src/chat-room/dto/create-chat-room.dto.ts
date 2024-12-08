import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class CreateChatRoomDto {
  @ApiProperty({
    name:'sender',
    description:'요청을 보낸 사람의 user id',
    example:1
  })
  @IsString()
  sender:number

  @ApiProperty({
    name:'receiver',
    description:'요청을 받아야 하는 사람의 user id',
    example:1
  })
  @IsString()
  receiver:number

  @ApiProperty({
    name:'noteId',
    description:'이 채팅방에 공유된 노트 아이디',
    example:1
  })
  @IsInt()
  noteId:number

  @ApiProperty({
    name:'noteName',
    description:'이 채팅방에 공유된 노트 이름',
    example:'아 집가고 싶다.md'
  })
  @IsString()
  noteName:string

}

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

  @IsInt()
  noteId:number

  @IsString()
  noteName:string

}

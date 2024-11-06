import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateNotificationDto {
  @ApiProperty({
    name:'sender',
    description:'요청을 보낸 사람의 user id',
    example:'1'
  })
  @IsString()
  sender:string

  @ApiProperty({
    name:'receiver',
    description:'요청을 받아야 하는 사람의 user id',
    example:'1'
  })
  @IsString()
  receiver:string

  @ApiProperty({
    name:'content',
    description:'알림 내용',
    example:'content1'
  })
  @IsString()
  content:string
}

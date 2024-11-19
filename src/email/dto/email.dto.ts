import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class EmailDto{
  @ApiProperty({
    example:'아니 이게 오류가 나면 어떡하나요?',
    description: '사용자가 보낸 문의 내용'
  })
  @IsString()
  content:string

  @ApiProperty({
    example:'borygashill608@gmail.com',
    description:'사용자가 회답을 받을 메일'
  })
  @IsString()
  email:string
}
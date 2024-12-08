import { ApiProperty } from "@nestjs/swagger"
import { IsDate, IsInt, IsString } from "class-validator"

export class CreateNotificationDto {
    @ApiProperty({
        example:'알림에 들어가야할 메시지'
    })
    @IsString()
    message:string

    @ApiProperty({
        description:'알림의 타입',
        example:'newRoom, newMessage'
    })
    @IsString()
    type:string

    @ApiProperty({
        description:'알림이 생성된 시간'
    })
    @IsDate()
    timestamp:Date

    @ApiProperty({
        description:'알림을 받을 유저 아이디'
    })
    @IsInt()
    userId:number

    @ApiProperty({
        description:'추가 링크',
        example:'https://localhost:5173/mentchat/1'
    })
    @IsString()
    link:string
}

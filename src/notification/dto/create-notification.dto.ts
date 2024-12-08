import { IsDate, IsInt, IsString } from "class-validator"

export class CreateNotificationDto {
    @IsString()
    message:string
    @IsString()
    type:string
    @IsDate()
    timestamp:Date
    @IsInt()
    userId:number
    @IsString()
    link:string
}

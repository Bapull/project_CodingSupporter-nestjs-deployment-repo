import { IsNumber, IsString } from "class-validator";

export class CreateAttendanceDto {
  @IsNumber()
  userId:number;
  @IsString()
  checkInTime:string;
}

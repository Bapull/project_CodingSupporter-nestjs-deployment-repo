import { IsString } from "class-validator";

export class UpdateUserNameDto{
  @IsString()
  name:string
}


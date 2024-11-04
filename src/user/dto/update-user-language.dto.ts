import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateUserLanguageDto{
  @ApiProperty({
    description:'바꿀 유저 언어 배열',
    example:"['Java']"
  })
  @IsString()
  useLanguage:string
}

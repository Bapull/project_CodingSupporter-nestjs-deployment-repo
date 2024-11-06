import { IsString } from "class-validator";

export class UpdateUserLanguageDto{
  @IsString()
  useLanguage:string
}

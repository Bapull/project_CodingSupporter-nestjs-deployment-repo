import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LanguageAndErrorTypeDto {
  @ApiProperty({ example: 'Python' })
  @IsString()
  @IsNotEmpty({ message: 'language 쿼리 파라미터가 필요합니다.' })
  language: string;

  @ApiProperty({ example: '1' })
  @IsString()
  @IsNotEmpty({ message: 'error-type 쿼리 파라미터가 필요합니다.' })
  'error-type': string;
} 
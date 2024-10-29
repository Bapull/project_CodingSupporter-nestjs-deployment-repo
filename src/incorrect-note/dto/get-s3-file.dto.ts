import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetS3FileDto {
  @ApiProperty({ example: '오답노트 파일명' })
  @IsString()
  @IsNotEmpty({ message: 'note-name 쿼리 파라미터가 필요합니다.' })
  'note-name': string;
} 
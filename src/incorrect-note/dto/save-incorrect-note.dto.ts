import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, IsIn } from 'class-validator';

export class SaveIncorrectNoteDto {
  @ApiProperty({
    example: 'Python',
    description: '언어'
  })
  @IsString()
  @Matches(/^[A-Za-z]+$/, {
    message: '언어는 영문 알파벳만 사용할 수 있습니다.'
  })
  language: string;

  @ApiProperty({
    example: '1',
    description: '오답 유형'
  })
  @IsIn(['1', '2', '3', '4'], {
    message: 'errorType은 1, 2, 3, 4 중 하나여야 합니다.'
  })
  errorType: string;

  @ApiProperty({
    example: '마크다운 텍스트 파일',
    description: '오답노트 생성시 함께 받은 마크다운 텍스트 파일'
  })
  @IsString()
  mdFile: string
}

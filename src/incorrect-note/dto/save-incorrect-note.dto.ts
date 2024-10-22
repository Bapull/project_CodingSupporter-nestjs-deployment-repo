import { ApiProperty } from "@nestjs/swagger"

export class SaveIncorrectNoteDto {
  @ApiProperty({
    example: "python",
    description: '오답노트 생성시 함께 받은 언어값'
  })
  language:string
  @ApiProperty({
    example: '1',
    description: '오답노트 생성시 함께 받은 에러타입값'
  })
  errorType:string
  @ApiProperty({
    example: '마크다운 텍스트 파일',
    description: '오답노트 생성시 함께 받은 마크다운 텍스트 파일'
  })
  mdFile:string
}

import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateIncorrectNoteDto{
  @ApiProperty({
    example: 1,
    description: '오답노트를 설명해준 멘토의 아이디'
  })
  @IsInt()
  mentoId:  number;
  @ApiProperty({
    example: 1,
    description: '오답노트를 생성한 학생의 아이디'
  })
  @IsInt()
  studentId: number;
  @ApiProperty({
    example: 1,
    description: '오답노트의 에러타입'
  })
  @IsInt()
  errorType: number; 
  @ApiProperty({
    example: 1,
    description: '질문한 프로그래밍 언어'
  })
  @IsString()
  language: string;
  @ApiProperty({
    example: 1,
    description: '노트 파일명'
  })
  @IsString()
  noteName: string;
  @ApiProperty({
    example: 1,
    description: '멘토와 한 채팅명'
  })
  @IsString()
  chatName: string;
}

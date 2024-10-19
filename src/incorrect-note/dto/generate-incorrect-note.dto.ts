import { ApiProperty } from "@nestjs/swagger"

export class GenerateIncorrectNoteDto {
  @ApiProperty({
    example: "#include <stdio.h>\nint main() {\n int a = 10;\n printf(\"%f\",a);\n return 0;\n}",
    description: '사용자가 입력한 코드'
  })
  code:string
  @ApiProperty({
    example: "warning: format '%f' expects argument of type 'double', but argument 2 has type 'int' [-Wformat=]",
    description: '사용자가 입력한 에러'
  })
  error:string
  @ApiProperty({
    example: '이거 왜 안되는거야?',
    description:'사용자가 입력한 질문',
    required: false
  })
  question:string
}
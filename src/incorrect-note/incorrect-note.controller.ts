import { Controller, Get, Post, Body, Param, Delete, HttpStatus, HttpException, Query, Put, UsePipes, ValidationPipe, Req, UnauthorizedException, BadRequestException, UseGuards } from '@nestjs/common';
import { IncorrectNoteService } from './incorrect-note.service';
import { CreateIncorrectNoteDto } from './dto/create-incorrect-note.dto';
import { UpdateIncorrectNoteDto } from './dto/update-incorrect-note.dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GenerateIncorrectNoteDto } from './dto/generate-incorrect-note.dto';
import { LangChainService } from 'src/lang-chain/lang-chain.service'
import { SaveIncorrectNoteDto } from './dto/save-incorrect-note.dto';
import { ApiUnauthorizedResponses, ApiErrorResponse, ApiResponseMessage } from 'src/common/api-response.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetS3FileDto } from './dto/get-s3-file.dto';
import { LanguageAndErrorTypeDto } from './dto/language-and-errortype.dto';


@ApiTags('incorrect-note')
@Controller('incorrect-note')
@ApiUnauthorizedResponses()
@ApiErrorResponse('요청을 처리하지 못했습니다.')
@UseGuards(AuthGuard)
export class IncorrectNoteController {
  constructor(
    private readonly incorrectNoteService: IncorrectNoteService,
    private readonly langChainService: LangChainService
  ) {}

  @ApiOperation({summary:'오답노트 저장하기'})
  @ApiBody({type: SaveIncorrectNoteDto})
  @ApiResponseMessage('오답노트 저장완료', HttpStatus.CREATED, '오답노트를 저장했습니다.')
  @Post('save')
  async saveNote(@Body() dto: SaveIncorrectNoteDto, @Req() request){
    await this.incorrectNoteService.saveNote(dto, request.user.id)
      return {
        message: '오답노트를 저장했습니다.'
      }
  }

  @ApiOperation({summary:'오답노트 생성하기'})
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:'오답노트 생성완료',
    schema: {
      example: {
        message: '오답노트를 생성했습니다.',
        data: {
          language: "C",
          errorType: 2,
          mdFile: '오답노트 텍스트'
        }
      }
    }
  })
  @ApiBody({ type: GenerateIncorrectNoteDto })
  @Post('generate')
  async generate(@Body() dto: GenerateIncorrectNoteDto, @Req() request) {
    try{
      const {json, mdFile} =  await this.langChainService.callModel(dto.code, dto.question)
      return {
        message: '오답노트를 성공적으로 생성했습니다.',
        data: {
          language:json.match(/1\.\s*(\w+)/)[1],
          errorType:json.match(/4\.\s*(\d)/)[1],
          mdFile:mdFile
        }
      }
    }catch{
      return {
        message: '오답노트를 생성하지 못했습니다.',
        data: {
          language:'',
          errorType:'',
          mdFile:'오답노트를 생성하지 못했습니다. 코드에서 문제를 찾지 못했거나, 코드가 너무 짧을 수 있습니다.'
        }
      }
    }
  }

  @ApiOperation({summary:"오답노트 상세 정보 불러오기"})
  @ApiQuery({name:'note-name', example:'오답노트 파일명'})
  @ApiResponse({
    status: HttpStatus.OK,
    description:'오답노트 상세 정보',
    schema: {
      example: {
        message:'오답노트 상세 정보를 성공적으로 불러왔습니다.',
        noteInfo: {
          id: 47,
          mentoId: 1,
          studentId: 4,
          errorType: 2,
          language: "C",
          noteName: "4f87cd39-3497-4d78-bee4-66b0a642c338.md",
          chatName: null
        },
        mdFile: "# 에러 발생\n-------------------\n정수형 변수를 출력할 때 실수형 변수 출력 형식 지정자를 사용했습니다.\n\n# 원인 코드\n-------------------\n```c\nprintf(\"%f\",a);\n```\n\n# 해결 방안\n-------------------\n```c\n#include <stdio.h>\nint main() {\nint a = 10;\nprintf(\"%d\",a);\nreturn 0;}\n```\n\n# 참고\n-------------------\nC에서 다양한 데이터 타입과 이에 맞는 출력 형식 지정자에 대한 지식이 필요합니다."
      }
    }
  })
  @ApiResponseMessage('note-name 쿼리파라미터가 필요함', HttpStatus.BAD_REQUEST, 'note-name 쿼리파라미터가 필요합니다.')
  @Get('s3')
  async getS3File(@Query() query: GetS3FileDto, @Req() request) {
    const {noteInfo, mdFile} = await this.incorrectNoteService.downloadMdFile(query['note-name'], request.user.id, request.user.position)
    return {
      message: '오답노트 상세 정보를 성공적으로 불러왔습니다.',
      noteInfo: noteInfo,
      mdFile: mdFile.Body.toString()
    }
  }

  @ApiOperation({summary:'폴더 정보 불러오기'})
  @ApiResponse({
    status: HttpStatus.OK,
    description:'유저 폴더 정보',
    schema: {
      example: {
        message: '폴더 정보를 성공적으로 불러왔습니다.',
        folder : {
          java: [1,4],
          python: [2,3],
          c: [1,2,3,4]
        }
      }
    }
  })
  @Get('folder')
  async folderCount(@Req() request) {
    return {
      message:'폴더 정보를 성공적으로 불러왔습니다.',
      folder: await this.incorrectNoteService.folder(request.user.id, request.user.position)
    }
  }

  @ApiOperation({summary:'특정 언어와 특정 에러타입의 오답노트들 요청'})
  @ApiQuery({ name: 'language', example: 'Java' })
  @ApiQuery({ name: 'error-type', enum: [1,2,3,4] })
  @ApiResponse({
    status: HttpStatus.OK,
    description:'오답노트 파일 정보 호출 완료',
    schema: {
      example: {
        message:'오답노트 파일 정보를 성공적으로 불러왔습니다.',
        notes: [
          { id: 1, noteName: '노트 파일명' },
          { id: 2, noteName: '노트 파일명' },
          { id: 3, noteName: '노트 파일명' }
        ]
      }
    }
  })
  @ApiResponseMessage('쿼리파라미터가 필요함', HttpStatus.BAD_REQUEST, '쿼리파라미터가 필요합니다.')
  @Get()
  async findByLanguageAndErrorType(
    @Query() query: LanguageAndErrorTypeDto,
    @Req() request
  ) {
    return {
      message:'오답노트 파일 정보를 성공적으로 불러왔습니다.',
      notes: await this.incorrectNoteService.findByLanguageAndErrorType(request.user.id, query['language'], query['error-type'], request.user.position)
    }
  }

  @ApiOperation({summary:"오답노트 수정"})
  @ApiParam({
    name:'id',
    description:'오답노트의 아이디',
    example:'1'
  })
  @ApiResponseMessage('오답노트 수정을 성공한 경우',HttpStatus.OK,'오답노트 정보를 성공적으로 수정했습니다.')
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateIncorrectNoteDto: UpdateIncorrectNoteDto, @Req() request) {
    await this.incorrectNoteService.update(request.user.id, id,updateIncorrectNoteDto);
    return {
      message: '오답노트 정보를 성공적으로 수정했습니다.',
    }
  }

  @ApiOperation({summary:"오답노트 삭제"})
  @ApiParam({
    name:'id',
    description:'오답노트의 아이디',
    example:'1'
  })
  @ApiResponseMessage('오답노트 삭제를 성공한 경우',HttpStatus.OK,'오답노트 정보를 성공적으로 삭제했습니다.')
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() request) {
    await this.incorrectNoteService.remove(request.user.id, id);
    return {
      message: '오답노트 정보를 성공적으로 삭제했습니다.',
    }
  }
}

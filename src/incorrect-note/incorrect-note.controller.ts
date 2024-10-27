import { Controller, Get, Post, Body, Param, Delete, HttpStatus, HttpException, Query, Put, UsePipes, ValidationPipe, Req, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { IncorrectNoteService } from './incorrect-note.service';
import { CreateIncorrectNoteDto } from './dto/create-incorrect-note.dto';
import { UpdateIncorrectNoteDto } from './dto/update-incorrect-note.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GenerateIncorrectNoteDto } from './dto/generate-incorrect-note.dto';
import { LangChainService } from 'src/lang-chain/lang-chain.service'
import { SaveIncorrectNoteDto } from './dto/save-incorrect-note.dto';
import { ApiUnauthorizedResponses, ApiErrorResponse, ApiResponseMessage } from 'src/utils/swagger';



@ApiTags('incorrect-note')
@Controller('incorrect-note')
@ApiUnauthorizedResponses()
@ApiErrorResponse('요청을 처리하지 못했습니다.')
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
    if(request.user){
      await this.incorrectNoteService.saveNote(dto, request.user.id)
      return {
        message: '오답노트를 저장했습니다.'
      }
    }else{
      throw new UnauthorizedException('로그인이 필요합니다.');
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
  async postTest(@Body() dto: GenerateIncorrectNoteDto, @Req() request) {
    if(request.user){
      const {json, mdFile} =  await this.langChainService.callModel(dto.code, dto.question)
      return {
        message: '오답노트를 성공적으로 생성했습니다.',
        data: {
          language:json.match(/1\.\s*(\w+)/)[1],
          errorType:json.match(/4\.\s*(\d)/)[1],
          mdFile:mdFile
        }
      }
    }else{
      throw new UnauthorizedException('로그인이 필요합니다.');
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
  @Get('s3')
  async getS3File(@Query('note-name') noteName:string, @Req() request){
    if(request.user){
      try{
        const {noteInfo, mdFile} = await this.incorrectNoteService.downloadMdFile(noteName, request.user.id, request.user.position)
        return {
          message:'오답노트 상세 정보를 성공적으로 불러왔습니다.',
          noteInfo:noteInfo,
          mdFile:mdFile.Body.toString()
        }
      }catch(error){
        throw new HttpException(
          {
            STATUS_CODES: HttpStatus.BAD_REQUEST,
            message: '오답노트 정보를 불러오지 못 했습니다.',
            error: error.message,
          },
          HttpStatus.BAD_REQUEST,
        )
      }
    }else{
      throw new UnauthorizedException('로그인이 필요합니다.');
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
    if(request.user){
      return {
        message:'폴더 정보를 성공적으로 불러왔습니다.',
        folder: await this.incorrectNoteService.folder(request.user.id, request.user.position)
      }
    }
    else{
      throw new UnauthorizedException('로그인이 필요합니다.');
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
    @Query('language') language: string,
    @Query('error-type') errorType: string,
    @Req() request
  ) {
    if(!language || !errorType){
      throw new BadRequestException('쿼리파라미터가 필요합니다.')
    }
    if(request.user){
      return {
        message:'오답노트 파일 정보를 성공적으로 불러왔습니다.',
        notes: await this.incorrectNoteService.findByLanguageAndErrorType(request.user.id, language, errorType, request.user.position)
      }
    }
    else{
      throw new UnauthorizedException('로그인이 필요합니다.');
    }
  }

  // @ApiOperation({summary:'(테스트용)오답노트 아이디로 오답노트 불러오기'})
  // @Get(':id')
  // async findOne(@Param('id') noteId: string) {
  //   try{
  //     const data = await this.incorrectNoteService.findOne(noteId);
  //     if(!data){
  //       throw new Error('id값에 해당하는 오답노트가 없습니다.')
  //     }
  //     return {
  //       STATUS_CODES: HttpStatus.OK,
  //       message: '오답노트 정보를 성공적으로 불러왔습니다.',
  //       data: data,
  //     }
  //   }catch(error){
  //     throw new HttpException(
  //       {
  //         STATUS_CODES: HttpStatus.BAD_REQUEST,
  //         message: '오답노트 정보를 불러오지 못 했습니다.',
  //         error: error.message,
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     )
  //   }
    
  // }

  @ApiOperation({summary:"(테스트용)오답노트 수정"})
  @Put(':id')
  @UsePipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true}))
  async update(@Param('id') id: string, @Body() updateIncorrectNoteDto: UpdateIncorrectNoteDto) {
    try{
      await this.incorrectNoteService.update(id,updateIncorrectNoteDto);
      return {
        STATUS_CODES: HttpStatus.OK,
        message: '오답노트 정보를 성공적으로 수정했습니다.',
      }
    }catch(error){
      throw new HttpException(
        {
          STATUS_CODES: HttpStatus.BAD_REQUEST,
          message: '오답노트 정보를 수정하지 못 했습니다.',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  @ApiOperation({summary:"(테스트용)오답노트 삭제"})
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try{
      await this.incorrectNoteService.remove(id);
      return {
        STATUS_CODES: HttpStatus.OK,
        message: '오답노트 정보를 성공적으로 삭제했습니다..',
      }
    }catch(error){
      throw new HttpException(
        {
          STATUS_CODES: HttpStatus.BAD_REQUEST,
          message: '오답노트 정보를 삭제하지 못 했습니다.',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  @ApiOperation({summary:"(테스트용)오답노트 추가"})
  @Post()
  @UsePipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true}))
  async create(@Body() createIncorrectNoteDto: CreateIncorrectNoteDto) {
    try{
      await this.incorrectNoteService.create(createIncorrectNoteDto);
      return {
        STATUS_CODES: HttpStatus.CREATED,
        message: '저장이 성공적으로 완료되었습니다.',
      }
    }catch(error){
      throw new HttpException(
        {
          STATUS_CODES: HttpStatus.BAD_REQUEST,
          message: '저장에 실패했습니다',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      )
    }
    
  }

  @ApiOperation({summary:"(테스트용)멘토 아이디로 오답노트 불러오기"})
  @Get('mento')
  async findForMento(@Query('id') mentoId: string) {
    try{
      const data = await this.incorrectNoteService.findForMento(mentoId)
      if(typeof data === 'object' && data.length === 0){
        throw new Error('해당 id의 멘토가 없거나, 아직 답변한 오답노트가 없습니다.')
      }
      return {
        STATUS_CODES: HttpStatus.OK,
        message: '멘토가 답한 오답노트들의 정보를 성공적으로 불러왔습니다.',
        data: data,
      }
    }catch(error){
      throw new HttpException(
        {
          STATUS_CODES: HttpStatus.BAD_REQUEST,
          message: '멘토가 답한 오답노트들의 정보를 불러오지 못 했습니다.',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      )
    }
    
  }

  @ApiOperation({summary:"(테스트용)학생 아이디로 오답노트 불러오기"})
  @Get('student')
  async findForStudent(@Query('id') studentId: string) {
    try{
      const data = await this.incorrectNoteService.findForStudent(studentId)
      if(typeof data === 'object' && data.length === 0){
        throw new Error('해당 id의 학생이 없거나, 아직 만든 오답노트가 없습니다.')
      }
      return {
        STATUS_CODES: HttpStatus.OK,
        message: '학생의 오답노트 정보를 성공적으로 불러왔습니다.',
        data: data,
      }
    }catch(error){
      throw new HttpException(
        {
          STATUS_CODES: HttpStatus.BAD_REQUEST,
          message: '학생의 오답노트 정보를 불러오지 못 했습니다.',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      )
    }
    
  }

  

}

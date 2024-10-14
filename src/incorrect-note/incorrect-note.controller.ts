import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException, Query, Put, UsePipes, ValidationPipe, Req } from '@nestjs/common';
import { IncorrectNoteService } from './incorrect-note.service';
import { CreateIncorrectNoteDto } from './dto/create-incorrect-note.dto';
import { UpdateIncorrectNoteDto } from './dto/update-incorrect-note.dto';

@Controller('incorrect-note')
export class IncorrectNoteController {
  constructor(private readonly incorrectNoteService: IncorrectNoteService) {}

  @Get('folder')
  async folderCount(@Req() request){
    if(request.user){
      return {
        message:'폴더 정보를 성공적으로 불러왔습니다.',
        folder: await this.incorrectNoteService.folder(request.user.id, request.user.position)
      }
    }
    else{
      return {message:'로그인이 필요합니다.'}
    }
  }

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

  @Get()
  async findByLanguageAndErrorType(
    @Query('language') language:string,
    @Query('error-type') errorType:string,
    @Req() request
  ){
      if(request.user){
        return {
          message:'오답노트 파일 정보를 성공적으로 불러왔습니다.',
          notes: await this.incorrectNoteService.findByLanguageAndErrorType(request.user.id, language, errorType, request.user.position)
        }
      }
      else{
        return {message:'로그인이 필요합니다.'}
      }
    }

  @Get(':id')
  async findOne(@Param('id') noteId: string) {
    try{
      const data = await this.incorrectNoteService.findOne(noteId);
      if(!data){
        throw new Error('id값에 해당하는 오답노트가 없습니다.')
      }
      return {
        STATUS_CODES: HttpStatus.OK,
        message: '오답노트 정보를 성공적으로 불러왔습니다.',
        data: data,
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
    
  }

  
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
}

import { ForbiddenException, HttpException, HttpStatus, Inject, Injectable, LoggerService, NotFoundException } from '@nestjs/common';
import { CreateIncorrectNoteDto } from './dto/create-incorrect-note.dto';
import { UpdateIncorrectNoteDto } from './dto/update-incorrect-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IncorrectNote } from './entities/incorrect-note.entity';
import { DataSource, Repository } from 'typeorm';
import { S3Service } from 'src/s3/s3.service';
import { SaveIncorrectNoteDto } from './dto/save-incorrect-note.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';


@Injectable()
export class IncorrectNoteService {
  constructor(
    private readonly dataSource:DataSource,
    private readonly s3Service: S3Service,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger:LoggerService
  ) {}

  async saveNote(dto: SaveIncorrectNoteDto, userId: number) {
    let savedNote = null;
    const queryRunner = await this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try{
      const noteName = (`${dto.id}`+dto.mdFile.match(/-------------------\n(.*)\n/)[1].trim()+'.md').replace('..','.');
      await this.s3Service.uploadMdFile(dto.mdFile,noteName);
      const newNote = new IncorrectNote()
      newNote.language = dto.language,
      newNote.errorType = parseInt(dto.errorType)
      newNote.studentId = userId,
      newNote.noteName = noteName
      savedNote = await queryRunner.manager.save(IncorrectNote, newNote)
      await queryRunner.commitTransaction()
    }catch(e){
      await queryRunner.rollbackTransaction()
      this.logger.error('error: ', JSON.stringify(e))
      throw e
    }finally{
      await queryRunner.release()
    }
    return savedNote
  }

  async downloadMdFile(fileName:string, userId:number, userPosition:number){
    const note = await this.dataSource.manager.findOneBy(IncorrectNote,{
      noteName:fileName
    })
    if(!note){
      throw new NotFoundException('해당이름의 노트가 없습니다.')
    }
    if(userPosition == 1){
      if(note.mentoId != userId){
        throw new ForbiddenException('해당 노트를 조회할 권한이 없습니다.')
      }
    }else{
      if(note.studentId != userId){
        throw new ForbiddenException('해당 노트를 조회할 권한이 없습니다.')
      }
    }
    return {
      noteInfo:note,
      mdFile:await this.s3Service.downloadMdFile(fileName)
    }
  }

  async folder(userId:number, userPosition:number){
    const column = userPosition == 1 ? 'mentoId': 'studentId'
    const count = await this.dataSource.createQueryBuilder()
      .from(IncorrectNote, 'note')    
      .select('note.language')
      .where({[column]:userId})
      .addSelect('GROUP_CONCAT(DISTINCT note.errorType) AS errorTypes')
      .groupBy('note.language')
      .getRawMany();
    

    const result = {}
    for (let index = 0; index < count.length; index++) {
      const element = count[index];
      result[element['note_language']] = element['errorTypes'].split(',').map(Number);
    }
    return result
  }
  
  async errorInfo(userId:number, userPosition:number){
    const column = userPosition == 1 ? 'mentoId': 'studentId'
    const count = await this.dataSource.createQueryBuilder()
    .from(IncorrectNote, 'note')
    .select('note.errorType')
    .addSelect('COUNT(note.id)','count')
    .where({[column]:userId})
    .groupBy('note.errorType')
    .getRawMany()
    
    const result = {}
    for (let index = 0; index < count.length; index++) {
      const element = count[index];
      result[`${element['note_errorType']}`] = parseInt(element['count']);
    }
    return result
  }

  async findByLanguageAndErrorType(id: number, language: string, errorType: string, userPosition: number) {
    const column = userPosition == 1 ? 'mentoId' : 'studentId';
    return await this.dataSource.createQueryBuilder()
      .from(IncorrectNote, 'note')
      .select(['note.id AS id', 'note.noteName AS noteName']) 
      .where({ [column]: id })
      .andWhere({ language: language })
      .andWhere({ errorType: errorType })
      .getRawMany();
  }
  
  
  async update(userId:number, id: string, updateIncorrectNoteDto: UpdateIncorrectNoteDto) {
    
    const note = await this.dataSource.manager.findOneBy(
      IncorrectNote,
      {id:parseInt(id)}
    );
    if(!note){
      throw new Error('id값에 해당되는 노트가 없습니다.')
    }
    if(note.studentId != userId){
      throw new Error('권한이 없습니다.')
    }

    const queryRunner = await this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try{
      await queryRunner.manager.update(IncorrectNote,{id:parseInt(id)},updateIncorrectNoteDto)
	    await queryRunner.commitTransaction()
    }catch(e){
      await queryRunner.rollbackTransaction()
      console.error(e)
      throw e
    }finally{
      await queryRunner.release()
    }
  }

  async remove(userId:number, id: string) {
    const note = await this.dataSource.manager.findOneBy(
      IncorrectNote,
      {id:parseInt(id)}
    );
    if(!note){
      throw new Error('id값에 해당되는 노트가 없습니다.')
    }
    if(note.studentId != userId){
      throw new Error('권한이 없습니다.')
    }
    await this.dataSource.manager.delete(IncorrectNote,{id:parseInt(id)})
  }

  async graphInfo(userId: number,userPosition:number){
    const column = userPosition == 1 ? 'mentoId' : 'studentId';
    const info = await this.dataSource.createQueryBuilder()
    .from(IncorrectNote, 'note')
    .select('note.language')
    .addSelect('COUNT(note.id) AS count')
    .groupBy('note.language')
    .where({[column]:userId})
    .getRawMany()
    const languageCount = {}
    for (let index = 0; index < info.length; index++) {
      const element = info[index];
      languageCount[element['note_language']] = element['count']
    }
    return languageCount
  }

  async getFileNameById(noteId:number){
    const note = await this.dataSource.manager.findOneBy(IncorrectNote,{id:noteId})
    return note.noteName
  }
}

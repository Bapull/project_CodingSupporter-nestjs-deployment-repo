import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateIncorrectNoteDto } from './dto/create-incorrect-note.dto';
import { UpdateIncorrectNoteDto } from './dto/update-incorrect-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IncorrectNote } from './entities/incorrect-note.entity';
import { Repository } from 'typeorm';
import { S3ServiceService } from 'src/s3-service/s3-service.service';
import { SaveIncorrectNoteDto } from './dto/save-incorrect-note.dto';


@Injectable()
export class IncorrectNoteService {
  constructor(@InjectRepository(IncorrectNote) private readonly incorrectRepository:Repository<IncorrectNote>,
    private readonly s3Service: S3ServiceService
  ) {}

  async saveNote(dto: SaveIncorrectNoteDto, userId: number) {
    const noteName = dto.mdFile.match(/-------------------\n(.*)\n/)[1].trim();
    const mdFile = await this.s3Service.uploadMdFile(dto.mdFile,noteName);
    const newNote = await this.incorrectRepository.create({
      language: dto.language,
      errorType: parseInt(dto.errorType),
      studentId: userId,
      mentoId: null,
      noteName: mdFile.Key.replace('incorrect-notes/',''),
      chatName: null
    })
    return await this.incorrectRepository.save(newNote)
  }

  async downloadMdFile(fileName:string, userId:number, userPosition:number){
    const note = await this.incorrectRepository.findOneBy({
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
    const count = await this.incorrectRepository
      .createQueryBuilder('note')
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
  
  async findByLanguageAndErrorType(id: number, language: string, errorType: string, userPosition: number) {
    const column = userPosition == 1 ? 'mentoId' : 'studentId';
    return await this.incorrectRepository.createQueryBuilder('note')
      .select(['note.id AS id', 'note.noteName AS noteName']) 
      .where({ [column]: id })
      .andWhere({ language: language })
      .andWhere({ errorType: errorType })
      .getRawMany();
  }
  

  async create(createIncorrectNoteDto: CreateIncorrectNoteDto) {
    const incorrectNote = this.incorrectRepository.create(createIncorrectNoteDto);
    return await this.incorrectRepository.save(incorrectNote);
  }
  
  async findForMento(mentoId: string){
    const id = parseInt(mentoId);
    if(isNaN(id)){
      throw new HttpException(
        {
          message: 'id가 쿼리파라미터에 없거나 숫자가 아닙니다.',
        },
        HttpStatus.BAD_REQUEST,
      )
    }
    if(id<1){
      throw new HttpException(
        {
          message: 'id는 0보다 큰 숫자여야 합니다.',
        },
        HttpStatus.BAD_REQUEST,
      )
    }
    return await this.incorrectRepository.find({
      where: {mentoId:id}
    });
  }

  async findForStudent(studentId: string){
    const id = parseInt(studentId);
    if(isNaN(id)){
      throw new HttpException(
        {
          message: 'id가 쿼리파라미터에 없거나 숫자가 아닙니다.',
        },
        HttpStatus.BAD_REQUEST,
      )
    }
    if(id<1){
      throw new HttpException(
        {
          message: 'id는 0보다 큰 숫자여야 합니다.',
        },
        HttpStatus.BAD_REQUEST,
      )
    }
    return await this.incorrectRepository.find({
      where: {studentId:id}
    });
  }

  async findOne(noteId: string) {
    const id = parseInt(noteId);
    if(isNaN(id)){
      throw new HttpException(
        {
          message: 'id가 path에 없거나 숫자가 아닙니다.',
        },
        HttpStatus.BAD_REQUEST,
      )
    }
    if(id<1){
      throw new HttpException(
        {
          message: 'id는 0보다 큰 숫자여야 합니다.',
        },
        HttpStatus.BAD_REQUEST,
      )
    }
    return await this.incorrectRepository.findOneBy(
      {id:id}
    );
  }

  async update(id: string, updateIncorrectNoteDto: UpdateIncorrectNoteDto) {
    const note = await this.incorrectRepository.findOneBy(
      {id:parseInt(id)}
    );
    if(!note){
      throw new Error('id값에 해당되는 노트가 없습니다.')
    }
    Object.assign(note,updateIncorrectNoteDto);
    await this.incorrectRepository.save(note)
  }

  async remove(id: string) {
    const note = await this.incorrectRepository.findOneBy(
      {id:parseInt(id)}
    );
    if(!note){
      throw new Error('id값에 해당되는 노트가 없습니다.')
    }
    await this.incorrectRepository.remove(note)
  }

  async graphInfo(userId: number,userPosition:number){
    const column = userPosition == 1 ? 'mentoId' : 'studentId';
    const info = await this.incorrectRepository.createQueryBuilder('note')
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
}

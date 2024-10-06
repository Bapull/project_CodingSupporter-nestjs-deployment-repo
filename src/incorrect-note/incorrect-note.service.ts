import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateIncorrectNoteDto } from './dto/create-incorrect-note.dto';
import { UpdateIncorrectNoteDto } from './dto/update-incorrect-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IncorrectNote } from './entities/incorrect-note.entity';
import { Repository } from 'typeorm';
import { response } from 'express';


@Injectable()
export class IncorrectNoteService {
  constructor(@InjectRepository(IncorrectNote) private readonly incorrectRepository:Repository<IncorrectNote>) {}

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
    const note = await this.findOne(id)
    if(!note){
      throw new Error('id값에 해당되는 노트가 없습니다.')
    }
    Object.assign(note,updateIncorrectNoteDto);
    await this.incorrectRepository.save(note)
  }
d
  async remove(id: string) {
    const note = await this.findOne(id)
    if(!note){
      throw new Error('id값에 해당되는 노트가 없습니다.')
    }
    await this.incorrectRepository.remove(note)
  }
}

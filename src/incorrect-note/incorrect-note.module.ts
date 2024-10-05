import { Module } from '@nestjs/common';
import { IncorrectNoteService } from './incorrect-note.service';
import { IncorrectNoteController } from './incorrect-note.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncorrectNote } from './entities/incorrect-note.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IncorrectNote])],
  controllers: [IncorrectNoteController],
  providers: [IncorrectNoteService],
})
export class IncorrectNoteModule {}

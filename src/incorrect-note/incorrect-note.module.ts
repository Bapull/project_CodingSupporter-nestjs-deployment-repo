import { Module } from '@nestjs/common';
import { IncorrectNoteService } from './incorrect-note.service';
import { IncorrectNoteController } from './incorrect-note.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncorrectNote } from './entities/incorrect-note.entity';
import { LangChainModule } from 'src/lang-chain/lang-chain.module';
import { S3Module } from 'src/s3/s3.module';
@Module({
  imports: [TypeOrmModule.forFeature([IncorrectNote]), LangChainModule, S3Module],
  controllers: [IncorrectNoteController],
  providers: [IncorrectNoteService],
  exports: [IncorrectNoteService]
})
export class IncorrectNoteModule {}

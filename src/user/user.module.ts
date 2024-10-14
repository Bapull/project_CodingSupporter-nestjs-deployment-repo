import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AttendanceService } from 'src/attendance/attendance.service';
import { IncorrectNoteService } from 'src/incorrect-note/incorrect-note.service';
import { AttendanceModule } from 'src/attendance/attendance.module';
import { IncorrectNoteModule } from 'src/incorrect-note/incorrect-note.module';

@Module({
  imports:[AttendanceModule, IncorrectNoteModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

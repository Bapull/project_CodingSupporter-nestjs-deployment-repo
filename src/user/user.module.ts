import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AttendanceModule } from 'src/attendance/attendance.module';
import { IncorrectNoteModule } from 'src/incorrect-note/incorrect-note.module';

@Module({
  imports:[AttendanceModule, IncorrectNoteModule, AttendanceModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

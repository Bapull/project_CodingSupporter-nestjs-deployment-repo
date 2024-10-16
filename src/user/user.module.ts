import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AttendanceModule } from 'src/attendance/attendance.module';
import { IncorrectNoteModule } from 'src/incorrect-note/incorrect-note.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports:[AttendanceModule, IncorrectNoteModule, AttendanceModule, TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService]
})
export class UserModule {}

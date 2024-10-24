import { Injectable } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AttendanceService {
  constructor(@InjectRepository(Attendance) private readonly attendanceRepository:Repository<Attendance>){}
  
  async create(createAttendanceDto: CreateAttendanceDto) {
    const attendance = this.attendanceRepository.create(createAttendanceDto)
    return await this.attendanceRepository.save(attendance)
  }

  async findAll(userId:number) {
    const attendance = await this.attendanceRepository.findBy({userId:userId})
    const dateArray = []
    for (let index = 0; index < attendance.length; index++) {
      const element = attendance[index];
      dateArray.push(element['checkInTime'])
    }
    return dateArray
  }
}

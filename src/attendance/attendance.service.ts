import { Injectable } from '@nestjs/common';
import { Attendance } from './entities/attendance.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly dataSource:DataSource
  ){}
  
  async create(userId: number) {

    const date = new Date();
    const formatter = new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Seoul'
    });
    
    const formattedDate = formatter.format(date).replace(/\. /g, '-').replace('.', '');

    const queryRunner = await this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    
    try{
      await queryRunner.manager.save(Attendance,{userId:userId,checkInTime:formattedDate})
      await queryRunner.commitTransaction()
    }catch(e){
      await queryRunner.rollbackTransaction()
      throw e
    }finally{
      await queryRunner.release()
    }
  }

  async findAll(userId:number) {
    const attendance = await this.dataSource.manager.findBy(Attendance, {userId:userId})
    return attendance.map((item)=>item.checkInTime)
  }
}

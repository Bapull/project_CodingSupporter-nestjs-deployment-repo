import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { DataSource } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    private readonly dataSource:DataSource
  ){}
  async create(createNotificationDto: CreateNotificationDto) {
    const queryRunner = await this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try{
      await queryRunner.manager.save(Notification,createNotificationDto)
      await queryRunner.commitTransaction()
    }catch(e){
      await queryRunner.rollbackTransaction()
      console.error(e)
      throw e
    }finally{
      await queryRunner.release()
    }
  }

  async findAll(userId:number) {
    const notification = await this.dataSource.manager.findBy(Notification, {userId:userId})
    return notification
  }

  async remove(id: number, userId:number) {
    const queryRunner = await this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    
    try{
      const target = await this.dataSource.manager.findOneBy(Notification,{id:id})
      if(target.userId !== userId){
        throw new ForbiddenException('해당 알림에 접근할 권한이 없습니다.')
      }
      await queryRunner.manager.delete(Notification, {id:id})
      await queryRunner.commitTransaction()
    }catch(e){
      await queryRunner.rollbackTransaction()
      throw e
    }finally{
      await queryRunner.release()
    }
  }
}

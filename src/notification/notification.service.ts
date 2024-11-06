import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(@InjectRepository(Notification) private readonly notificationRepository:Repository<Notification>){}
  async create(dto: CreateNotificationDto) {
    const newNotification = await this.notificationRepository.create(dto)
    return await this.notificationRepository.save(newNotification)
  }

  async findAll(userId: string) {
    const receivce = await this.notificationRepository
    .createQueryBuilder('notification')
    .select('notification.id AS id, notification.receiver AS receiver, notification.sender AS sender, notification.content AS content')
    .where(`receiver=${userId}`)
    .orWhere(`sender=${userId}`)
    .getRawMany()

    return receivce
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}

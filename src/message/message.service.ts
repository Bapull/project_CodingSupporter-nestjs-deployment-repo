import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity'
import { DataSource } from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class MessageService {
  constructor(
    private readonly dataSource:DataSource,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger:LoggerService
  ){}
  async create(createMessageDto: CreateMessageDto) {
    const queryRunner = await this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try{
      await queryRunner.manager.save(Message, createMessageDto)
	    await queryRunner.commitTransaction()
    }catch(e){
      await queryRunner.rollbackTransaction()
      this.logger.error('error: ',JSON.stringify(e))
      throw e
    }finally{
      await queryRunner.release()
    }
  }

  async findAll(room:string) {
    return await this.dataSource.manager.findBy(Message, {room:+room})
  }

}

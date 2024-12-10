import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Inject, InternalServerErrorException, LoggerService } from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Catch()
export class HttpFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger:LoggerService
  ){}
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (!(exception instanceof HttpException)) { 
        exception = new InternalServerErrorException();
    }

    const response = (exception as HttpException).getResponse();
    
    const log = {
        timestamp: new Date(),
        message: typeof response === 'object' ? response['message'] : response
    };
    
    this.logger.error(log)
    
    

    res.status((exception as HttpException).getStatus()).json(response)
  }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'CodingSupporter_Backend_0.1';
  }
}

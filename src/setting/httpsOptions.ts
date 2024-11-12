import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

const configService = new ConfigService();
const env = configService.get<string>('NODE_ENV')
export const httpsOptions = env === 'EC2' 
  ? {
      key: process.env.SSL_KEY,
      cert: process.env.SSL_CERT
    }
  : {
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem')
    };
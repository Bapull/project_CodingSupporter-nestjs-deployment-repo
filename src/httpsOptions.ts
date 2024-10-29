import * as fs from 'fs';

export const httpsOptions = process.env.NODE_ENV === 'EC2' 
  ? {
      key: process.env.SSL_KEY,
      cert: process.env.SSL_CERT
    }
  : {
      key: fs.readFileSync('./key.pem'),
      cert: fs.readFileSync('./cert.pem')
    };
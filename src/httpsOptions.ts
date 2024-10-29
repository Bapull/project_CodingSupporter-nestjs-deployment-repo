import * as fs from 'fs';

export const httpsOptions = {
  key:  fs.readFileSync('./key.pem'),
  cert:  fs.readFileSync('./cert.pem')
}
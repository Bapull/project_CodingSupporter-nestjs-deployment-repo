import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { v4 as uuid } from 'uuid';
@Injectable()
export class S3Service {
  private s3: AWS.S3;
  private bucketName:string;

  constructor(
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger:LoggerService
  ) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
  }

  async uploadMdFile(content: string, fileName?: string): Promise<AWS.S3.ManagedUpload.SendData> {
    try{
      const key = fileName ? `incorrect-notes/${fileName}` : `incorrect-notes/no-name.md`;

      const params: AWS.S3.PutObjectRequest = {
        Bucket: this.bucketName,
        Key: key,         // S3에서 저장될 파일 이름 (incorrect-notes 폴더 내에 저장)
        Body: content,     // 파일 내용 (문자열)
        ContentType: 'text/plain',  // 파일 MIME 타입 설정
      };
      
      return await this.s3.upload(params).promise();
    }catch(e){
      this.logger.error('error: ',JSON.stringify(e))
    }
    
  }

  async downloadMdFile(fileName: string) {
    try{
      const params: AWS.S3.GetObjectRequest = {
        Bucket: this.bucketName,
        Key: `incorrect-notes/${fileName}`,  // incorrect-notes 폴더 내의 파일을 가져옴
      };
      return await this.s3.getObject(params).promise();
    }catch(e){
      this.logger.error('error: ',JSON.stringify(e))
    }
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
@Injectable()
export class S3ServiceService {
  private s3: AWS.S3;

  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
  }

  async uploadMdFile(content: string, fileName?: string): Promise<AWS.S3.ManagedUpload.SendData> {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    
    const key = fileName ? `${fileName}-${uuid()}.md` : `${uuid()}.md`;

    const params: AWS.S3.PutObjectRequest = {
      Bucket: bucketName,
      Key: key,         // S3에서 저장될 파일 이름
      Body: content,     // 파일 내용 (문자열)
      ContentType: 'text/plain',  // 파일 MIME 타입 설정
    };

    return await this.s3.upload(params).promise();
  }
}

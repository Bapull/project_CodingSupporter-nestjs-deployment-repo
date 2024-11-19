import { Injectable } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { EmailOption } from 'src/common/types';
import { EmailDto } from './dto/email.dto';

@Injectable()
export class EmailService {
  private transporter:Mail

  constructor(
    private readonly config:ConfigService
  ){
    this.transporter = nodemailer.createTransport({
      service: this.config.get('EMAIL_SERVICE'),
      auth:{
        user:this.config.get('EMAIL_USER'),
        pass:this.config.get('EMAIL_PASSWORD'),
      }
    })
  }

  async sendMail(dto:EmailDto){
    const mailOptions: EmailOption = {
      to: this.config.get('EMAIL_USER'),
      subject:'CodingSupporter 문의 메일',
      html:`
        <div>${dto.email} 에게서 문의 메일입니다.</div>
        <div>${dto.content}</div>
      `
    }
    const mailOptionsToCustomer: EmailOption ={
      to: dto.email,
      subject: '문의 접수 완료',
      html: `
        <div>문의가 접수 되었습니다. 최대한 빠른 시일내에 회신 드리겠습니다.</div>
      `
    }
    await this.transporter.sendMail(mailOptions)
    return await this.transporter.sendMail(mailOptionsToCustomer)
  }
}

import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailDto } from './dto/email.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiErrorResponse, ApiResponseMessage, ApiUnauthorizedResponses } from 'src/common/api-response.decorator';

@ApiTags('email')
@Controller('email')
@ApiUnauthorizedResponses()
@ApiErrorResponse('요청을 처리하지 못했습니다.')
@UseGuards(AuthGuard)
export class EmailController {
  constructor(
    private readonly emailService:EmailService
  ){}

  @ApiOperation({summary:'이메일 전송하기'})
  @ApiBody({type:EmailDto})
  @ApiResponseMessage('이메일 전송완료',HttpStatus.CREATED,'이메일을 성공적으로 전송했습니다.')
  @Post()
  async sendEmail(@Body() dto:EmailDto){
    await this.emailService.sendMail(dto)
    return {
      message:'이메일을 성공적으로 전송했습니다.'
    }
  }
}

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google/google.strategy';
import { AuthService } from './auth.service';
import { SessionSerializer } from './session.serializer';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [GoogleStrategy, AuthService, SessionSerializer],
  exports:[AuthService]
})
export class AuthModule {}

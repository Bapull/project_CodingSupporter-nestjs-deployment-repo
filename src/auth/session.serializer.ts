import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { User } from "src/user/entities/user.entity";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger:LoggerService
  ) {
    super()
  }

  serializeUser(user: User, done: Function) {
    done(null, user.id)  // 사용자 ID만 저장
  }

  async deserializeUser(userId: number, done: Function) {
    try {
      const user = await this.authService.findUserById(userId)
      done(null, user)
    } catch (error) {
      this.logger.error('error: ',JSON.stringify(error), error.stack)
      done(error, null)
    }
  }
}

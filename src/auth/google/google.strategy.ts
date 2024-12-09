import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from 'passport-google-oauth20'
import { AuthService } from "../auth.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(AuthService) private readonly authService:AuthService,
    private readonly configService:ConfigService
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['profile','email']
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile){
    const user = await this.authService.validateUser({
      googleId:profile.id, 
      name: profile.displayName,
      profilePicture: profile.photos[0].value
    })

    return user || null
  }
}
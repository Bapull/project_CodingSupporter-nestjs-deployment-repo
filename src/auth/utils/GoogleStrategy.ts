import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from 'passport-google-oauth20'
import { AuthService } from "../auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(AuthService) private readonly authService:AuthService
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: 'https://localhost:3000/auth/google/redirect',
      scope: ['profile','email']
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile){
    console.log(profile);
    const user = await this.authService.validateUser({
      googleId:profile.id, 
      name: profile.displayName,
      profilePicture: profile.photos[0].value
    })
    return user || null
  }
}
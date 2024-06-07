import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-local';

// import { AuthService } from '~/modules/auth/services';
import { AuthService } from '../../../auth/services'; // fix: vercel issue

@Injectable()
export class LocalOtpStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'otp',
    });
  }

  async validate(email: string, otp: string) {
    return this.authService.loginOtp({
      email,
      otp,
    });
  }
}

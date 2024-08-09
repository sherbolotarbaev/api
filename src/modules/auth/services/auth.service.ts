import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import type { Request, Response } from 'express';

// import { UserService } from '~/modules/user/services';
import { UserService } from '../../user/services'; // fix: vercel issue
// import { PrismaService } from '~/shared/database/services';
import { PrismaService } from '../../../shared/database/services'; // fix: vercel issue
// import { EmailService } from '~/shared/email/services';
import { EmailService } from '../../../shared/email/services'; // fix: vercel issue
// import { LocationService } from '~/shared/location/services';
import { LocationService } from '../../../shared/location/services'; // fix: vercel issue

// import { hash } from '~/utils/bcrypt';
import moment from 'moment';
import type { IPinfo } from 'node-ipinfo';
import { compare, hash } from '../../../utils/bcrypt'; // fix: vercel issue

// import { type IAppConfig, AppConfig } from '~/config';
import { type IAppConfig, AppConfig } from '../../../config'; // fix: vercel issue
import type { IGitHubOauthUser, IGoogleOauthUser } from '../common/interfaces';

// import { isDev } from '~/global/env';
import { isDev } from '../../../global/env'; // fix: vercel issue
// import { COOKIE_NAME } from '~/constants/cookie.constant';
import { COOKIE_NAME } from '../../../constants/cookie.constant'; // fix: vercel issue
// import { ErrorEnum } from '~/constants/error.constant';
import { ErrorEnum } from '../../../constants/error.constant';
import { LoginOtpDto, SendOtpDto, SendOtpResponseModel } from '../dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(AppConfig.KEY) private readonly appConfig: IAppConfig,
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
    private readonly locationService: LocationService,
  ) {}

  async validateUser({
    name,
    surname,
    email,
    photo,
  }: IGoogleOauthUser | IGitHubOauthUser): Promise<IUser> {
    try {
      const user = await this.userService.findByEmail(email);

      if (!user) {
        return this.userService.createUser({
          name,
          surname,
          email,
          photo,
        });
      }

      return user;
    } catch (error) {
      this.logger.error('Failed to validate user:', error.message);
    }
  }

  async oauthCallback(next: string, response: Response): Promise<void> {
    return response
      .status(200)
      .redirect(`${this.appConfig.frontBaseUrl}${next}`);
  }

  async getMe(ip: string, userAgent: string, user: IUser): Promise<IUser> {
    if (!isDev) {
      const location = await this.locationService.getLocation({ ip });
      this.setMetaData(user.id, location, userAgent);
    }

    return user;
  }

  async loginOtp({ email, otp }: LoginOtpDto): Promise<IUser> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException(ErrorEnum.USER_NOT_FOUND);
    }

    if (!user.isActive) {
      throw new ForbiddenException(ErrorEnum.USER_DEACTIVATED);
    }

    const emailOtp = await this.prisma.emailOtp.findUnique({
      where: {
        email: user.email,
      },
    });

    const otpMatch = await compare(otp, emailOtp.otp);
    if (!otpMatch) {
      throw new BadRequestException(ErrorEnum.VERIFICATION_CODE_INVALID);
    }

    if (this.checkExpiration(emailOtp.expiresAt)) {
      throw new BadRequestException(ErrorEnum.VERIFICATION_CODE_EXPIRED);
    }

    try {
      return user;
    } catch (error) {
      this.logger.error('Log in via OTP failed:', error.message);
    }
  }

  async sendOtp({ email }: SendOtpDto): Promise<SendOtpResponseModel> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException(ErrorEnum.USER_NOT_FOUND);
    }

    if (!user.isActive) {
      throw new ForbiddenException(ErrorEnum.USER_DEACTIVATED);
    }

    const otp = this.generateCode();
    const otpHash = await hash(otp);
    const expiresAt = this.getExpiration();

    await Promise.all([
      this.prisma.emailOtp.upsert({
        where: {
          email: user.email,
        },
        create: {
          email: user.email,
          otp: otpHash,
          expiresAt,
        },
        update: {
          otp: otpHash,
          expiresAt,
        },
      }),
      this.emailService.sendVerificationCode({
        email: user.email,
        code: otp,
      }),
    ]);

    try {
      return { email: user.email };
    } catch (error) {
      this.logger.error('Failed to send OTP:', error.message);
    }
  }

  async logout(request: Request, response: Response): Promise<void> {
    response.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      path: '/',
      domain: !isDev ? '.sherbolotarbaev.co' : 'localhost',
      sameSite: !isDev ? 'none' : 'lax',
      secure: !isDev,
      maxAge: 0,
    });

    request.logOut((error) => {
      if (error) {
        this.logger.error('Failed to log out:', error.message);
        return response.status(501).send(ErrorEnum.LOGOUT_FAILED);
      }

      request.session.destroy((error) => {
        if (error) {
          this.logger.error('Failed to destroy session:', error.message);
          return response.status(501).send(ErrorEnum.LOGOUT_FAILED);
        }

        return response.redirect(
          `${this.appConfig.frontBaseUrl}${request.query.next || '/'}`,
        );
      });
    });
  }

  private generateCode(): string {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return code;
  }

  private getExpiration(): Date {
    return moment().add(10, 'minutes').toDate();
  }

  private checkExpiration(expiresAt: Date): boolean {
    return moment.utc(expiresAt).isBefore(moment().utc());
  }

  private async setMetaData(
    userId: number,
    { city, country, region, timezone, ip }: IPinfo,
    device: string,
  ): Promise<IUserMetaData> {
    return this.prisma.userMetaData.upsert({
      where: {
        userId,
      },
      create: {
        userId,
        ip,
        city,
        country,
        region,
        timezone,
        lastSeen: new Date(),
        device,
      },
      update: {
        ip,
        city,
        country,
        region,
        timezone,
        lastSeen: new Date(),
        device,
      },
    });
  }
}

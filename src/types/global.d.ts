import { UserRole } from '@prisma/client';

declare global {
  interface IUser {
    readonly id: number;
    readonly role: UserRole;
    readonly email: string;
    readonly name: string;
    readonly surname: string;
    readonly photo?: string;
    readonly isActive: boolean;
    readonly isVerified: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    readonly metaData: UserMetaData;
  }

  interface IUserMetaData {
    readonly ip: string;
    readonly city?: string;
    readonly region?: string;
    readonly country?: string;
    readonly timezone?: string;
    readonly lastSeen: Date;
  }

  interface ISession {
    readonly id: string;
    readonly sid: string;
    readonly data: string;
    readonly expiresAt: Date;
  }

  interface IGuestBookMessage {
    readonly id: number;
    readonly message: string;
    readonly name: string;
    readonly email: string;
    readonly image: string;
    readonly createdAt: Date;
  }

  interface IView {
    readonly slug: string;
    readonly count: number;
  }

  interface IEmailOtp {
    readonly email: string;
    readonly otp: string;
    readonly expiresAt: Date;
    readonly createdAt: Date;
  }
}
export = {};

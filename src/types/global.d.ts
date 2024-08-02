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
    readonly device?: string;
  }

  interface ISession {
    readonly id: string;
    readonly sid: string;
    readonly data: string;
    readonly expiresAt: Date;
  }

  interface IGuestBookMessageAuthor {
    readonly name: string;
    readonly email: string;
    readonly photo: string;
    readonly isVerified: boolean;
  }

  interface IGuestBookMessage {
    readonly id: number;
    readonly message: string;
    readonly isEdited: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly author: IGuestBookMessageAuthor;
  }

  interface IView {
    readonly slug: string;
    readonly count: number;
    readonly likesCount: number;
  }

  interface ILike {
    readonly userId: number;
    readonly slug: string;
  }

  interface IEmailOtp {
    readonly email: string;
    readonly otp: string;
    readonly expiresAt: Date;
    readonly createdAt: Date;
  }
}
export = {};

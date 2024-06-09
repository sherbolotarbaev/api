declare global {
  interface IUser {
    readonly id: number;
    readonly email: string;
    readonly name: string;
    readonly surname: string;
    readonly photo?: string;
    readonly isActive: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    readonly metaData: UserMetaData;
  }

  interface UserMetaData {
    readonly userId: number;
    readonly ip: string;
    readonly city?: string;
    readonly region?: string;
    readonly country?: string;
    readonly timezone?: string;
    readonly lastSeen: Date;
  }
}
export = {};

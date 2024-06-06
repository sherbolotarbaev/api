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
  }
}
export = {};

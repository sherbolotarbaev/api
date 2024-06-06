import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

// import { UserService } from '~/modules/user/services';
import { UserService } from '../../../user/services'; // fix: vercel issue

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  async serializeUser(
    user: IUser,
    done: (err: Error | null, payload?: IUser) => void,
  ) {
    done(null, user);
  }

  async deserializeUser(
    payload: IUser,
    done: (err: Error | null, payload?: IUser) => void,
  ) {
    const user = await this.userService.findById(payload.id);
    done(null, user || null);
  }
}

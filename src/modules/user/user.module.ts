import { Module } from '@nestjs/common';

import { UserService } from './services';
import { UserController } from './controllers';

@Module({
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

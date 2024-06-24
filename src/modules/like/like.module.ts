import { Module } from '@nestjs/common';

import { LikeController } from './controllers';
import { LikeService } from './services';

@Module({
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}

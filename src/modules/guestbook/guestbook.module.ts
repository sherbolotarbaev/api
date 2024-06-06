import { Module } from '@nestjs/common';

import { GuestbookService } from './services';
import { GuestbookController } from './controllers';

@Module({
  providers: [GuestbookService],
  controllers: [GuestbookController],
})
export class GuestbookModule {}

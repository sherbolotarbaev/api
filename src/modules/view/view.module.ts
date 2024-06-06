import { Module } from '@nestjs/common';

import { ViewController } from './controllers';
import { ViewService } from './services';

@Module({
  controllers: [ViewController],
  providers: [ViewService],
})
export class ViewModule {}

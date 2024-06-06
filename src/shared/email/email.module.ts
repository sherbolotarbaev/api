import { Global, Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';

import { EmailService } from './services';

@Global()
@Module({
  imports: [HttpModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}

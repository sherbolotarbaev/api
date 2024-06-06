import { Global, Module } from '@nestjs/common';
import { LocationService } from './services';

@Global()
@Module({
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}

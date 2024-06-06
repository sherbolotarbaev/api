import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class GetGuestbookMessagesDto {
  @IsOptional()
  @IsInt({ message: 'Query parameter take must be a number.' })
  @Type(() => Number)
  take?: number;
}

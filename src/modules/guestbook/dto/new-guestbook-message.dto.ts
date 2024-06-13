import { IsNotEmpty, IsString } from 'class-validator';

export class NewGuestbookMessageDto {
  @IsNotEmpty({ message: 'Message cannot be empty.' })
  @IsString({ message: 'Message must be a string.' })
  message: string;
}

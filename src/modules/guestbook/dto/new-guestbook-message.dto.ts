import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class NewGuestbookMessageDto {
  @IsNotEmpty({ message: 'Name cannot be empty.' })
  @IsString({ message: 'Name must be a string.' })
  name: string;

  @IsNotEmpty({ message: 'Email cannot be empty.' })
  @IsEmail({}, { message: 'Invalid email.' })
  email: string;

  @IsNotEmpty({ message: 'Image cannot be empty.' })
  @IsString({ message: 'Image must be a string.' })
  image: string;

  @IsNotEmpty({ message: 'Message cannot be empty.' })
  @IsString({ message: 'Message must be a string.' })
  message: string;
}

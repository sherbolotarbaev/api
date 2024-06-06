import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class NewContactMessageDto {
  @IsNotEmpty({ message: 'Name cannot be empty.' })
  @IsString({ message: 'Name must be a string.' })
  @MinLength(2, { message: 'Name must be at least 2 characters long.' })
  @MaxLength(64, { message: 'Name cannot be longer than 64 characters.' })
  name: string;

  @IsNotEmpty({ message: 'Email cannot be empty.' })
  @IsEmail({}, { message: 'Invalid email.' })
  email: string;

  @IsNotEmpty({ message: 'Message cannot be empty.' })
  @IsString({ message: 'Message must be a string.' })
  @MaxLength(500, { message: 'Message cannot be longer than 500 characters.' })
  message: string;
}
